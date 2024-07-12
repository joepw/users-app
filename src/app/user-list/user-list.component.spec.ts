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
    userServiceSpy.getAllUsers.and.resolveTo([{ id: 1, name: 'Budi' } as User]);

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
    const name: HTMLElement = fixture.debugElement.nativeElement.querySelector('.name > span');
    expect(name.textContent).toEqual('Budi');
  }));

  it('should navigate to user detail', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const name: HTMLElement = fixture.debugElement.nativeElement.querySelector('.name > span');
    name.click();
    expect(router.navigate).toHaveBeenCalledWith(['/users', 1]);
  }))

  it('should set user id on location change', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    const name: HTMLElement = fixture.debugElement.nativeElement.querySelector('.name > span');
    name.click();
    tick();
    expect(component.userId).toBe('1');
  }))

  // it('should show no data on empty result', fakeAsync(() => {    
  //   mockValue = [];
  //   fixture = TestBed.createComponent(UserListComponent);
  //   fixture.detectChanges();
  //   tick();
  //   const noData: HTMLElement = fixture.debugElement.nativeElement.querySelector('td');
  //   expect(noData.textContent).toEqual('No Data');
  // }));
});
