import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserDetailComponent } from './user-detail.component';
import { UsersService } from '../users.service';
import { User } from '../user';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [{
        provide: UsersService,
        useValue: jasmine.createSpyObj('UsersService', ['getUserById'])
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user detail correctly', fakeAsync(() => {    
    userServiceSpy.getUserById.and.resolveTo({ id: 1, name: 'Budi' } as User);
    component.userId = '1';
    expect(component.userId).toBe('1');
    tick();
    fixture.detectChanges();
    const title: HTMLElement = fixture.debugElement.nativeElement.querySelector('h1');
    expect(title.textContent).toEqual('Budi');
  }));

  it('should show error state', fakeAsync(() => {    
    userServiceSpy.getUserById.and.resolveTo(undefined);
    component.userId = '1';
    tick();
    fixture.detectChanges();
    const title: HTMLElement = fixture.debugElement.nativeElement.querySelector('h1');
    expect(title.textContent).toEqual('404 Not Found');
    const table: HTMLElement = fixture.debugElement.nativeElement.querySelector('table');
    expect(table).toBeNull();
  }));

  it('should navigate to home', fakeAsync(() => {
    userServiceSpy.getUserById.and.resolveTo({} as User);
    component.userId = '1';
    tick();
    fixture.detectChanges();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const overlay: HTMLElement = fixture.debugElement.nativeElement.querySelector('.overlay');
    overlay.click();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  
  it('should navigate back', fakeAsync(() => {
    userServiceSpy.getUserById.and.resolveTo({} as User);
    component.userId = '1';
    tick();
    fixture.detectChanges();
    location = TestBed.inject(Location);
    spyOn(location, 'back');
    const button: HTMLElement = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(location.back).toHaveBeenCalled();
  }));
});
