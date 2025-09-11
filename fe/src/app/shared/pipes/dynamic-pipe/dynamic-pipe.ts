import {
  Injector,
  Pipe,
  PipeTransform,
  Type
} from '@angular/core';

@Pipe({
  name: 'dynamicPipe'
})
export class DynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) { }

  transform(value: string, pipeToken?: Type<PipeTransform>, ...pipeArgs: any[]): any {
    if (!pipeToken) {
      return value;
    }
    else {
      let pipe: any = this.injector.get(pipeToken);
      return pipe.transform(value, ...pipeArgs);
    }
  }
}
