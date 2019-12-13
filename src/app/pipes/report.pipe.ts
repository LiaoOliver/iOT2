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

}
