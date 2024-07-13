import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { UserListComponent } from './user-list.component';
import { UsersService } from '../users.service';
import { User } from '../user';
import { routes } from '../app.routes';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{
        provide: UsersService,
        useValue: jasmine.createSpyObj('UsersService', ['getAllUsers'])
      }, provideRouter(routes)],
    })
    .compileComponents();
    userServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    userServiceSpy.getAllUsers.and.resolveTo([
      { id: 1, name: 'Budi', email: 'budi@budi.com', website: 'budi.com' } as User,
      { id: 2, name: 'Adi', email: 'adi@a.com', website: 'adi.com' } as User]
    );

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render title correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Users');
  });

  it('should show user list correctly', fakeAsync(() => {    
    tick();
    fixture.detectChanges();
    const name: HTMLElement = fixture.debugElement.nativeElement.querySelector('.entries > span');
    expect(name.textContent).toEqual('Budi');
  }));

  it('should navigate to user detail', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const name: HTMLElement = fixture.debugElement.nativeElement.querySelector('.entries > span');
    name.click();
    expect(router.navigate).toHaveBeenCalledWith(['/users', 1]);
  }))

  it('should set user id on location change', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    const name: HTMLElement = fixture.debugElement.nativeElement.querySelector('.entries > span');
    name.click();
    tick();
    expect(component.userId).toBe('1');
  }))

  it('should sort table correctly', fakeAsync(() => {    
    tick();
    fixture.detectChanges();
    let name: HTMLElement[] = fixture.debugElement.nativeElement.querySelectorAll('.entries > span');
    expect(name[0].textContent).toEqual('Budi');
    const headers: HTMLElement[] = fixture.debugElement.nativeElement.querySelectorAll('.head-wrapper');
    const nameHeader = headers[0];
    nameHeader.click();
    fixture.detectChanges();
    name = fixture.debugElement.nativeElement.querySelectorAll('.entries > span');
    expect(component.sortKey).toBe('name');
    expect(component.sortDirection).toBe('ASC');
    expect(name[0].textContent).toEqual('Adi');
  
    nameHeader.click();
    fixture.detectChanges();
    name = fixture.debugElement.nativeElement.querySelectorAll('.entries > span');
    expect(component.sortKey).toBe('name');
    expect(component.sortDirection).toBe('DESC');
    expect(name[0].textContent).toEqual('Budi');

    nameHeader.click();
    fixture.detectChanges();
    name = fixture.debugElement.nativeElement.querySelectorAll('.entries > span');
    expect(component.sortKey).toBe('id');
    expect(component.sortDirection).toBe('');
    expect(name[0].textContent).toEqual('Budi');
  }));

  it('should sort user list correctly', fakeAsync(async () => {    
    tick();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input');
    input.value = 'adi';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchKeyword).toBe('adi');
    let name = fixture.debugElement.nativeElement.querySelector('.entries > span');
    expect(name.textContent).toEqual('Adi');

    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchKeyword).toBe('');
    name = fixture.debugElement.nativeElement.querySelector('.entries > span');
    expect(name.textContent).toEqual('Budi');

    input.value = 'asdf';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchKeyword).toBe('asdf');
    name = fixture.debugElement.nativeElement.querySelector('.entries > span');
    expect(name).toBeNull();
  }));
});
