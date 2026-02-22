import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInput } from './file-input';

describe('FileInput', () => {
  let component: FileInput;
  let fixture: ComponentFixture<FileInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
