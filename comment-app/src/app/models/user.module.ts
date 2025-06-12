import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
