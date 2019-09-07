import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public historyForm = new FormGroup({
    number: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  })

  constructor() { }

  ngOnInit() {
  }

  onSubmit(){
    console.log(this.historyForm.value)
  }

}
