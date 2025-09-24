import { Component, Input } from '@angular/core';
import { ISort } from '../../../../types/interfaces/common.interface';
import { SORT_DIR } from '../../../../types/constants/common.constants';

@Component({
  selector: 'app-sort-icon',
  imports: [],
  templateUrl: './sort-icon.html',
  styleUrl: './sort-icon.scss'
})
export class SortIcon {
  DIR = SORT_DIR;
  @Input() sortId = '';
  @Input() sortVal: ISort = {
    sortBy: '',
    sortDir: this.DIR.ASC, // Default direction
  }
}
