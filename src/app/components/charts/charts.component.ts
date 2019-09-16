import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  options: any;
  updateOptions: any;
  private target;
  private timer: any;
  private socket;
  private rpm = [];
  private torque = [];
  private reStart = true;

  @Input() isConnect;
  @Input() info;
  @Output() sendLog = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isConnect){
      this.target = this.info.target;
      this.socket = io.connect('http://10.101.100.179:5001', {
        transports: ['polling']
      });
      this.listenSocket()
    }
  }

  ngOnInit() {
    this.drawChart();
    
  }

  listenSocket(){
    let socket = this.socket
    let _this = this;
    this.socket.on('data', function(data){
      console.log('on', this.reStart)
      if(this.reStart){
        this.rpm = [];
        this.torque = [];
        this.drawChart();
      }
      _this.update(data, this.target)

    })
  }

  update(data, target){
    if(data.snDirection === 1) return;
    this.rpm.push(data.nRPM)
    this.torque.push(data.nTorque)
    this.updateOptions = {
      series:[
        {
					type: 'line',
					stack: '轉速',
					smooth: true,
          data: this.rpm,
          
				},
				{
					type: 'line',
					stack: '扭力',
					smooth: true,
          data: this.torque,
          // markLine: {
            //   data: { yAxis:target, name: '扭力目標值'}
            // }
          },
        ]
      }
      if(data.snStatus){
        this.sendLog.emit(data);
        this.reStart = true;
        console.log('ochangen', this.reStart)
        return;
      }
      
      this.reStart = false;
      console.log('end', this.reStart)
  }

  drawChart(data = []) {
    // initialize chart options:
    this.options = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return "RPM: " + params[0]['data'].toFixed(2) + '<br>' + "Torque: " + params[1]['data'].toFixed(2);
        }
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: [
        {
          type: 'value',
          name: '轉速',
          // min: 0,
          // max: 500,
          // interval: 100,
          axisLabel: {
            formatter: '{value} rpm'
          }
        },
        {
          type: 'value',
          name: '扭力',
          // min: 0,
          // max: 50,
          // interval: 5,
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: []
    };
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
