import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatusManagmentService } from '../../service/statusManagment.service';
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
  private preStatus: number;
  private curStatus: number;

  @Input() isConnect: boolean;
  @Input() info;
  @Input() stopAndReset: boolean;
  @Output() sendLog = new EventEmitter();
  @Output() finished = new EventEmitter(false);

  constructor(
    private _http: HttpClient,
    private _state: StatusManagmentService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isConnect) {
      this.target = this.info.target;
      this.socket = io.connect('http://10.101.100.179:5001', {
        transports: ['polling']
      });
      this.listenSocket()
    }
    if (this.stopAndReset) {
      this.sendLog.emit({message:'reset'});
      this.drawChart();
    }
  }

  ngOnInit() {
    this.drawChart();
  }

  listenSocket() {
    let socket = this.socket
    let _this = this;
    this._state.connectSuccess.next(true);
    this.socket.on('data', function (data) {
      this.preStatus = this.curStatus;
      this.curStatus = data.snStatus;
      if ((this.preStatus == 1 && this.curStatus == 0) || (this.preStatus == 2 && this.curStatus == 0)) {
        _this.rpm = [];
        _this.torque = [];
        _this.drawChart();
      }
      _this.update(data, this.target)
    })

  }

  // update data 
  update(data, target) {
    if (data.snDirection === 1) return;
    this.rpm.push(data.nRPM)
    this.torque.push(data.nTorque)
    this.updateOptions = {
      series: [
        {
          name: '轉速',
          type: 'line',
          stack: '轉速',
          smooth: true,
          data: this.rpm,
        },
        {
          yAxisIndex:1,
          name: '扭力',
          type: 'line',
          stack: '扭力',
          smooth: true,
          data: this.torque,
          markLine: {
            data: [
              {
                yAxis: this.target,
                name: '目標值'
              }
            ]
          }
        },
      ]
    }
    if (data.snStatus) {
      this.sendLog.emit(data);
      let payload = {
        serialNumber: this.info.number,
        data:data
      }
      
      this._http.post('http://10.101.100.179:5001/screwdrive/data/write2csv', payload)
      .subscribe(res => {
        console.log("success")
      })
      if (!data.nScrewLeft) {
        this.socket.close();
        this.finished.emit(true)
        this._state.finishedAlert.next(true);
      }
      return;
    }
  }

  // basic chart condition
  drawChart(data = []) {
    this.options = {
      legend: {
        type: 'scroll',
        data: [{
          name: '轉速',
          icon: 'rect'
        }, {
          name: '扭力',
          icon: 'rect'
        }]
      },
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
          axisLabel: {
            formatter: '{value} rpm'
          }
        },
        {
          id:1,
          type: 'value',
          name: '扭力',
          min: 0,
          max: 100,
          interval: 20,
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [

      ]
    };
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
