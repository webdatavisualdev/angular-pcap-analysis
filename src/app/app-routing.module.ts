import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PacketDetailComponent } from './components/packet-detail/packet-detail.component';
import { PacketChartComponent } from './components/packet-chart/packet-chart.component';
import { CallDetailComponent } from './components/call-detail/call-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'chart',
    pathMatch: 'full'
  },
  {
    path: 'chart',
    component: PacketChartComponent
  },
  {
    path: 'chart/:fileId',
    component: PacketChartComponent
  },
  {
    path: ':fileId/:id',
    component: PacketDetailComponent
  },
  {
    path: 'calls/:fileId/:id',
    component: CallDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
