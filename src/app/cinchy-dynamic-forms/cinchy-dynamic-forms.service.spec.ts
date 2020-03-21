import { TestBed } from '@angular/core/testing';

import { CinchyDynamicFormsService } from './cinchy-dynamic-forms.service';

describe('CinchyDynamicFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CinchyDynamicFormsService = TestBed.get(CinchyDynamicFormsService);
    expect(service).toBeTruthy();
  });
});
