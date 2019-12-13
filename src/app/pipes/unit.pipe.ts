import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unit'
})
export class UnitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
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

}
