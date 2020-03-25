import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRowsContainerComponent } from './form-rows-container.component';

describe('FormRowsContainerComponent', () => {
  let component: FormRowsContainerComponent;
  let fixture: ComponentFixture<FormRowsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRowsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRowsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
