import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts'; 
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RealtimeComponent } from './pages/realtime/realtime.component';
import { HistoryComponent } from './pages/history/history.component';
import { SettingComponent } from './pages/setting/setting.component';

import { TablesComponent } from './components/tables/tables.component';
import { ChartsComponent } from './components/charts/charts.component';


@NgModule({
  declarations: [
    AppComponent,
    RealtimeComponent,
    HistoryComponent,
    SettingComponent,
    TablesComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxEchartsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
