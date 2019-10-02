import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public noDataAlert: boolean = false;
  public historyForm = new FormGroup({
    serialNumber: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  })
  public tableList;
  public lists: string[] = []
  

  constructor(
    private _http:HttpClient
  ) { }

  ngOnInit() {
    this._http.get('http://localhost:5001/screwdrive/data/serialNum').subscribe((res:any) => {
      console.log(res)
      if(res.result === null || !res.result.length) return this.lists = ['尚未有資料'];
      this.lists = res.result
    }, error => {
      this.lists = ['資料連線失敗']
    })
  }

  onSubmit(){
    let payload = this.historyForm.value
    this._http.post('http://localhost:5001/screwdrive/data/interval', payload).subscribe((res:any) => {
      if(!res.result.length){
        this.noDataAlert = true;
        setTimeout(()=>{
          this.noDataAlert = false;
        },800)
      };
      this.tableList = res.result;
    })
  }

}
