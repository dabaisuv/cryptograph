import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionAlgorithmComponent } from './encryption-algorithm.component';

describe('EncryptionAlgorithmComponent', () => {
  let component: EncryptionAlgorithmComponent;
  let fixture: ComponentFixture<EncryptionAlgorithmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncryptionAlgorithmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
