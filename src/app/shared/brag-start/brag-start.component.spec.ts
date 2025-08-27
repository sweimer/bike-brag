import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BragStart } from './brag-start.component';

describe('BragStart', () => {
  let component: BragStart;
  let fixture: ComponentFixture<BragStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BragStart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BragStart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
