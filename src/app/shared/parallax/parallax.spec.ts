import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Parallax } from './parallax';

describe('Parallax', () => {
  let component: Parallax;
  let fixture: ComponentFixture<Parallax>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Parallax]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Parallax);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
