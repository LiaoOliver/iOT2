import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  @Input() data;

  // public data1 = [
  //   {
  //     time:"12",
  //     nElapsedTime:"123",
  //     nScrewLeft :"123",
  //     nStation :"123",
  //     nTorque :"123",
  //     nTorqueLowerLmt :"123",
  //     nTorqueUpperLmt :"123",
  //     snTorqueUnit:"123",
  //     nTotalAngle:"123",
  //     nTightAglLowerLmt:"123",
  //     nTightAglUpperLmt :"123",
  //     nTightAngle :"123",
  //     nTotalAglLowerLmt :"123",
  //     nTotalAglUpperLmt :"123",
  //     snDirection:"123",
  //     snReport:"123",
  //     snStatus:2 ,
  //     snTemperature:"123" 
  //   },
  //   {
  //     time:"12",
  //     nElapsedTime:"123",
  //     nScrewLeft :"123",
  //     nStation :"123",
  //     nTorque :"123",
  //     nTorqueLowerLmt :"123",
  //     nTorqueUpperLmt :"123",
  //     snTorqueUnit:"123",
  //     nTotalAngle:"123",
  //     nTightAglLowerLmt:"123",
  //     nTightAglUpperLmt :"123",
  //     nTightAngle :"123",
  //     nTotalAglLowerLmt :"123",
  //     nTotalAglUpperLmt :"123",
  //     snDirection:"123",
  //     snReport:"123",
  //     snStatus:1,
  //     snTemperature:"123" 
  //   }
  // ];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("tablesComponent:", this.data)
  }

}
