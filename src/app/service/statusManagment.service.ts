import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatusManagmentService {

  public connectSuccess:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public disabledOtherRouter:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public finishedAlert:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public focus:BehaviorSubject<boolean> = new BehaviorSubject(false);
  public auth:BehaviorSubject<boolean> = new BehaviorSubject(true);
  public openRemindError = new BehaviorSubject({ isOpen: false, message:""});
  public reset$:Subject<any> = new Subject();
  public download$:Subject<any> = new Subject();

  constructor(public _http:HttpClient) { }

  resetDisabled(){
    this._http.post('http://localhost:5001/screwdrive/device/disable', {"disable":false}).subscribe()
  }

  resetIndex(){
    this._http.post('http://localhost:5001/screwdrive/resetTime',{}).subscribe(res => {
    }, error => {
      this.connectSuccess.next(false)
    });
  }

  // 取得字元設定長度
  getCharLengthSetting(){
    return this._http.get('http://localhost:5001/screwdrive/charLength')
  }
}
