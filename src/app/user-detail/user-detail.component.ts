import { Component, inject, Input } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  private _userId = '';
  @Input()
  set userId(value: string) {
    this._userId = value;
    this.isError = false;
    if (value) {
      this.fetchUserDetails(value);
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  };
  get userId(): string {
    return this._userId;
  }
  userService = inject(UsersService);
  userDetail: User = {
    id: 0,
    name: '',
    username: '',
    email: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: {
        lat: '',
        lng: ''
      }
    },
    phone: '',
    website: '',
    company: {
      name: '',
      catchPhrase: '',
      bs: ''
    }
  };
  isError = false;
  isOpen = false;
  isLoading = true;

  constructor(private location: Location, private router: Router) {}

  fetchUserDetails(id: string) {
    this.isLoading = true;
    this.userService.getUserById(id).then(user => {
      if (user) {
        this.userDetail = user;
      } else {
        this.isError = true;
      }
      this.isLoading = false;
    });
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
