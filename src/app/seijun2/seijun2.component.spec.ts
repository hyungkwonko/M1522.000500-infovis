import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Seijun2Component } from './seijun2.component';

describe('Seijun2Component', () => {
  let component: Seijun2Component;
  let fixture: ComponentFixture<Seijun2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Seijun2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Seijun2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
