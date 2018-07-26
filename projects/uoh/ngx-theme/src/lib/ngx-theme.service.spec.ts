import { TestBed, inject } from '@angular/core/testing';

import { NgxThemeService } from './ngx-theme.service';

describe('NgxThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxThemeService]
    });
  });

  it('should be created', inject([NgxThemeService], (service: NgxThemeService) => {
    expect(service).toBeTruthy();
  }));
});
