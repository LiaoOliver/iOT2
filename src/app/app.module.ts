import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RealtimeComponent } from './pages/realtime/realtime.component';
import { HistoryComponent } from './pages/history/history.component';
import { DeleteComponent } from './pages/delete/delete.component';

import { TablesComponent } from './components/tables/tables.component';
import { ChartsComponent } from './components/charts/charts.component';

import { StatusPipe } from './status.pipe';
import { ReportPipe } from './report.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RealtimeComponent,
    HistoryComponent,
    DeleteComponent,
    TablesComponent,
    ChartsComponent,
    StatusPipe,
    ReportPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
