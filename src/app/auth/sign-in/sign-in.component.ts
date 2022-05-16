import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { isErrorResponse } from '../query-error.entity';
import { isUser } from '../user.entity';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../form-page.style.css'],
})
export class SignInComponent implements OnInit {
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router,
  ) {}

  error = '';

  signInForm = this.fb.group({
    email: this.fb.control(['']),
    password: this.fb.control(['']),
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.userService.login(this.signInForm.value).subscribe(x => {
      if (isUser(x)) {
        this.error = '';
        this.router.navigateByUrl('/projects');
      } else if (isErrorResponse(x)) {
        this.error = x.message[0];
      }
    });
  }
}
