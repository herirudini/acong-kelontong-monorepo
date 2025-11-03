import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TenMegaByte } from '../../../types/constants/common.constants';
import { AlertService } from '../alert/alert-service';

@Component({
  selector: 'app-drag-drop-file',
  templateUrl: './drag-drop-file.component.html',
  styleUrls: ['./drag-drop-file.component.scss']
})
export class DragDropFileComponent implements OnChanges {
  @Output() fileChanged: EventEmitter<File> = new EventEmitter<File>;
  @Output() deleteHandler: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() previewHandler: EventEmitter<Event> = new EventEmitter<Event>();

  @ViewChild('hiddenInput') hiddenInput?: ElementRef;
  @Input() disabled: boolean = true;
  @Input() elementId: string = '';
  @Input() error: boolean = false;
  @Input() fileTypes: string[] = ['jpg', 'jpeg', 'gif', 'bmp'];
  @Input() maxSize: number = TenMegaByte; // Default 10 MB
  @Input() patchFileName: string = '';
  @Input() componentName: string = '';
  @Input() haveAction: boolean = true;

  isDragging: boolean = false;
  dragEnter: boolean = false;
  file: File|null = null;
  fileName: string = '';
  constructor(private toast: AlertService, private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.patchFileName) {
      this.fileName = this.patchFileName;
    }
  }

  filterFileInput() {
    const formats: string[] = [...this.fileTypes];
    formats.forEach((item, index) => {
      formats[index] = `.${item}`;
    });
    return formats;
  }

  reset() {
    this.file = null;
    this.fileName = '';
    this.cdRef.detectChanges();
  }

  validateFile(file: File) {
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() as string;
      if (!this.fileTypes.includes(fileExtension)) {
        this.toast.error('INVALID_TYPE');
      } else if (file.size > this.maxSize) {
        this.toast.error('TOO_LARGE max 10MB');
      } else {
        this.file = file;
        this.fileName = file.name;
        this.fileChanged.emit(this.file);
      }
    }
    catch (err) {
        this.toast.error('UPLOAD_FILE.SYSTEM_ERROR');
    } finally {
      this.isDragging = false;
    }
  }
  handleFileInput(event: any) {
    this.validateFile(event.target.files[0]);
    event.target.value = null; //clear cache
  }

  handleDragOver(event: any) {
    event.preventDefault();
  }

  handleDragMove(event: any) {
    if (!event.relatedTarget || !this.elementContains(event.currentTarget as HTMLElement, event.relatedTarget as HTMLElement)) {
      this.isDragging = false;
    } else {
      this.isDragging = true;
    }
  }

  private elementContains(parent: HTMLElement, child: HTMLElement): boolean {
    return parent.contains(child);
  }

  handleDrop(event: any) {
    event.preventDefault();
    this.validateFile(event.dataTransfer.files[0]);
  }

  deleteClicked(): void {
    this.reset();
    this.deleteHandler.emit();
  }

  previewClicked(): void {
    this.previewHandler.emit();
  }

}
