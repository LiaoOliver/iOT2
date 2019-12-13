import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StatusManagmentService } from '../../service/statusManagment.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {

  public finishedAlert:boolean = false;
  public showConnectAlert:boolean = false;
  public stopAlert:boolean = false;
  public dashboard = {
    time: 0,
    angle: 0,
    torque: 0,
    status: 0
  }
  public tableReport = [];
  public toggleBtn:boolean = true;
  public isConnect:boolean = false;
  public stopAndReset:boolean = false;
  public enabledReset:boolean = true;
  public listenElement;
  public info;
  public auth:boolean = false;
  public unit:string;
  public count:number = 0;
  public interval;
  public closeStocket:boolean = false;
  public showRemind:boolean = false;
  public showBarCode;
  
  public basicForm =  new FormGroup({
    number: new FormControl('')
  })

  @ViewChild('inputFoucs', { static: true }) input:ElementRef;

  constructor(
    private _status:StatusManagmentService
  ) {}

  ngOnInit() {

    fromEvent<any>(window, 'mousedown').subscribe(res => this.counter());
    fromEvent<any>(window, 'mouseup').subscribe(res => this.clearCounter());

    this._status.focus.subscribe(res => {
      if(res){
        setTimeout(()=>{
          this.listenElement.focus();
        },10)
        this._status.focus.next(false);
      }
    })
    this._status.connectSuccess.subscribe(res => {
      if(res){
        this.showConnectAlert = true;
        setTimeout(()=>{
          this.showConnectAlert = false;
          this._status.connectSuccess.next(false);
        },2000)
      }
    })
    this._status.finishedAlert.subscribe(res => {
      if(res){
        this.finishedAlert = true;
        setTimeout(()=>{
          this.finishedAlert = false;
          this._status.finishedAlert.next(false)
        },2000)
      }
    })
  }

  counter(){
    if(!this.isConnect) return;
    this.interval = setInterval(()=>{
      this.count = this.count + 1;
      if(this.count > 1){
        this.showRemind = true;
        this.count = 0;
        this.clearCounter();
      }
    },3000);
  }

  clearCounter(){
    clearInterval(this.interval);
  }

  ngAfterViewInit(): void {
    this.listenElement = this.input.nativeElement
  }

  onSubmit(){
    let payload = this.basicForm.value;
    payload['number'] = this.input.nativeElement.value
    this.input.nativeElement.disabled = true;
    this.showBarCode = payload['number'];
    this._status.resetIndex();
    this._status.resetDisabled();
    this._status.disabledOtherRouter.next(this.isConnect);
    this.info = payload;
    this.isConnect = true;
    this.stopAndReset = false;
    this.enabledReset = true;
    this.toggleBtn = false;
  }

  reset(){
    // 關閉連線
    this.closeStocket = true;
    // 關閉訊息
    this.showRemind = false;
    // 重置圖表
    this.stopAndReset = true;
    // 關閉 disabled 狀態
    this.input.nativeElement.disabled = false;
    // 不啟動連線
    this.isConnect = false;
    this.toggleBtn = true;
    this._status.disabledOtherRouter.next(this.isConnect);
    this._status.resetIndex();
    this.basicForm.reset();
    // 重新聚焦
    this.input.nativeElement.focus();
    setTimeout(() => {
      this.closeStocket = false;
    }, 2000);
  }

  showLog(data){
    if(data.message === 'reset') return this.tableReport = [];
    if(data.snTorqueUnit === 0) { this.unit = "kgf.cm" };
    if(data.snTorqueUnit === 1) { this.unit = "N.m" };

    this.dashboard = {
      time:data.nElapsedTime || 0,
      angle:data.nTotalAngle || 0,
      torque:data.nTorque || 0,
      status:data.snStatus,
    }
    this.tableReport.push(data);
    this._status.resetIndex();
  }

  ableReset(){
    this.enabledReset = !this.enabledReset;
    this.stopAndReset = false;
  }

  cancel(){ this.showRemind = false }

  stopConnect(e){
    e.preventDefault();
    this.toggleBtn = true;
    this.reset();
    this.stopAlert = true;
    this.input.nativeElement.focus();
    this._status.resetIndex();
    setTimeout(()=>{
      this.stopAlert = false;
    },2000)
  }

}
