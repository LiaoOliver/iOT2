import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusManagmentService {

  public connectSuccess = new BehaviorSubject(false);
  public disabledOtherRouter = new BehaviorSubject(false);
  public finishedAlert = new BehaviorSubject(false);
  public focus = new BehaviorSubject(false);
  constructor() { }

}
