// table.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ContentChildren,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  QueryList,
  TemplateRef,
  Type,
} from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
// import { AppConstants } from 'src/app/types/constants/app.constant';
import { TableColumn } from '../../directives/table-column/table-column';
import { ICheckboxOption, IDateRangeFilter, IPaginationOutput, ISelectFilter, ISelectValue } from '../../../types/interfaces/common.interface';
import { getNestedProperty, trackByFn } from '../../../utils/helper';
import { DATE_FORMAT } from '../../../types/constants/common.constants';
import { DynamicPipe } from '../../pipes/dynamic-pipe/dynamic-pipe';
import { FormsModule } from '@angular/forms';
import { SelectFilter } from '../select-filter/select-filter';
import { DateRangeFilter } from '../date-range-filter/date-range-filter';
import { Pagination } from '../pagination/pagination';

export interface ColumnProps {
  id: string;
  backendPropName?: string;
  label: string;
  sort?: boolean;
  customElementId?: string; // Element ID for dynamic HTML content
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  customValueTransformer?: (val: any) => any;
  customHeaderPipe?: {
    pipeType: Type<PipeTransform>;   // 👈 use Type of a Pipe
    pipeArgs: any[];
  },
  customPipe?: {
    pipeType: Type<PipeTransform>;   // 👈 use Type of a Pipe
    pipeArgs: any[];
  },
  extraHeaderClass?: string;
  dataType?: any;
}

export interface ITableQueryData {
  activePage: number,
  pageSize: number,
  sortBy: string, // column ID
  sortDirection: SortDirection,
  searchKeyword: string,
  filterData?: {
    allOptions: ICheckboxOption[],
    selectedOptions: ICheckboxOption[],
    selectedIds: string[]
  }
  filterByDate?: IDateRangeFilter,
  filterSelect?: ISelectValue[],
}

export interface IFilterOption extends ICheckboxOption { }

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  NONE = ''
}

export const defaultComonQueryData = {
  activePage: 0, pageSize: 10, searchKeyword: '', sortBy: '', sortDirection: SortDirection.NONE
};

@Component({
  selector: 'app-generic-table',
  imports: [CommonModule, DynamicPipe, FormsModule, SelectFilter, DateRangeFilter, Pagination],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.scss'
})
export class GenericTable implements OnInit, OnDestroy {
  // trackByFn = trackByFn;
  @Input() columns: Array<ColumnProps> = [];
  @Input() data: any[] = [];
  @Input() datalength: number = 0;
  //turn on / off function
  @Input() useSearch: boolean = false;
  @Input() useFilter: boolean = false;
  @Input() useFilterByDate: boolean = false;
  @Input() useFilterSelect: boolean = false;

  @Input() filterSelectData: ISelectFilter[] = [];
  @Input() selectedFilterSelect: ISelectValue[] = [];
  @Input() filterByDateDefaultValue?: IDateRangeFilter;
  @Input() usePagination: boolean = true;
  @Input() useDownloadButton: boolean = false;
  @Input() useCustomToolbar: boolean = false;
  @Input() useCheckbox: boolean = false;
  // for pagination
  @Input() selectedSize: number = 10;
  @Input() activePage: number = 0;
  //for filter dropdown
  @Input() filterLabel: string = '';
  @Input() filterOptions: IFilterOption[] = [];
  // for sorting & search
  @Input() searchPlaceholder: string = '';
  @Input() search: string = '';
  @Input() sortBy: string = '';
  @Input() sortDirection: SortDirection = SortDirection.NONE;
  @Input() isLoading: boolean = false;

  @Input() searchKeyword: string = '';

  @Output() OnDataRefresh: EventEmitter<ITableQueryData> = new EventEmitter<ITableQueryData>();
  @Output() DownloadButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnCheckboxChange: EventEmitter<any> = new EventEmitter<any>();
  //for costume column
  @ContentChildren(TableColumn)
  columnDefinitions: QueryList<TableColumn> = {} as QueryList<TableColumn>;

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500; // Set the debounce time (in milliseconds)

  // constructor(public datePipe: DatePipe) { }

  // datePipe: Type<PipeTransform> = DatePipe;

