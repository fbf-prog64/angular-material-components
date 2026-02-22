import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimePicker } from './datetime-picker';

describe('DatetimePicker', () => {
  let component: DatetimePicker;
  let fixture: ComponentFixture<DatetimePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatetimePicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
