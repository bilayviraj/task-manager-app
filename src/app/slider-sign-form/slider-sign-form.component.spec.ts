import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderSignFormComponent } from './slider-sign-form.component';

describe('SliderSignFormComponent', () => {
  let component: SliderSignFormComponent;
  let fixture: ComponentFixture<SliderSignFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderSignFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderSignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
