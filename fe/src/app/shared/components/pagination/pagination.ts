import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPaginationOutput } from '../../../types/interfaces/common.interface';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination implements OnChanges {
  @Input() pageRange: number = 2;
  @Input() zeroIndexed: boolean = true;
  get adjuster(): number { return this.zeroIndexed ? 1 : 0 }
  displayPage: number = 1;
  @Input()
  get activePage(): number { return this.displayPage - this.adjuster }
  set activePage(x: number) { this.displayPage = x + this.adjuster };

  get zeroIndexedActivePage(): number { return this.activePage - (this.zeroIndexed ? 0 : 1) }

  get totalPages(): number { return Math.max(1, Math.ceil(this.totalData / this.selectedSize)) }
  get entryFrom(): number {
    if (this.totalData > 0) return this.zeroIndexedActivePage * this.selectedSize + 1;
    return 0;
  }
  get entryTo(): number {
    return Math.min((this.zeroIndexedActivePage + 1) * this.selectedSize, this.totalData);
  }

  @Output() paginationChanged: EventEmitter<IPaginationOutput> = new EventEmitter<IPaginationOutput>();
  @Input() selectedSize: IPaginationOutput['selectedSize'] = 10; //DEFAULT
  @Input() totalData: number = 0;
  sizeOptions: number[] = [10, 25, 50, 100];

  constructor(private cd: ChangeDetectorRef) {
  }
  changePage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;
    this.activePage = pageNumber - this.adjuster;
    this.paginationChanged.emit({ activePage: this.activePage, selectedSize: this.selectedSize });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.cd.detectChanges();
    }
  }
  // prevPage() {
  //   this.changePage(this.displayPage - 1);
  // }
  // nextPage() {
  //   this.changePage(this.displayPage + 1);
  // }

  changeSize(evt: any) {
    this.selectedSize = evt.target.value;
    this.activePage = 0;
    this.paginationChanged.emit({ activePage: 0, selectedSize: this.selectedSize });
  }
}
