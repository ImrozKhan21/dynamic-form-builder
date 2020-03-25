import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() optionsContainerTitle;
  @Input() selectedRow;

  @Input('options') set options(options) {
    this.setSideBarRowsData(options);
  }

  @Output() rowClicked = new EventEmitter();
  searchControl = new FormControl();
  data;
  filteredOptions;
  addNewOption;

  // TODO: ADD TYPES

  static getFilterValue(value) { // TODO Move this to service
    if (typeof value === 'object') {
      return value.lookUpLabel ? value.lookUpLabel.toLowerCase() : '';
    }
    return value.toLowerCase();
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  setSideBarRowsData(options) {
    if (options && options[0]) {
      const firstFormValues = options[0];
      this.addNewOption = {formId: firstFormValues.formId, rowId: 'addNewData', lookUpLabel: ''};
      this.data = firstFormValues.rowsForTable.map(item => ({formId: firstFormValues.formId, ...item}));
      this.filteredOptions = this.data.slice();
      this.onInputChange();
    }
  }

  onInputChange() {
    this.searchControl.valueChanges.pipe(
      startWith('')).subscribe(value => {
      this.filteredOptions = this.filter(value);
    });
  }

  filter(value: any): string[] {
    const filterValue = SidenavComponent.getFilterValue(value);
    // Filtering out addNewItem because multiple inputs can cause race condition
    return this.data.filter(option => option && option.lookUpLabel ? option.lookUpLabel.toLowerCase().includes(filterValue) : null);
  }

  rowSelected(item) {
    this.selectedRow = item;
    this.rowClicked.emit(item);
  }

  backToAllForms() {
    this.router.navigate(['/all-forms']);
  }

  trackByFn(index, item) {
    return item.rowId;
  }

}
