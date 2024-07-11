import { Component, inject } from '@angular/core';
import { Location } from "@angular/common";
import { filter } from 'rxjs';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UsersService } from '../users.service';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink, UserDetailComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  userService = inject(UsersService);
  userList: User[] = [];
  userId = '';
  isLoading = true;

  constructor(private router: Router, private location: Location) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.checkPath());
    this.userService.getAllUsers().then(users => {
      if (users) {
        this.userList = users;
      }
      this.isLoading = false;
    });
  }

  checkPath() {
    const loc = this.location;
    const userId = loc.path().split('/').pop();
    this.userId = userId || '';
  }

  onClickUser(id: number) {
    this.router.navigate(['/users', id]);
  }
}
