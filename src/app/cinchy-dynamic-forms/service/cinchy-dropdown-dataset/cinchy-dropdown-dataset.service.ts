import { Injectable } from '@angular/core';
import { CinchyService } from '@cinchy-co/angular-sdk';
import { isNullOrUndefined } from 'util';
import { DropdownDataset } from './cinchy-dropdown-dataset';
import { IDropdownOption, DropdownOption } from './cinchy-dropdown-options';

@Injectable({
  providedIn: 'root'
})
export class DropdownDatasetService {
  private _dropdownDatasets: { [key: number]: DropdownDataset } = {};

  constructor(private _cinchyService: CinchyService) { }

  //#region Bind dropdownList (Link Type) from database
  /**
   * bind dropdown option from cinch
   * @param linkTargetColumnId (parameter of the link type column Cinchy Id)
   */
  //#endregion
  async getDropdownDataset(linkTargetColumnId: number): Promise<DropdownDataset> {
    let result: DropdownDataset = this._dropdownDatasets[linkTargetColumnId];
    if (!isNullOrUndefined(result)) {
      return result;
    }
    // Get meta data for the cinchy link
    let tableColumnQuery: string = 'select tc.[Table].[Domain].[Name] as \'Domain\', tc.[Table].[Name] as \'Table\', tc.[Name] as \'Column\' from [Cinchy].[Cinchy].[Table Columns] tc where tc.[Deleted] is null and tc.[Table].[Deleted] is null and tc.[Cinchy Id] = ' + linkTargetColumnId;
    let metadataQueryResult: Object[] = (await this._cinchyService.executeCsql(tableColumnQuery, null).toPromise()).queryResult.toObjectArray();
    if (isNullOrUndefined(metadataQueryResult) || metadataQueryResult.length == 0) {
      return null;
    }
    let dataSetQuery: string = 'select t.[Cinchy Id] as \'Id\', t.[' + metadataQueryResult[0]['Column'] + '] as \'Label\' from [' + metadataQueryResult[0]['Domain'] + '].[' + metadataQueryResult[0]['Table'] + '] t where t.[Deleted] is null';
    let optionArray: IDropdownOption[] = [];
    (await this._cinchyService.executeCsql(dataSetQuery, null).toPromise()).queryResult.toObjectArray().forEach(function (row) {
      optionArray.push(new DropdownOption(row['Id'], row['Label']));
    });
    result = new DropdownDataset(optionArray);
    this._dropdownDatasets[linkTargetColumnId] = result;
    return result;
  }

}
