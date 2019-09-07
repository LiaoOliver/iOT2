import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {

  public basicForm =  new FormGroup({
    number: new FormControl(''),
    target: new FormControl('')
  })

  constructor() { }

  ngOnInit() {
  }

}
