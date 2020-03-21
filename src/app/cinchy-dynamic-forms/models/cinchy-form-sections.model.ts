import { IFormField } from './cinchy-form-field.model';

export interface IFormSection {
    id: number;
    label: string;
    fields: Array<IFormField>;
}

export class FormSection implements IFormSection {
    fields: Array<IFormField> = [];

    constructor(public id: number, public label: string) { }
}
