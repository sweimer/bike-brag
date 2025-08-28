import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BragStartComponent } from './brag-start.component';

describe('BragStartComponent', () => {
  let component: BragStartComponent;
  let fixture: ComponentFixture<BragStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BragStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BragStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
