import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'direction'
})
export class DirectionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
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

}
