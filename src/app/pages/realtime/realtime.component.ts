import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {

  public tableReport = [];
  public isSubmit = false;
  public info;
  public basicForm =  new FormGroup({
    number: new FormControl(''),
    target: new FormControl('')
  })

  constructor() { }

  ngOnInit() {
  }

  onSubmit(){
    this.isSubmit = true;
    this.info = this.basicForm.value;
  }

  showLog(e){
    this.tableReport.push(e)
    console.log("showLog:",e)
  }

}
