import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  public deleteList: string[] = [];
  public all: boolean = false;
  public historyFile: string[] = [];
  public lists: string[] = [];
  public name: string;

  constructor(
    public _http: HttpClient
  ) { }

  ngOnInit() {
    this.init()
  }

  init() {
    this._http.get('http://localhost:5001/screwdrive/data/serialNum').subscribe((res: any) => {
      this.lists = res.result
    })
  }

  getfile(event) {
    this.name = event.target.value;
    this.getData()
  }

  getData() {
    this._http.get(`http://localhost:5001/screwdrive/data/history/${this.name}`).subscribe((res: any) => {
      this.historyFile = res.result[0]
    })
  }

  deleteAll() {
    this.all = true;
    this.activeDel();
  }

  addDeleteList(id) {
    let repeat = this.deleteList.find(item => item === id);
    repeat === undefined ? this.deleteList.push(id) : this.deleteList = this.deleteList.filter(item => item !== repeat);
  }

  activeDel() {
    let payload = {
      serialNumber: this.name,
      deleteAll: this.all,
      fileNames: this.deleteList
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: payload
    }
    this._http.delete('http://localhost:5001/screwdrive/data/delete', options).subscribe(res => {
      if(this.all){
        this.ngOnInit();
        this.lists = [];
        this.historyFile = [];
        this.all = false;
      }else{
        this.getData();
      }
    })
  }

}
