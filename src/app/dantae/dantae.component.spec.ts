import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DantaeComponent } from './dantae.component';

describe('DantaeComponent', () => {
  let component: DantaeComponent;
  let fixture: ComponentFixture<DantaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DantaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DantaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
