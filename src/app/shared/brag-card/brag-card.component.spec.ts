import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BragCardGroup } from './brag-card-group';

describe('BragCardGroup', () => {
  let component: BragCardGroup;
  let fixture: ComponentFixture<BragCardGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BragCardGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BragCardGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
