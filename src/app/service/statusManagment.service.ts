import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatusManagmentService {

  public connectSuccess = new BehaviorSubject(false);
  public disabledOtherRouter = new BehaviorSubject(false);
  public finishedAlert = new BehaviorSubject(false);
  public focus = new BehaviorSubject(false);
  public auth = new BehaviorSubject(true);
  public openRemindError = new BehaviorSubject({ isOpen: false, message:""});

  constructor(public _http:HttpClient) { }

  resetDisabled(){
    this._http.post('http://localhost:5001/screwdrive/device/disable', {"disable":false}).subscribe(res => {
      // console.log("success")
    })
  }

  resetIndex(){
    this._http.post('http://localhost:5001/screwdrive/resetTime',{}).subscribe(res => {
      // console.log("reset success")
    }, error => {
      // console.log("error",error)
      this.connectSuccess.next(false)
    });
  }
}
