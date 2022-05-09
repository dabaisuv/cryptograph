import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DESComponent } from './des.component';

describe('DESComponent', () => {
  let component: DESComponent;
  let fixture: ComponentFixture<DESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DESComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
