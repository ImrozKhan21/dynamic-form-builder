export interface IQuery {
    query: string;
    params: { [key: string]: any };
}

export class Query implements IQuery {
    constructor(public query: string, public params: { [key: string]: any }) { }
}
