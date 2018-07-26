import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxThemeComponent } from './ngx-theme.component';

describe('NgxThemeComponent', () => {
  let component: NgxThemeComponent;
  let fixture: ComponentFixture<NgxThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
