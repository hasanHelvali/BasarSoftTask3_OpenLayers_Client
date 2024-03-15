import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntersectionComponent } from './intersection.component';

describe('IntersectionComponent', () => {
  let component: IntersectionComponent;
  let fixture: ComponentFixture<IntersectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntersectionComponent]
    });
    fixture = TestBed.createComponent(IntersectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
