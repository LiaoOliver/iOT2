import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project';

  public toggleDialog: boolean = false;
  public isActive: boolean = true;
  public comPortList: string[] = [];
  public selectedComPortForm = new FormGroup({
    selected: new FormControl(''),
  })

  constructor(
    private _http:HttpClient
  ){}

  ngOnInit(): void {
    this.checkComPortStatus();
    this.getComPort();
  }

  openSetPort(){
    this.toggleDialog = !this.toggleDialog;
  }

  setPort(){
    this.toggleDialog = !this.toggleDialog;
    
    let port = this.selectedComPortForm.value['selected']
    this._http.post('http://10.101.100.179:5001/screwdrive/com/setPortNum ', {"port":port}).subscribe(
      (res:any) => {
        console.log(res)
        if(res.result === 'Successful'){
          this._http.post('http://10.101.100.179:5001/screwdrive/com/open', {"open": true }).subscribe(res => {
            console.log(res)
            this.checkComPortStatus()
          })
        }
      }
    )
  }

  checkComPortStatus(){
    this._http.get('http://10.101.100.179:5001/screwdrive/com/status').subscribe((res:any)=>{
      console.log(res)
      // if(!res.result){
      //   alert('請先設定 COM PORT');
      //   this.toggleDialog = !this.toggleDialog;
      // }
    })
  }


  getComPort(){
    this._http.get('http://10.101.100.179:5001/screwdrive/com/info').subscribe((res:any) => {
      this.comPortList = res.result;
    })
  }

  

}
