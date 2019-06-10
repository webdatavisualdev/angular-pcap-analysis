import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,
  MatInputModule,
  MatCheckboxModule,
  MatDividerModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatTooltipModule,
  MatTabsModule,
  MatExpansionModule,
  MatIconModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { PacketChartComponent } from './components/packet-chart/packet-chart.component';
import { PacketDetailComponent } from './components/packet-detail/packet-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PacketChartComponent,
    PacketDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
