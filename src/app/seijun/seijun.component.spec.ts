import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeijunComponent } from './seijun.component';

describe('SeijunComponent', () => {
  let component: SeijunComponent;
  let fixture: ComponentFixture<SeijunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeijunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeijunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
