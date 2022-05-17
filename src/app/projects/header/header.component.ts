import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isErrorResponse } from 'src/app/http-utils/query-error.entity';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-projects-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    
  }

  onLogout(): void {
    this.userService.logout().subscribe(x => {
      if (isErrorResponse(x)) return;
      this.router.navigateByUrl('sign-in');
    });
  }
}
