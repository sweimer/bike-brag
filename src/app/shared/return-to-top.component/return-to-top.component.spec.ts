import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnToTopComponent } from './return-to-top.component';

describe('ReturnToTopComponent', () => {
  let component: ReturnToTopComponent;
  let fixture: ComponentFixture<ReturnToTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnToTopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
