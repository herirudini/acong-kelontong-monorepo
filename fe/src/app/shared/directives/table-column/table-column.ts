import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTableColumn]'
})
export class TableColumn {

  constructor() { }
  @Input() public customColumnId: string = '';
  @ContentChild(TemplateRef) public columnTemplate: TemplateRef<any> = this.customColumnId as unknown as TemplateRef<any>;
}
