import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RealtimeComponent } from './pages/realtime/realtime.component';
import { HistoryComponent } from './pages/history/history.component';
import { DeleteComponent } from './pages/delete/delete.component';


const routes: Routes = [
  {
    path:"",
    component:RealtimeComponent
  },
  {
    path:"history",
    component:HistoryComponent
  },
  {
    path: "delete",
    component:DeleteComponent
  },
  {
    path:"**",
    component:RealtimeComponent
  }
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [
      RouterModule
   ],

})
export class AppRoutingModule { }
