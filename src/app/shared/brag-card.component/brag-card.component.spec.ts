import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BragCardComponent } from './brag-card.component';

describe('BragCardComponent', () => {
  let component: BragCardComponent;
  let fixture: ComponentFixture<BragCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BragCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BragCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
