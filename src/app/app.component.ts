import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StatusManagmentService } from './service/statusManagment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project';

  public focus:boolean = false;
  public desabled:boolean;
  public isWait:boolean = false;
  public throwError:boolean = true;
  public toggleDialog: boolean = false;
  public isActive: number = 0;
  public comPortList: string[] = [];
  public selectedComPortForm = new FormGroup({
    selected: new FormControl(''),
  })

  constructor(
    private _http:HttpClient,
    private _status:StatusManagmentService
  ){
    setTimeout(()=>{
      this.checkConnect();
    },500)
  }

  ngOnInit(): void {
    this._status.disabledOtherRouter.subscribe(res => {
      this.desabled = res
    })
  }

  errorExit(){
    alert("Opps!!! 系統連線發生異常!!");
  }

  checkConnect(){
    this._http.get('http://10.101.100.179:5001/screwdrive/heartbeat').subscribe((res:any) => {
      this.isWait = res.result
      if(res.result){
        this.checkComPortStatus();
        this.getComPort();
      }else{
        this.errorExit()
      }
    }, error => {
      this.errorExit()
    })
  }

  openSetPort(){
    this.toggleDialog = !this.toggleDialog;
    this.getComPort();
  }

  setPort(){
    let port = this.selectedComPortForm.value['selected']
    this.toggleDialog = !this.toggleDialog;
    this._http.post('http://10.101.100.179:5001/screwdrive/com/setPortNum ', {"port":port}).subscribe(
      (res:any) => {
        if(res.result === 'Successful'){
          this._status.focus.next(true);
          this._http.post('http://10.101.100.179:5001/screwdrive/com/open', {"open": true }).subscribe(res => {
            this.checkComPortStatus()
          },err =>{
            console.log(err)
          })
        }
      }
    )
  }

  checkComPortStatus(){
    this._http.get('http://10.101.100.179:5001/screwdrive/com/status').subscribe((res:any)=>{
      if(!res.result){
        // alert('請先設定 COM PORT');
        this.toggleDialog = !this.toggleDialog;
      }
    })
  }

  getComPort(){
    this._http.get('http://10.101.100.179:5001/screwdrive/com/info').subscribe((res:any) => {
      this.comPortList = res.result;
    })
  }

  close(){
    this.toggleDialog = false;
  }

}
