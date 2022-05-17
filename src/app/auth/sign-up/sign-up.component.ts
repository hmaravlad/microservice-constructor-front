import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { isErrorResponse } from '../../http-utils/query-error.entity';
import { UserCredentials } from '../user-credentials.entity';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../form-page.style.css'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router,
  ) {}

  error = '';

  signUpForm = this.fb.group({
    email: this.fb.control(['']),
    password: this.fb.control(['']),
    confirmPassword: this.fb.control(['']),
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    const user = this.signUpForm.value;
    if (!this.checkPassword(user)) return;
    this.userService.register(user).subscribe(x => {
      if (!isErrorResponse(x)) {
        this.error = '';
        this.router.navigateByUrl('/sign-in');
      } else {
        this.error = x.message[0];
      }
    });
  }

  checkPassword(user: UserCredentials & { confirmPassword: string }): boolean {
    const res = user.password === user.confirmPassword;
    if (!res) this.error = 'Your password and confirmation password do not match';
    return res;
  }
}
