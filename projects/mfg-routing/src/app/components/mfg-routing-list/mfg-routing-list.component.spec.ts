import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfgRoutingListComponent } from './mfg-routing-list.component';

describe('MfgRoutingListComponent', () => {
  let component: MfgRoutingListComponent;
  let fixture: ComponentFixture<MfgRoutingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfgRoutingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfgRoutingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
