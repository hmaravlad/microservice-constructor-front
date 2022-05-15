import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private location: Location,
  ) {}

  signUpForm = this.fb.group({
    email: this.fb.control(['']),
    password: this.fb.control(['']),
    confirmPassword: this.fb.control(['']),
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
  }
}
