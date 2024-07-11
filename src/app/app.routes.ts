import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    children: [
      {
        path: 'users/:id',
        component: UserListComponent
      },
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