  public get columnTemplates(): { [key: string]: TemplateRef<any> } {
    if (this.columnDefinitions != null) {
      const columnTemplates: { [key: string]: TemplateRef<any> } = {};
      for (const columnDefinition of this.columnDefinitions.toArray()) {
        columnTemplates[columnDefinition.customColumnId] =
          columnDefinition.columnTemplate;
      }
      return columnTemplates;
    } else {
      return {};
    }
  }

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(this.debounceTimeMs),
        distinctUntilChanged()
      ).subscribe((searchValue) => {
        this.searchKeyword = searchValue;
        this.activePage = 0;
        this.refreshData();
      });
  }

  ngOnDestroy() {
    //destroy search subscribe
    this.searchSubject.complete();
  }

  onSearch() {
    this.searchSubject.next(this.search);
  }

  changePage(paginationData: IPaginationOutput) {
    this.selectedSize = paginationData.selectedSize;
    this.activePage = paginationData.activePage;
    this.refreshData();
  }

  downloadButtonClicked() {
    this.DownloadButtonClicked.emit();
  }

  generateInlineStyle(column: ColumnProps): any {
    const iStyle: any = {};
    if (!column) return iStyle;
    column.minWidth ??= column.width;
    column.maxWidth ??= column.width;

    [
      ['width', 'width'],
      ['minWidth', 'min-width'],
      ['maxWidth', 'max-width'],
    ].forEach(([prop, cssProp]: string[]) => {
      const val = column[prop as keyof ColumnProps];

      // deliberate use of != instead of !== to include undefined
      if (val != null) {
        iStyle[cssProp] = val;
      }
    })

    return iStyle;
  }

  headerClass(value: any): string {
    return (
      (this.sortBy === value
        ? this.sortDirection === 'desc'
          ? ' table-sort-desc'
          : ' table-sort-asc'
        : '')
    );
  }

  isDateColumn(column: ColumnProps): boolean {
    return column?.dataType === typeof Date;
  }

  getDateFormat(column: ColumnProps): string {
    return DATE_FORMAT;
  }

  transformValueIfNeeded(value: any, column: ColumnProps): any {
    return column.customValueTransformer ?
      column.customValueTransformer(value) : value;
  }

  getRowDataValue(rowData: any, nestedPropertyName: string): any {
    return getNestedProperty(rowData, nestedPropertyName);
  }

  getColumnById(columnId: string): ColumnProps | undefined {
    return this.columns.find(c => c.id === columnId);
  }

  sortChanged(columnId: string): void {
    if (columnId === this.sortBy) {
      this.sortDirection = this.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    } else {
      this.sortDirection = SortDirection.ASC;
    }
    this.sortBy = columnId;
    this.refreshData();
  }

  filtersChanged(options: any) {
    this.activePage = 0;
    this.refreshData();
  }

  filterByDateChanged(evt: IDateRangeFilter) {
    this.activePage = 0;
    this.filterByDateDefaultValue = evt;
    this.refreshData();
  }

  filterSelectDataArrayChange(evt: ISelectValue[]) {
    this.activePage = 0;
    this.selectedFilterSelect = evt
    this.refreshData();
  }

  refreshData() {
    this.OnDataRefresh.emit(this.queryData);
  }

  public backToFirstPage() {
    this.activePage = 0;
  }

  get queryData(): ITableQueryData {
    const selectedOptions = this.filterOptions?.filter(i => i.value) ?? [];
    return {
      activePage: this.activePage ?? 0,
      pageSize: this.selectedSize ?? 10,
      filterData: {
        allOptions: this.filterOptions,
        selectedOptions: selectedOptions,
        selectedIds: selectedOptions?.map(i => i.id)
      },
      filterByDate: this.filterByDateDefaultValue,
      filterSelect: this.selectedFilterSelect,
      searchKeyword: this.searchKeyword ?? '',
      sortBy: this.getColumnById(this.sortBy)?.backendPropName ?? this.sortBy ?? '',
      sortDirection: this.sortDirection ?? SortDirection.NONE
    };
  }

  checkBoxVal: any[] = [];

  isChecked(evt: any): boolean {
    let val = false;
    const parameter = JSON.stringify(evt);
    this.checkBoxVal.forEach((item) => {
      const copyData = JSON.stringify(item);
      if (copyData === parameter) {
        val = true
      }
    })
    return val;
  }

  onChecked(evt: any) {
    if (this.isChecked(evt)) {
      this.checkBoxVal = this.checkBoxVal.filter(el => JSON.stringify(el) !== JSON.stringify(evt));
      this.trigerCheckboxChange();
    } else {
      this.checkBoxVal.push(evt);
      this.trigerCheckboxChange();
    }
  }

  isCheckedAll() {
    let checkeds = 0;
    this.data.forEach(el => {
      if (this.isChecked(el)) {
        checkeds += 1;
      }
    })
    return checkeds === this.data.length;
  }

  onCheckedAll(evt: any) {
    if (evt.target.checked) {
      this.data.forEach(el => {
        if (!this.isChecked(el)) {
          this.checkBoxVal.push(el);
        };
      });
      this.trigerCheckboxChange();
    } else {
      this.data.forEach((item) => {
        this.checkBoxVal.forEach((el, index) => {
          if (JSON.stringify(item) === JSON.stringify(el)) {
            this.checkBoxVal.splice(index, 1)
          }
        })
      });
      this.trigerCheckboxChange();
    }
  }

  trigerCheckboxChange() {
    const copyValue = JSON.parse(JSON.stringify(this.checkBoxVal));
    const newVal: any[] = [];
    copyValue.forEach((el: any) => {
      newVal.push(el);
    })
    this.OnCheckboxChange.emit(newVal);
  }
}
