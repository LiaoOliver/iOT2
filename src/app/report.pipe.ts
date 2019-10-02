import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'report'
})
export class ReportPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = parseInt(value)
    let text: string;
    switch (value) {
      case 0:
        text = "0";
        break;
      case 1:
        text = "滑牙或螺絲過長";
        break;
      case 2:
        text = '浮鎖或斜打';
        break;
      case 3:
        text = '擰緊扭矩不良';
        break;
      case 4:
        text = '擰緊角度不良';
        break;
      case 5:
        text = '中途提前釋放啟動信號';
        break;
    }
    return text;
  }

}
