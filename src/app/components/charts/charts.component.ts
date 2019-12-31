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
  public updateOptions: any;
  private timer: any;
  private socket;
  private rpm = [];
  private torque = [];
  private time = [];
  private preStatus: number = 0;
  private curStatus: number = 0;

  @Input() closeStocket: boolean = false;
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
    if (this.closeStocket) {
      this.socket.disconnect();
      this._http.post('http://localhost:5001/screwdrive/device/disable', { "disable": true }).subscribe(res => {
        // console.log("success")
      })
      setTimeout(() => {
        this.closeStocket = false;
      }, 1000);
    }
    if (this.isConnect) {
      this.socket = io.connect('http://localhost:5001', { transports: ['polling'] });
      this.listenSocket();
    }
    if (this.stopAndReset) {
      this.sendLog.emit({ message: 'reset' });
      this.rpm = [];
      this.time = [];
      this.torque = [];
      this.drawChart();
    }
  }

  ngOnInit() {
    this.drawChart();
  }

  listenSocket() {
    let _this = this;
    this._state.connectSuccess.next(true);
    this.socket.on('data', function (data: any) {
      _this.preStatus = _this.curStatus;
      _this.curStatus = data.snStatus;
      // 每執行完一顆螺絲 重設
      if ((_this.preStatus == 1 && _this.curStatus == 0) || (_this.preStatus == 2 && _this.curStatus == 0)) {
        _this.clearChart()
        return;
      }
      _this.update(data)
    })
  }

  clearChart(data = []) {
    this.rpm = [];
    this.torque = [];
    this.time = [];
    this.drawChart();
    this.update(data)
  }

  // update data 
  update(data) {
    // 倒轉 跳出 update
    if (data.snDirection === 1) {
      // close remindError window
      this._state.openRemindError.next({ isOpen: false, message: "" });
      // reset
      return this._state.resetIndex();
    }
    if (data.nRPM === undefined) return;

    if(data.snTorqueUnit === 0) {
      data.nTorque = (parseFloat(data.nTorque)/100).toFixed(2);
      data['nTorqueLowerLmt'] = data['nTorqueLowerLmt'] / 100;
      data['nTorqueUpperLmt'] = data['nTorqueUpperLmt'] / 100;
    }
    if(data.snTorqueUnit === 1) {
      data.nTorque = (parseInt(data.nTorque) / 1000).toFixed(2);
      data['nTorqueLowerLmt'] = data['nTorqueLowerLmt'] / 1000;
      data['nTorqueUpperLmt'] = data['nTorqueUpperLmt'] / 1000;
    }

    let time = data.timeStamp * 1000;
    this.time.push(time);
    this.rpm.push(data.nRPM);
    this.torque.push(data.nTorque);
    this.updateOptions = {
      xAxis: {
        type: 'category',
        data: this.time,
        splitNumber: 5,
        axisLabel: {
          show: true,
          formatter: function (value) {
            return `${(value / 1000).toFixed(2)}s`;
          }
        }
      },
      series: [
        {
          yAxisIndex: 0,
          name: 'Torque',
          type: 'line',
          stack: 'Torque',
          data: this.torque,
          symbol: 'none',
          smooth: true
        },
        {
          yAxisIndex: 1,
          name: 'Speed',
          type: 'line',
          stack: 'Speed',
          data: this.rpm,
          symbol: 'none',
          smooth: true
        }
      ]
    }

    // 單顆螺絲鎖完
    if (data.snStatus) {

      let status = parseInt(data['snStatus']);
      let report = parseInt(data['snReport']);
      // 開啟警告提示
      if (status === 2 && report > 0) {
        this._state.openRemindError.next({ isOpen: true, message: data['snReport'] })
      }

      // write to csv
      data['snDirection'] = this.convertDirection(data['snDirection']);
      data['snTorqueUnit'] = this.convertUnit(data['snTorqueUnit']);
      data['snStatus'] = this.convertStatus(data['snStatus']);
      data['snReport'] = this.convertReport(data['snReport']);
      data['time'] = this.convertTimeFormat(data['time']);
      delete data['timeStamp'];

      Object.assign(data, { serialNumber:this.info['number'] });

      let payload = {
        serialNumber: this.info['number'],
        data: data
      }
      this._http.post('http://localhost:5001/screwdrive/data/write2csv', payload).subscribe();
      
      // 輸出 table
      this.sendLog.emit(data);

      // 整組螺絲鎖完
      if (data.snFinish === 1) {
        this.socket.disconnect();
        this.finished.emit(true);
        this._state.finishedAlert.next(true);
        this._http.post('http://localhost:5001/screwdrive/device/disable', { "disable": true }).subscribe();
        return;
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
          name: 'Torque',
          icon: 'rect'
        }, {
          name: 'Speed',
          icon: 'rect'
        }]
      },
      xAxis: {
        axisTick: {
          show: true
        },
        splitLine: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Torque',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: '{value} '
          }
        },
        {
          type: 'value',
          name: 'Speed',
          axisLabel: {
            formatter: '{value} '
          }
        },
      ],
      series: []
    };
  }

  convertDirection(value){
    value = parseInt(value);
    let text:string;
    switch(value){
      case 0:
        text = "CW";
        break;
      case 1:
        text = 'CCW';
        break;
    }
    return text;
  }

  convertUnit(value){
    value = parseInt(value)
    let text:string;
    switch(value){
      case 0:
        text = "kgf.cm";
        break;
      case 1:
        text = 'N.m';
        break;
    }
    return text;
  }

  convertStatus(value){
    value = parseInt(value)
    let text:string;
    switch(value){
      case 1:
        text = "OK";
        break;
      case 2:
        text = 'NG';
        break;
    }
    return text;
  }

  convertReport(value){
    value = parseInt(value)
    let text: string;
    switch (value) {
      case 0:
        text = "No Error";
        break;
      case 1:
        text = "Stripped Screw";
        break;
      case 2:
        text = 'Floating Lock';
        break;
      case 3:
        text = 'Tighten Torque NG';
        break;
      case 4:
        text = 'Tighten Angle NG';
        break;
      case 5:
        text = 'Half Stop';
        break;
    }
    return text;
  }

  convertTimeFormat(value){
    let time = new Date(value);
    let yy, MM, dd, HH, mm, ss;
    yy = time.getFullYear();
    MM = time.getMonth()+1;
    dd = time.getDate();
    HH = time.getHours();
    mm = time.getMinutes();
    ss = time.getSeconds();
    return `${yy}/${this.addzero(MM)}/${this.addzero(dd)} ${this.addzero(HH)}:${this.addzero(mm)}:${this.addzero(ss)}`
  }

  addzero(value){
    return value < 10 ? `0${value}` : value;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
