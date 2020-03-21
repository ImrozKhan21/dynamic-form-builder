import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlattener, MatTreeFlatDataSource} from '@angular/material';

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
  dataSource;
  treeFlattener;
  treeControl;
  transformer = (node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
    };
  }
  hasChild = (_: number, node: any) => node.expandable;

  constructor() {
  }

  ngOnInit(): void {
  }

  setSideBarRowsData(options) {
    if (options) {
      this.treeControl = new FlatTreeControl<any>(node => node.level, node => node.expandable);
      this.treeFlattener = new MatTreeFlattener(
        this.transformer, node => node.level, node => node.expandable, node => node.children);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.dataSource.data = options.map(item => ({name: item.tableName,
        children: item.rowsForTable.map(row => ({name: {...row, formId: item.formId}}))}));
    }
  }

}
