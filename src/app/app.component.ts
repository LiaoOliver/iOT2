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

  public tokenAlert: boolean = false;
  public tokenMessage: string;
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
  public tokenString: string;
  public actualString: string;
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

  // 確認是否有跟螺絲起子連線
  checkConnect() {
    this._http.get('http://localhost:5001/screwdrive/heartbeat').subscribe((res: any) => {
      this.isWait = res.result
      this.toggleDialog = true;
      if (res.result) {
        // PORT 設定
        this.checkComPortStatus();
        this.getComPort();
      } else {
        this.errorExit()
      }
    }, error => {
      this.errorExit()
    })
  }

  // 開啟 SETTING 視窗
  openSetPort() {
    this.toggleDialog = !this.toggleDialog;
    this.getComPort();
  }

  // 取得 PORT 號
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

  // 送出 PORT 設定
  setPort() {
    let port = this.selectedComPortForm.value['selected'];
    this._http.post('http://localhost:5001/screwdrive/com/setPortNum ', { "port": port }).subscribe(
      (res: any) => {
        // 設定完 PORT 取得產品 key
        this.getToken().subscribe(token => {
          this.tokenString = token['result']
          this.getDeviceId().subscribe(device => {
            this.actualString = device['result'];
            if(token['result'] === device['result']){
              // 送訊號給螺絲起子
              this.setScrewdrive(res)
            }else{
              this.tokenAlert = true;
              this.tokenMessage = 'Permission denied'
            }
          }, error => {
            this.tokenAlert = true;
            // this.tokenMessage = error
            this.tokenMessage = 'Device ID is invalid'
          })
        }, error => {
          this.tokenAlert = true;
          // this.tokenMessage = error
          this.tokenMessage = 'Token is invalid'
        })
      }, error => {
        this.alertMissPort = true;
      }
    )
  }

  // 開啟螺絲起子
  setScrewdrive(res) {
    if (res.result === 'Successful') {
      this._http.post('http://localhost:5001/screwdrive/com/open', { "open": true }).subscribe(res => {
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
