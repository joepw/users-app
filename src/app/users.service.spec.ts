import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { User } from './user';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', async () => {
    const mockValue = new Response(JSON.stringify([]), { status: 200, statusText: 'OK', });
    spyOn(window, 'fetch').and.resolveTo(mockValue);
    expect(await service.getAllUsers()).toEqual([]);
  });

  it('should fetch user by id', async () => {
    const mockValue = new Response(JSON.stringify({ id: 1 }), { status: 200, statusText: 'OK', });
    spyOn(window, 'fetch').and.resolveTo(mockValue);
    expect(await service.getUserById('1')).toEqual({ id: 1 } as User);
  });

  it('should throw error on failed fetch', async () => {
    const mockValue = new Response(JSON.stringify(undefined), { status: 500 });
    spyOn(window, 'fetch').and.resolveTo(mockValue);
    spyOn(console, 'error');
    expect(await service.getUserById('1')).toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});
