import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// comment.model.ts
export interface CommentReply {
  id: number;
  replyText: string;
  timestamp: string;
  replies: CommentReply[]; // ✅ Make sure this is NOT optional and correctly typed
  replyInput?: string;
  showReplyForm?: boolean;
}


export interface Comments {
  id: number;
  title: string;
  description: string;
  replies: CommentReply[];
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class CommentModule {}
