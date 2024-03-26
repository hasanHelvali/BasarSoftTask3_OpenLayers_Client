import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographyAuthorityComponent } from './geography-authority.component';

describe('GeographyAuthorityComponent', () => {
  let component: GeographyAuthorityComponent;
  let fixture: ComponentFixture<GeographyAuthorityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeographyAuthorityComponent]
    });
    fixture = TestBed.createComponent(GeographyAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
