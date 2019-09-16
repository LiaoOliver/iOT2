import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

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
    this._http.get('http://10.101.100.179:5001/screwdrive/data/serialNum').subscribe((res:any) => {
      this.lists = res.result
    })
  }

  onSubmit(){
    let payload = this.historyForm.value
    this._http.post('http://10.101.100.179:5001/screwdrive/data/interval', payload).subscribe((res:any) => {
      this.tableList = res.result;
    })
  }

}
