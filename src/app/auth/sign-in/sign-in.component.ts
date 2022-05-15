import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private location: Location,
  ) {}

  signInForm = this.fb.group({
    email: this.fb.control(['']),
    password: this.fb.control(['']),
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
  }
}
