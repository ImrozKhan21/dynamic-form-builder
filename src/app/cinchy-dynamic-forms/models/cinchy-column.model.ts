export interface ICinchyColumn {
    id: number;
    tableId: number;
    name: string;
    dataType: string;
    isMandatory: boolean;
    textColumnMaxLength: number;
    linkTargetColumnId: number;
    LinkTargetTableId: number;
    linkTargetColumnName: string;
    isMultiple: boolean;
    validationExpression: string;
    minValue: number;
    canEdit: boolean;
    canView: boolean;
}

export class CinchyColumn implements ICinchyColumn {
    constructor(public id: number, public tableId: number, public name: string,
        public dataType: string, public isMandatory: boolean,
        public textColumnMaxLength: number, public linkTargetColumnId: number,
        public linkTargetColumnName: string, public isMultiple: boolean,
        public validationExpression, public minValue, public canEdit: boolean,
        public canView: boolean, public LinkTargetTableId: number) { }
}