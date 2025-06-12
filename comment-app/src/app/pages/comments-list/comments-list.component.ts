import { Component, inject, OnInit } from '@angular/core';
import { Comments, CommentsService } from '../../services/comments.service';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [CommentItemComponent, CommonModule],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css',
})
export class CommentsListComponent implements OnInit {
  commentsList: Comments[] = [];
  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.commentsService.getComments().subscribe({
      next: (comments) => {
        this.commentsList = comments;
      },
      error: (err) => {
        console.error('Failed to load comments', err);
      },
    });
  }
}
