import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';


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
  public checkInput: boolean = false;

  @ViewChild('serial', { static: true }) serial:ElementRef;

  constructor(
    private _http: HttpClient,
    private _fileSave: FileSaverService
  ) { }

  ngOnInit(): void {
    this._http.get('http://localhost:5001/screwdrive/data/serialNum').subscribe((res: any) => {
      console.log(res)
      if (res.result === null || !res.result.length) return this.lists = ['not data'];
      this.lists = res.result
    }, error => {
      this.lists = ['connected fail']
    })
  }

  print(e): void {
    e.preventDefault();
    let payload = this.historyForm.value
    payload['serialNumber'] = this.serial.nativeElement.value;
    let date = new Date().toLocaleDateString();
    payload = { "fileName": date, ...payload }
    this._http.post('http://10.101.100.134:5001/screwdrive/data/csvExport', payload, { observe: 'response', responseType: 'blob' }).subscribe(res => {
      const blobValue = new Blob([res['body']], { type: 'text/csv' });
      this._fileSave.save(blobValue, `${date}.csv`);
    })
  }

  checkValue(e): void {
    if (e.target.value) this.checkInput = true;
  }
  
  onSubmit(): void {
    let payload = this.historyForm.value;
    payload['serialNumber'] = this.serial.nativeElement.value;
    this._http.post('http://10.101.100.134:5001/screwdrive/data/history', payload).subscribe((res: any) => {
      let response = [];
      if (!res.result) {
        this.noDataAlert = true;
        setTimeout(() => {
          this.noDataAlert = false;
        }, 2500)
      };
      for (let objKey in res.result) { response = [...res.result[objKey], ...response] }
      this.tableList = response;
    })
  }
}
