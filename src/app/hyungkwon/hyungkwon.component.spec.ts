import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyungkwonComponent } from './hyungkwon.component';

describe('HyungkwonComponent', () => {
  let component: HyungkwonComponent;
  let fixture: ComponentFixture<HyungkwonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyungkwonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyungkwonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
