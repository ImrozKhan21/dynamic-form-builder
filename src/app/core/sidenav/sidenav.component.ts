import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() optionsContainerTitle;

  @Input('options') set options(options) {
    this.setSideBarRowsData(options);
  }

  @Output() rowClicked = new EventEmitter();
  data;
  addNewOption;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  setSideBarRowsData(options) {
    if (options && options[0]) {
      const firstFormValues = options[0];
      this.addNewOption = {formId: firstFormValues.formId, rowId: 'addNewData', lookUpLabel: ''};
      this.data = firstFormValues.rowsForTable.map(item => ({formId: firstFormValues.formId, ...item}));
    }
  }

  backToAllForms() {
    this.router.navigate(['/all-forms']);
  }

}
