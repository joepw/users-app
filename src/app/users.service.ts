import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'https://jsonplaceholder.typicode.com/users';
  constructor() { }

  async fetchData(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch data failed with status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.fetchData(this.url);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.fetchData(`${this.url}/${id}`);
  }
}
