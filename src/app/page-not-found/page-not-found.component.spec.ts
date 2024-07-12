import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from './page-not-found.component';
import { Router } from '@angular/router';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show not found page', () => {
    const title: HTMLElement = fixture.debugElement.nativeElement.querySelector('h2')
    expect(title.textContent).toEqual('Page Not Found')
  });

  it('should navigate to home', () => {
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const button: HTMLElement = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/'])
  });
});
