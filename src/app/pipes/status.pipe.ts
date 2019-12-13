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
        text = "OK";
        break;
      case 2:
        text = 'NG';
        break;
    }
    return text;
  }

}
