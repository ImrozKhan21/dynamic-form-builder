export interface IDropdownOption {
    id: string,
    label: string,
    group: string
}

export class DropdownOption implements IDropdownOption {
    public group : string;
    constructor(public id: string, public label: string) {

    }
}