import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketChartComponent } from './packet-chart.component';

describe('PacketChartComponent', () => {
  let component: PacketChartComponent;
  let fixture: ComponentFixture<PacketChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacketChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
