import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractFormComponent } from './add-contract-form.component';

describe('AddContractFormComponent', () => {
  let component: AddContractFormComponent;
  let fixture: ComponentFixture<AddContractFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
