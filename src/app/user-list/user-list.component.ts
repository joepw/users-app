import { Component, inject } from '@angular/core';
import { Location } from "@angular/common";
import { filter } from 'rxjs';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { UsersService } from '../users.service';
import { User } from '../user';
import { SORT_DIRECTION } from './user-list.component.constants';

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
  sortKey: keyof User = 'id';
  sortDirection: typeof SORT_DIRECTION[number] = '';
  searchKeyword = '';
  filteredUserList: User[] = [];


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
    this.userId = String(userId);
  }

  onClickUser(id: number) {
    this.router.navigate(['/users', id]);
  }

  sortData(key: keyof User) {
    if (this.sortKey === key) {
      let newSortDirectionIndex = SORT_DIRECTION.indexOf(this.sortDirection) + 1;
      this.sortDirection = SORT_DIRECTION[newSortDirectionIndex];
      if (!this.sortDirection) {
        this.sortKey = 'id';
      }
    } else {
      this.sortKey = key;
      this.sortDirection = SORT_DIRECTION[0];
    }
    this.userList.sort((userA, userB) => {
      let result = 0;
      if (userA[this.sortKey] < userB[this.sortKey]) {
        result = -1;
      }
      if (userA[this.sortKey] > userB[this.sortKey]) {
        result = 1;
      }
      if (this.sortDirection === 'DESC') result *= -1;
      return result;
    })
  }

  onInputChange($event: Event) {
    const inputValue = ($event.target as HTMLInputElement).value;
    this.searchKeyword = inputValue.toLowerCase();
    this.filteredUserList = this.userList.filter(user => {
      return user.name.toLowerCase().includes(this.searchKeyword)
        || user.email.toLowerCase().includes(this.searchKeyword)
        || user.website.toLowerCase().includes(this.searchKeyword);
    })
  }
}
