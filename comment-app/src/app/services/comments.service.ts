import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommentReply {
  votes: any;
  replies: any;
  timestamp: any;
  replyText: any;
  id: number;
  reply_text: string;
  comment_id: number;
  parent_reply_id?: number;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  nested_replies: CommentReply[];
  showReplyForm?: boolean;
  replyInput?: string;
}

export interface Comments {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  replies: CommentReply[];
}

export interface CreateCommentRequest {
  title: string;
  description: string;
}

export interface CreateReplyRequest {
  replyText: string; // ✅ match the FastAPI expectation
}

export interface UpdateCommentRequest {
  title: string;
  description: string;
}

export interface LikeResponse {
  message: string;
  likes_count: number;
}

export interface AppStats {
  total_comments: number;
  total_replies: number;
  total_comment_likes: number;
  total_reply_likes: number;
  total_likes: number;
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = 'http://localhost:8000/api'; // FastAPI backend URL with MySQL

  constructor(private http: HttpClient) {}

  // Comment CRUD operations
  getComments(): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.apiUrl}/comments`);
  }

  getComment(id: number): Observable<Comments> {
    return this.http.get<Comments>(`${this.apiUrl}/comments/${id}`);
  }

  createComment(comment: CreateCommentRequest): Observable<Comments> {
    return this.http.post<Comments>(`${this.apiUrl}/comments`, comment);
  }

  updateComment(
    id: number,
    comment: UpdateCommentRequest
  ): Observable<Comments> {
    return this.http.put<Comments>(`${this.apiUrl}/comments/${id}`, comment);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${id}`);
  }

  // Reply operations
  addReply(
    commentId: number,
    reply: CreateReplyRequest
  ): Observable<CommentReply> {
    return this.http.post<CommentReply>(
      `${this.apiUrl}/comments/${commentId}/replies`,
      reply
    );
  }

  addNestedReply(
    commentId: number,
    replyId: number,
    reply: CreateReplyRequest
  ): Observable<CommentReply> {
    return this.http.post<CommentReply>(
      `${this.apiUrl}/comments/${commentId}/replies/${replyId}/replies`,
      reply
    );
  }

  deleteReply(commentId: number, replyId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/comments/${commentId}/replies/${replyId}`
    );
  }

  // Like operations
  toggleCommentLike(commentId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(
      `${this.apiUrl}/comments/${commentId}/like`,
      {}
    );
  }

  toggleReplyLike(
    commentId: number,
    replyId: number
  ): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(
      `${this.apiUrl}/comments/${commentId}/replies/${replyId}/like`,
      {}
    );
  }

  // Statistics
  getStats(): Observable<AppStats> {
    return this.http.get<AppStats>(`${this.apiUrl}/stats`);
  }

  // Health check
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl.replace('/api', '')}/health`);
  }
}
