import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarlandingPageComponent } from './navbarlanding-page-component';

describe('NavbarlandingPageComponent', () => {
  let component: NavbarlandingPageComponent;
  let fixture: ComponentFixture<NavbarlandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarlandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarlandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
