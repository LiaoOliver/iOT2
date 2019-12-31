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

  public token: string;
  public alertMissPort: boolean = false;
  public alertAuth: boolean = true;
  public alertConnect: boolean = false;
  public showAlert:boolean = false;
  public comPortList: string[] = [];
  public cancelDisabled: boolean = true;
  public isWait: boolean = false;
  public isActive: number = 0;
  public focus: boolean = false;
  public deviceId: string;
  public disabled: boolean;
  public throwError: boolean = true;
  public toggleDialog: boolean = false;
  public selectedComPortForm = new FormGroup({
    selected: new FormControl(''),
  })
  public remindError:{isOpen:boolean, message:any};

  constructor(
    private _http: HttpClient,
    private _status: StatusManagmentService
  ) {
    setTimeout(() => {
      this.checkConnect();
    }, 2000)
  }

  ngOnInit(): void {
    this._status.openRemindError.subscribe((res:{isOpen:boolean, message:any}) => {
      this.remindError = res;
    })
    this._status.disabledOtherRouter.subscribe(res => {
      this.disabled = res
    })
  }

  closeAlert(){
    this.showAlert = false;
  }

  errorExit() {
    this.showAlert = true;
  }

  checkConnect() {
    this._http.get('http://localhost:5001/screwdrive/heartbeat').subscribe((res: any) => {
      this.isWait = res.result
      this.toggleDialog = true;
      if (res.result) {
        this.checkComPortStatus();
        this.getComPort();
      } else {
        this.errorExit()
      }
    }, error => {
      this.errorExit()
    })
  }

  openSetPort() {
    this.toggleDialog = !this.toggleDialog;
    this.getComPort();
  }

  getComPort() {
    setTimeout(() => {
      this._http.get('http://localhost:5001/screwdrive/com/info').subscribe((res: any) => {
        this.comPortList = res.result;
      })
    }, 1000)
  }

  // 確認是否有設定 comport
  checkComPortStatus() {
    this._http.get('http://localhost:5001/screwdrive/com/status').subscribe((res: any) => {
      if (!res.result) {
        this.toggleDialog = true
      }
    })
  }

  setPort() {
    let port = this.selectedComPortForm.value['selected'];
    this._http.post('http://localhost:5001/screwdrive/com/setPortNum ', { "port": port }).subscribe(
      (res: any) => {
        this.setScrewdrive(res)
      }, error => {
        this.alertMissPort = true;
      }
    )
  }

  getDevice() {
    this.getDeviceId().subscribe(id => {
      this.deviceId = id['result'];
      this.toggleDialog = false;
      // this.cancelDisabled = false;
      // this.alertAuth = true;
      // this.alertMissPort = false;
      // this.alertConnect = false;
      // this.getToken().subscribe(token => {
      //   if(id['result']===token['result']){
      //       // 授權成功 設定 comport
      //     }else{
      //       this.cancelDisabled = true;
      //       this.alertAuth = false;
      //     }              
      // })
    });
  }

  // 開啟螺絲起子
  setScrewdrive(res) {
    if (res.result === 'Successful') {
      this._http.post('http://localhost:5001/screwdrive/com/open', { "open": true }).subscribe(res => {
        // this.getDevice();
        this.toggleDialog = false;
        this.cancelDisabled = false;
      }, err => {
        // console.log(err)
      })
    } else {
      this.alertConnect = true;
    }
  }

  getToken() {
    return this._http.get('http://localhost:5001/screwdrive/device/productKey')
  }

  getDeviceId() {
    return this._http.get('http://localhost:5001/screwdrive/device/name')
  }

  close() {
    this.toggleDialog = false;
  }

}
