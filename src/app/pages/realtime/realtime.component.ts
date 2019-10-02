import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StatusManagmentService } from '../../service/statusManagment.service';


@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {

  public finishedAlert:boolean = false;
  public showConnectAlert:boolean = false;
  public stopAlert:boolean = false;
  public tableReport = [];
  public toggleBtn:boolean = true;
  public isConnect:boolean = false;
  public stopAndReset:boolean = false;
  public enabledReset:boolean = true;
  public listenElement;
  public info;
  public basicForm =  new FormGroup({
    number: new FormControl(''),
    target: new FormControl('')
  })
  @ViewChild('inputFoucs') input:ElementRef;

  constructor(
    private _status:StatusManagmentService
  ) {}

  ngOnInit() {
    this._status.focus.subscribe(res => {
      console.log("focus", res)
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
        },800)
      }
    })
    this._status.finishedAlert.subscribe(res => {
      if(res){
        this.finishedAlert = true;
        setTimeout(()=>{
          this.finishedAlert = false;
          this._status.finishedAlert.next(false)
        },800)
      }
    })
  }

  ngAfterViewInit(): void {
    this.listenElement = this.input.nativeElement
  }

  onSubmit(){
    this.info = this.basicForm.value;
    this.isConnect = true;
    this._status.disabledOtherRouter.next(this.isConnect);
    this.stopAndReset = false;
    this.enabledReset = true;
    this.toggleBtn = false;
  }

  showLog(data){
    if(data.message == 'reset') return this.tableReport = [];
    this.tableReport.push(data);
  }

  ableReset(){
    this.enabledReset = !this.enabledReset;
    this.stopAndReset = false;
  }

  reset(){
    this.basicForm.reset();
    this.input.nativeElement.focus();
    this.isConnect = false;
    this._status.disabledOtherRouter.next(this.isConnect);
    this.stopAndReset = true;
    this.toggleBtn = true;
  }

  stopConnect(e){
    this.toggleBtn = true;
    e.preventDefault();
    this.reset();
    this.stopAlert = true;
    this.input.nativeElement.focus();
    setTimeout(()=>{
      this.stopAlert = false;
    },800)
  }

}
