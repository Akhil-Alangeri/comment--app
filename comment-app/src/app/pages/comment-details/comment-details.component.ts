import { Component, inject, OnInit } from '@angular/core';
import {
  CommentReply,
  Comments,
  CommentsService,
} from '../../services/comments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-comment-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-details.component.html',
  styleUrls: ['./comment-details.component.css'],
})
export class CommentDetailsComponent implements OnInit {
  commentItem: Comments | undefined;
  newReplyText: string = '';
  loading: boolean = false;
  error: string = '';
  likingComment: boolean = false;
  likingReply: { [key: number]: boolean } = {};

  commentsService = inject(CommentsService);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadComment();
  }

  loadComment() {
    const id = Number(this.route.snapshot.params['id']);
    this.loading = true;
    this.error = '';

    this.commentsService.getComment(id).subscribe({
      next: (comment) => {
        this.commentItem = comment;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load comment';
        this.loading = false;
        console.error('Error loading comment:', err);
      },
    });
  }

  getComment() {
    const id = Number(this.route.snapshot.params['id']);
    this.loading = true;
    this.error = '';

    this.commentsService.getComment(id).subscribe({
      next: (comment) => {
        this.commentItem = comment;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load comment';
        this.loading = false;
        console.error('Error loading comment:', err);
      },
    });
  }

  toggleReplyForm(reply: CommentReply) {
    reply.showReplyForm = !reply.showReplyForm;
    if (!reply.replyInput) reply.replyInput = '';
  }

  submitReply() {
    if (!this.newReplyText.trim() || !this.commentItem) return;

    this.loading = true;
    this.commentsService
      .addReply(this.commentItem.id, { replyText: this.newReplyText })
      .subscribe({
        next: (newReply) => {
          if (!this.commentItem!.replies) {
            this.commentItem!.replies = [];
          }
          this.commentItem!.replies.push(newReply);
          this.newReplyText = '';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to add reply';
          this.loading = false;
          console.error('Error adding reply:', err);
        },
      });
  }

  submitNestedReply(parent: CommentReply) {
    if (!parent.replyInput?.trim() || !this.commentItem) return;

    this.loading = true;
    this.commentsService
      .addNestedReply(this.commentItem.id, parent.id, {
        replyText: parent.replyInput,
      })
      .subscribe({
        next: () => {
          this.loadComment(); // Reload full comment tree
          parent.replyInput = '';
          parent.showReplyForm = false;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to add nested reply';
          this.loading = false;
          console.error('Error adding nested reply:', err);
        },
      });
  }

  // Deletes a top-level reply by index (matches your HTML template)
  onDeleteComment(index: number) {
    if (!this.commentItem?.replies || !this.commentItem.replies[index]) return;

    const replyToDelete = this.commentItem.replies[index];

    if (confirm('Are you sure you want to delete this reply?')) {
      this.loading = true;
      this.commentsService
        .deleteReply(this.commentItem.id, replyToDelete.id)
        .subscribe({
          next: () => {
            // Remove from local data
            if (this.commentItem!.replies) {
              this.commentItem!.replies.splice(index, 1);
            }
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to delete reply';
            this.loading = false;
            console.error('Error deleting reply:', err);
          },
        });
    }
  }

  // Deletes a nested reply by index (matches your HTML template)
  onDeleteNested(parentReply: CommentReply, index: number) {
    console.log(parentReply);
    if (
      !parentReply.replies ||
      !parentReply.replies[index] ||
      !this.commentItem
    )
      return;

    const nestedReplyToDelete = parentReply.replies[index];

    if (confirm('Are you sure you want to delete this nested reply?')) {
      this.loading = true;
      this.commentsService
        .deleteReply(this.commentItem.id, nestedReplyToDelete.id)
        .subscribe({
          next: () => {
            this.loadComment(); // Get updated replies
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to delete nested reply';
            this.loading = false;
            console.error('Error deleting nested reply:', err);
          },
        });
    }
  }

  // Deletes the entire comment item (main comment and its replies)
  deleteMainComment() {
    if (!this.commentItem) return;

    if (
      confirm(
        'Are you sure you want to delete this comment? This action cannot be undone.'
      )
    ) {
      this.loading = true;
      this.commentsService.deleteComment(this.commentItem.id).subscribe({
        next: () => {
          this.loading = false;
          alert('Comment deleted successfully.');
          // Navigate back to comments list
          this.router.navigate(['/comments']); // Adjust route as needed
        },
        error: (err) => {
          this.error = 'Failed to delete comment';
          this.loading = false;
          console.error('Error deleting comment:', err);
        },
      });
    }
  }
}
