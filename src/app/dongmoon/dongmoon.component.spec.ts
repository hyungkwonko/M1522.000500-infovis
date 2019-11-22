import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DongmoonComponent } from './dongmoon.component';

describe('DongmoonComponent', () => {
  let component: DongmoonComponent;
  let fixture: ComponentFixture<DongmoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DongmoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DongmoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
