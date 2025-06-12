import { Routes } from '@angular/router';
import { CommentsListComponent } from './pages/comments-list/comments-list.component';
import { LoginComponent } from './pages/login/login.component';
import { CommentDetailsComponent } from './pages/comment-details/comment-details.component';
 

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'comments-list',
    component: CommentsListComponent,
  },
  {
    path: 'comments-details/:id',
    component: CommentDetailsComponent,
  },
];
