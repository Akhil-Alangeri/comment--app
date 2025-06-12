import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.css'],
})
export class CommentItemComponent implements OnInit {
  @Input() item!: { id: number; title: string; description: string };
  

  ngOnInit(): void {
    console.log(this.item, 'from comment item');
  }
}
