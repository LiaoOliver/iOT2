import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StatusManagmentService } from '../../service/statusManagment.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {

  public charLengthAlert:boolean = false;
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
  public curLength:number;
  public basicForm =  new FormGroup({
    number: new FormControl('')
  })

  @ViewChild('inputFoucs', { static: true }) input:ElementRef;

  constructor(private _status:StatusManagmentService, public _http:HttpClient) {}

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
    this._status.reset$.subscribe(res=>{
      this.reset();
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
    },4000);
  }

  clearCounter(): void{
    clearInterval(this.interval);
  }

  ngAfterViewInit(): void {
    this.listenElement = this.input.nativeElement
  }

  onSubmit(event){
    event.preventDefault();
    let payload = this.basicForm.value;
    payload['number'] = this.input.nativeElement.value;

    // 檢查字元長度
    this._status.getCharLengthSetting().subscribe(length => {
      if(payload['number'].length === length['result']){
        this.input.nativeElement.disabled = true;
        this._status.resetIndex();
        this._status.resetDisabled();
        this._status.disabledOtherRouter.next(this.isConnect);
        this.info = payload;
        this.isConnect = true;
        // 用觸動重置
        this.stopAndReset = false;
        // 重置按鈕
        this.enabledReset = true;
        // 控制 start connect 按鈕
        this.toggleBtn = false;
      }else{
        this.basicForm.reset();
        this.input.nativeElement.focus();
        this.charLengthAlert = true;
        this.curLength = length['result'];
        setTimeout(()=>{
          this.charLengthAlert = false;
        },2000)
      }
    })
  }

  reset(): void{
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

  ableReset(): void{
    this.enabledReset = !this.enabledReset;
    this.stopAndReset = false;
  }

  cancel(){ this.showRemind = false }

  stopConnect(e): void{
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
