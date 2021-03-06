import {Injectable} from '@angular/core';
import {CinchyService} from '@cinchy-co/angular-sdk';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  formId;

  constructor(private cincyService: CinchyService) {
  }

  getAllForms() {
    const formDataQuery = `
    SELECT [Table].[Domain].[Name] as 'tableDomainName',
           [Table].[Name] as 'tableName',
           [Lookup Label].[Name] as 'lookUpLabel',
           [Form ID] as 'formId'
    FROM   [Dynamic Forms].[Forms]
    WHERE  [Deleted] IS NULL
`;
    return this.cincyService.executeCsql(formDataQuery, null);
  }

  getFormMetaDataBasedOnId(formId) {
    const formDataQuery = `
    SELECT [Table].[Domain].[Name] as 'tableDomainName',
           [Table].[Name] as 'tableName',
           [Lookup Label].[Name] as 'lookUpLabel',
           [Form ID] as 'formId'
    FROM   [Dynamic Forms].[Forms]
    WHERE  [Deleted] IS NULL and [Form ID] = @formId
`;
    const params = {
      '@formId': formId ? formId.toString() : null
    };
    return this.cincyService.executeCsql(formDataQuery, params);
  }

  getRowsForTable(formMetaData) {
    const {tableDomainName, tableName, lookUpLabel} = formMetaData;
    const tableRowsDataQuery = `
    SELECT [Cinchy Id] as 'rowId', [${lookUpLabel}] as 'lookUpLabel'
    FROM   [${tableDomainName}].[${tableName}]
    WHERE  [Deleted] IS NULL
    ORDER BY [${lookUpLabel}] ASC

`;
    return this.cincyService.executeCsql(tableRowsDataQuery, null);
  }
}
