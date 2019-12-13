import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { FileSaverModule } from 'ngx-filesaver';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RealtimeComponent } from './pages/realtime/realtime.component';
import { HistoryComponent } from './pages/history/history.component';
import { DeleteComponent } from './pages/delete/delete.component';

import { TablesComponent } from './components/tables/tables.component';
import { ChartsComponent } from './components/charts/charts.component';

import { StatusPipe } from './pipes/status.pipe';
import { ReportPipe } from './pipes/report.pipe';
import { UnitPipe } from './pipes/unit.pipe';
import { DirectionPipe } from './pipes/direction.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RealtimeComponent,
    HistoryComponent,
    DeleteComponent,
    TablesComponent,
    ChartsComponent,
    StatusPipe,
    ReportPipe,
    UnitPipe,
    DirectionPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule,
    FileSaverModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
