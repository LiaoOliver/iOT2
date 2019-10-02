import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = parseInt(value)
    let text:string;
    switch(value){
      case 1:
        text = "成功";
        break;
      case 2:
        text = '失敗';
        break;
    }
    return text;
  }

}
