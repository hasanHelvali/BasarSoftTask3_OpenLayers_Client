import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeNgModalComponent } from './prime-ng-modal.component';

describe('PrimeNgModalComponent', () => {
  let component: PrimeNgModalComponent;
  let fixture: ComponentFixture<PrimeNgModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimeNgModalComponent]
    });
    fixture = TestBed.createComponent(PrimeNgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
