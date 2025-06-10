from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import time

app = FastAPI(title="Comments API", description="Backend for Angular Comments System")

# Enable CORS for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class CommentReply(BaseModel):
    id: int
    replyText: str
    timestamp: str
    replies: List['CommentReply'] = []
    showReplyForm: Optional[bool] = False
    replyInput: Optional[str] = ""

class Comment(BaseModel):
    id: int
    title: str
    description: str
    replies: Optional[List[CommentReply]] = []

from typing import Optional
from pydantic import BaseModel

class CreateReplyRequest(BaseModel):
    replyText: str
    parent_reply_id: Optional[int] = None


class CreateCommentRequest(BaseModel):
    title: str
    description: str

# Update the model to handle self-referencing
CommentReply.model_rebuild()

# In-memory storage (replace with database in production)
comments_db: List[Comment] = [
    Comment(
        id=1,
        title="Amazing Angular Tips",
        description="Learn how to build efficient and scalable Angular apps with these practical tips.",
        replies=[]
    ),
    Comment(
        id=2,
        title="Understanding Dependency Injection",
        description="A beginner-friendly explanation of Angular's powerful DI system.",
        replies=[]
    ),
    Comment(
        id=3,
        title="Styling Components the Right Way",
        description="Best practices for styling Angular components with CSS and SCSS.",
        replies=[]
    ),
    Comment(
        id=4,
        title="Reactive Forms vs Template-driven Forms",
        description="Comparing Angular's two form building techniques for better UX.",
        replies=[]
    ),
    Comment(
        id=5,
        title="Optimizing Angular Performance",
        description="Tips and tricks to make your Angular applications load faster and run smoother.",
        replies=[]
    )
]

# Helper functions
def get_current_timestamp() -> str:
    return datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

def generate_id() -> int:
    return int(time.time() * 1000)

def find_comment_by_id(comment_id: int) -> Optional[Comment]:
    return next((comment for comment in comments_db if comment.id == comment_id), None)

def find_reply_by_id(replies: List[CommentReply], reply_id: int) -> Optional[CommentReply]:
    for reply in replies:
        if reply.id == reply_id:
            return reply
        # Search in nested replies
        nested_reply = find_reply_by_id(reply.replies, reply_id)
        if nested_reply:
            return nested_reply
    return None

def delete_reply_by_id(replies: List[CommentReply], reply_id: int) -> bool:
    for i, reply in enumerate(replies):
        if reply.id == reply_id:
            replies.pop(i)
            return True
        # Try to delete from nested replies
        if delete_reply_by_id(reply.replies, reply_id):
            return True
    return False

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Comments API is running"}

@app.get("/api/comments", response_model=List[Comment])
async def get_comments():
    """Get all comments"""
    return comments_db

@app.get("/api/comments/{comment_id}", response_model=Comment)
async def get_comment(comment_id: int):
    """Get a specific comment by ID"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment

@app.post("/api/comments", response_model=Comment)
async def create_comment(comment_data: CreateCommentRequest):
    """Create a new comment"""
    new_comment = Comment(
        id=generate_id(),
        title=comment_data.title,
        description=comment_data.description,
        replies=[]
    )
    comments_db.append(new_comment)
    return new_comment

@app.delete("/api/comments/{comment_id}")
async def delete_comment(comment_id: int):
    """Delete a comment"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comments_db.remove(comment)
    return {"message": "Comment deleted successfully"}

@app.post("/api/comments/{comment_id}/replies", response_model=CommentReply)
async def add_reply_to_comment(comment_id: int, reply_data: CreateReplyRequest):
    """Add a reply to a comment"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    new_reply = CommentReply(
        id=generate_id(),
        replyText=reply_data.replyText,
        timestamp=get_current_timestamp(),
        replies=[],
        showReplyForm=False,
        replyInput=""
    )
    
    if comment.replies is None:
        comment.replies = []
    comment.replies.append(new_reply)
    
    return new_reply

@app.post("/api/comments/{comment_id}/replies", response_model=CommentReply)
async def add_reply_to_comment(comment_id: int, reply_data: CreateReplyRequest):
    """Add a reply to a comment or to a reply (nested)"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    new_reply = CommentReply(
        id=generate_id(),
        replyText=reply_data.replyText,
        timestamp=get_current_timestamp(),
        replies=[],  # nested replies
        showReplyForm=False,
        replyInput=""
    )

    if reply_data.parent_reply_id:
        # Look for the parent reply in top-level replies
        for reply in comment.replies:
            if reply.id == reply_data.parent_reply_id:
                reply.replies.append(new_reply)
                return new_reply
            # Check nested replies
            for nested in reply.replies:
                if nested.id == reply_data.parent_reply_id:
                    nested.replies.append(new_reply)
                    return new_reply

        raise HTTPException(status_code=404, detail="Parent reply not found")
    else:
        comment.replies.append(new_reply)
        return new_reply


@app.post("/api/comments/{comment_id}/replies/{reply_id}/replies", response_model=CommentReply)
async def add_nested_reply(comment_id: int, reply_id: int, reply_data: CreateReplyRequest):
    """Add a nested reply to an existing reply"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    parent_reply = find_reply_by_id(comment.replies or [], reply_id)
    if not parent_reply:
        raise HTTPException(status_code=404, detail="Parent reply not found")
    
    new_reply = CommentReply(
        id=generate_id(),
        replyText=reply_data.replyText,
        timestamp=get_current_timestamp(),
        replies=[],
        showReplyForm=False,
        replyInput=""
    )
    
    if parent_reply.replies is None:
        parent_reply.replies = []
    parent_reply.replies.append(new_reply)
    
    return new_reply

@app.delete("/api/comments/{comment_id}/replies/{reply_id}")
async def delete_reply(comment_id: int, reply_id: int):
    """Delete a reply (works for both top-level and nested replies)"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if not comment.replies:
        raise HTTPException(status_code=404, detail="Reply not found")
    
    # Try to delete the reply
    if delete_reply_by_id(comment.replies, reply_id):
        return {"message": "Reply deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Reply not found")

@app.put("/api/comments/{comment_id}", response_model=Comment)
async def update_comment(comment_id: int, comment_data: CreateCommentRequest):
    """Update a comment"""
    comment = find_comment_by_id(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment.title = comment_data.title
    comment.description = comment_data.description
    
    return comment

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": get_current_timestamp()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

