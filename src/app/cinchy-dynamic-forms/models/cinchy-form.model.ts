import { IFormSection } from './cinchy-form-sections.model';
import { IQuery, Query } from './cinchy-query.model';
import { isNullOrUndefined } from 'util';
import { element } from '@angular/core/src/render3';
import { DropdownDataset } from '../service/cinchy-dropdown-dataset/cinchy-dropdown-dataset';
import { IDropdownOption, DropdownOption } from '../service/cinchy-dropdown-dataset/cinchy-dropdown-options';

export interface IForm {
  id: number;
  name: string;
  targetTableId: number;
  targetTableDomain: string;
  targetTableName: string;
  sections: Array<IFormSection>;
  rowId: number;
  generateSelectQuery(rowId: number): IQuery;
  loadRecordData(rowId: number, rowData: Array<any>): void;
  generateSaveQuery(rowID: number): IQuery;
  generateDeleteQuery(): IQuery;
  checkFormValidation(): any;
  checkChildFormValidation(): any;
  generateSaveForChildQuery(rowID: number, sourceID: number): IQuery
}

export class Form implements IForm {
  rowId = null;
  sections: Array<IFormSection> = [];
  private _dropdownDatasets: { [key: number]: DropdownDataset } = {};
  constructor(public id: number, public name: string, public targetTableId: number, public targetTableDomain: string, public targetTableName: string) { }

  generateSelectQuery(rowId: number, parentTableId: number = 0, isChild: boolean = false): IQuery {
    let columnName = null;
    let fields: Array<string> = [];
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        //TODO: GET The values Dynamically
        if (parentTableId === element.cinchyColumn.LinkTargetTableId) {
          columnName = element.cinchyColumn.name;
        }
        if (isNullOrUndefined(element.cinchyColumn.name) || element.cinchyColumn.name == '') {
          return;
        }
        if (element.cinchyColumn.dataType === 'Link') {
          //Todo: CHanges for Short Name
          if (element.cinchyColumn.name === 'Source System Short Name') {
            fields.push('[Source System Name].[Cinchy Id] as \'Source System Name \'');
          }
          else {
            fields.push('[' + element.cinchyColumn.name + '].[Cinchy Id] as \'' + element.cinchyColumn.name + '\'');
            fields.push('[' + element.cinchyColumn.name + '].[' + element.cinchyColumn.linkTargetColumnName + '] as \'' + element.cinchyColumn.name + ' label\'');
          }
        }
        else {
          //Todo: Changes for Short Name
          fields.push('[' + element.cinchyColumn.name + ']');
        }
      });
    });
    fields.push('[Cinchy ID]');
    if (isChild && !isNullOrUndefined(columnName)) {
      let query: IQuery = new Query('select ' + fields.join(',') + ' from [' + this.targetTableDomain + '].[' + this.targetTableName + '] t where t.[' + columnName + '].[Cinchy Id] = ' + rowId + ' and t.[Deleted] is null Order by t.[Cinchy Id]', null);
      return query;
    }
    else {
      let query: IQuery = new Query('select ' + fields.join(',') + ' from [' + this.targetTableDomain + '].[' + this.targetTableName + '] t where t.[Cinchy Id] = ' + rowId + ' and t.[Deleted] is null Order by t.[Cinchy Id]', null);
      return query;
    }

  }

  loadRecordData(rowId: number, rowData: any): void {
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        if (isNullOrUndefined(element.cinchyColumn.name) || element.cinchyColumn.name == '') {
          return;
        }
        rowData.forEach(Rowelement => {
          //Todo: Passing array value in case of multiselect
          if (element.cinchyColumn.dataType == 'Choice' && element.cinchyColumn.isMultiple == true) {
            const valueArray = (isNullOrUndefined(Rowelement[element.cinchyColumn.name]) ?
              [] : Rowelement[element.cinchyColumn.name].split(','));
            let optionArray = [];
            // tslint:disable-next-line:no-shadowed-variable
            valueArray.forEach((element: any) => {
              if (element !== '' && !isNullOrUndefined(element)) {
                const value = element.trim();
                const objValues = {
                  id: value,
                  itemName: value
                };
                optionArray.push(objValues);

              }
            });
            element.setInitialValue(optionArray);
          }
          else {
            element.setInitialValue(Rowelement[element.cinchyColumn.name]);
          }

          if (element.cinchyColumn.dataType === 'Link') {
            let optionArray: IDropdownOption[] = [];
            if (!isNullOrUndefined(Rowelement[element.cinchyColumn.name]) && Rowelement[element.cinchyColumn.name] !== '') {
              optionArray.push(new DropdownOption(Rowelement[element.cinchyColumn.name], Rowelement[element.cinchyColumn.name + ' label']));
              let result = new DropdownDataset(optionArray);
              Rowelement[element.cinchyColumn.name] = element.value;
              if (isNullOrUndefined(element['dropdownDataset'])) {
                element['dropdownDataset'] = result;
              }
            }

          }
        });

      });
    });
    this.rowId = rowId;
  }

  loadMultiRecordData(rowId: number, rowData: any): void {
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        if (isNullOrUndefined(element['MultiFields'])) {
          section['MultiFields'] = [];
          //  section['MultiFields'] = rowData;
        }
        if (isNullOrUndefined(element.cinchyColumn.name) || element.cinchyColumn.name == '') {
          return;
        }
        rowData.forEach(Rowelement => {
          //Todo: Passing array value in case of multiselect
          if (element.cinchyColumn.dataType == 'Choice' && element.cinchyColumn.isMultiple == true) {
            const valueArray = (isNullOrUndefined(Rowelement[element.cinchyColumn.name]) ?
              [] : Rowelement[element.cinchyColumn.name].split(','));
            let optionArray = [];
            // tslint:disable-next-line:no-shadowed-variable
            valueArray.forEach((element: any) => {
              if (element !== '' && !isNullOrUndefined(element)) {
                const value = element.trim();
                const objValues = {
                  id: value,
                  itemName: value
                };
                optionArray.push(objValues);

              }
            });
            element.setInitialValue(optionArray);
          } else {
            element.setInitialValue(Rowelement[element.cinchyColumn.name]);
          }
          if (element.cinchyColumn.dataType === 'Link') {
            if (!isNullOrUndefined(Rowelement[element.cinchyColumn.name]) && Rowelement[element.cinchyColumn.name] !== '') {
              let optionArray: IDropdownOption[] = [];
              optionArray.push(new DropdownOption(Rowelement[element.cinchyColumn.name], Rowelement[element.cinchyColumn.name + ' label']));
              let result = new DropdownDataset(optionArray);
            //  Rowelement[element.cinchyColumn.name] = element.value;
              if (isNullOrUndefined(element['dropdownDataset'])) {
                element['dropdownDataset'] = result;
              } else {
                if(!isNullOrUndefined(element['dropdownDataset'].options)) {
                  element['dropdownDataset'].options.push(result.options[0]);
                }
              }
              if (!isNullOrUndefined(element['dropdownDataset'])) {
                let dropdownResult = element['dropdownDataset'].options.find(e => e.id ===
                  Rowelement[element.cinchyColumn.name]);
                if (!isNullOrUndefined(dropdownResult)) {
                  Rowelement[element.cinchyColumn.name] = dropdownResult['label'];
                 
                }

              }
            }
            delete Rowelement[element.cinchyColumn.name + ' label']
          }

        });
        //   section['MultiFields'].push(rowData);

      });
      section['MultiFields'] = rowData;
    });
    this.rowId = rowId;
  }

  generateSaveQuery(rowID): IQuery {
    let i: number = 0;
    let params = {};
    let query: IQuery = null;
    let assignmentColumns: string[] = [];
    let assignmentValues: string[] = [];
    this.rowId = rowID;
    let paramName: string;
    let tableAliasInQuery = isNullOrUndefined(this.rowId) ? '' : ''; // use an alias if this is an update to support ResolveLink
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        if (isNullOrUndefined(element.value) && (element.cinchyColumn.dataType === 'Link' || element.cinchyColumn.dataType === 'Yes/No')) {
          //todo: check for link type
        }
        else {
          if (element.cinchyColumn.name != null && element.cinchyColumn.dataType != 'Calculated') {
            paramName = '@p' + i.toString();
            switch (element.cinchyColumn.dataType) {
              case "Date and Time":
                let elementValue = isNullOrUndefined(element.value) ? '' :
                  element.value instanceof Date ? element.value.toLocaleDateString() : element.value;
                params[paramName] = elementValue;
                break;
              case "Number":
                let elementValueNumber = isNullOrUndefined(element.value) ? '' : element.value;
                params[paramName] = elementValueNumber;
                break;
              //TODO: Currently For only Choice of MultiSelect
              case "Choice":
                const arrayElement = [];
                element.value.forEach(element => {
                  if (element.id !== "" && !isNullOrUndefined(element.id)) {
                    arrayElement.push(element.id.trim());
                  }

                });
                let choiceElementValue = isNullOrUndefined(arrayElement) ? '' : arrayElement.join(',');
                params[paramName] = choiceElementValue;
                break;
              case "Binary":
                params[paramName] = element["fileData"];
                assignmentColumns.push(tableAliasInQuery + '[' + element.cinchyColumn.name + ']');
                assignmentValues.push('\'' + params[paramName] + '\'');
                i++;
                paramName = '@p' + i.toString();
                params[paramName] = element["fileName"];
                assignmentColumns.push(tableAliasInQuery + '[File Name]');
                assignmentValues.push('\'' + params[paramName] + '\'');
                i++;
                paramName = '@p' + i.toString();
                params[paramName] = this.rowId;
                assignmentColumns.push(tableAliasInQuery + '[Cinchy Id]');
                assignmentValues.push(params[paramName]);
                //Todo: for the purpose to save files
                rowID = null;
                break;
              case "Link":
                let stringLink = '';
                if (element.value instanceof Array) {
                  let stringLinkArray = [];
                  element.value.forEach(element => {
                    //stringLink = element + ',0';
                    stringLinkArray.push(element);
                    stringLinkArray.push(0);
                  });
                  params[paramName] = stringLinkArray.join(',');
                } else {
                  params[paramName] = element.value;
                }
                break;
              default:
              params[paramName] = isNullOrUndefined(element.value) ? '' : element.value;
            }
            //TOdo: Return Insert Data when binary
            if (element.cinchyColumn.dataType !== 'Binary') {
              if (element.cinchyColumn.name === 'Source System Short Name') {
                assignmentColumns.push(tableAliasInQuery + '[Source System Name]');
              } else {
                assignmentColumns.push(tableAliasInQuery + '[' + element.cinchyColumn.name + ']');
              }

            }
            if (isNullOrUndefined(element.cinchyColumn.linkTargetColumnName) &&
              element.cinchyColumn.dataType !== 'Binary') {
              //ToDO: for insert data ... because insert is giving error with parameters
              isNullOrUndefined(this.rowId) ? assignmentValues.push('\'' + params[paramName] + '\'') :
                assignmentValues.push(paramName);
            } else if (element.cinchyColumn.dataType !== 'Binary') {
              //TODO: code for the multi select Link
              if (element.value instanceof Array) {
                let stringLinkArray = [];
                element.value.forEach(element => {
                  //stringLink = element + ',0';
                  stringLinkArray.push(element);
                  stringLinkArray.push(0);
                });
                //ToDO: for insert data ... because insert is giving error with parameters
                isNullOrUndefined(this.rowId) ? assignmentValues.push(stringLinkArray.join(',')) : assignmentValues.push(paramName);
              } else {
                //ToDO: for insert data ... because insert is giving error with parameters
                isNullOrUndefined(this.rowId) ? assignmentValues.push('ResolveLink(' + params[paramName] + ',\'' + "Cinchy Id" + '\')') : assignmentValues.push('ResolveLink(' + paramName + ',\'' + "Cinchy Id" + '\')');
              }


            }
            i++;
          }
        }
      });
    });

    //query = new Query('insert into [' + this.targetTableDomain + '].[' + this.targetTableName + '] (' + assignmentColumns.join(',') + ') values (' + assignmentValues.join(',') + ') select 1', null);
    if (isNullOrUndefined(rowID)) {
      //Todo: Change in insert query.
      query = new Query('insert into [' + this.targetTableDomain + '].[' + this.targetTableName + '] (' + assignmentColumns.join(',') + ') values (' + assignmentValues.join(',') + ') SELECT @cinchy_row_id', params);
    } else {
      let assignmentSetClauses: string[] = [];
      for (let j = 0; j < assignmentColumns.length; j++) {
        assignmentSetClauses.push(assignmentColumns[j] + ' = ' + assignmentValues[j]);
      }
      query = new Query('update t set ' + assignmentSetClauses.join(',') + ' from [' + this.targetTableDomain + '].[' + this.targetTableName + '] t where t.[Cinchy Id] = ' + this.rowId + ' and t.[Deleted] is null', params);
    }
    return query;
  }

  generateSaveForChildQuery(rowID, sourceID): IQuery {
    let i: number = 0;
    let params = {};
    let query: IQuery = null;
    let assignmentColumns: string[] = [];
    let assignmentValues: string[] = [];
    //for insert values
    this.rowId = rowID;
    let paramName: string;
    let tableAliasInQuery = isNullOrUndefined(this.rowId) ? '' : ''; // use an alias if this is an update to support ResolveLink
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        if (isNullOrUndefined(element.value) &&
          (!isNullOrUndefined(element.cinchyColumn.linkTargetColumnName) ||
            element.cinchyColumn.dataType === 'Yes/No') &&
          element.cinchyColumn.name !== 'Source Table Name'
          && element.cinchyColumn.name !== 'Raw View Name' &&
          element.cinchyColumn.name !== 'Curated Table Name' &&
          element.cinchyColumn.name !== 'Curated View Table Name') {
          console.log('Link type cannot be null');
        }
        else {
          if (element.cinchyColumn.name != null && element.cinchyColumn.dataType != 'Calculated') {
            paramName = '@p' + i.toString();
            switch (element.cinchyColumn.dataType) {
              case "Date and Time":
                let elementValue = isNullOrUndefined(element.value) ? '' :
                  element.value instanceof Date ? element.value.toLocaleDateString() : element.value;
                params[paramName] = elementValue;
                break;
                case "Number":
                let elementValueNumber = isNullOrUndefined(element.value) ? '' : element.value;
                params[paramName] = elementValueNumber;
                break;
              //TODO: Currently For only Choice of MultiSelect
              case "Choice":
                const arrayElement = [];
                element.value.forEach(element => {
                  if (element.id !== "" && !isNullOrUndefined(element.id)) {
                    arrayElement.push(element.id.trim());
                  }

                });
                let choiceElementValue = isNullOrUndefined(arrayElement) ? '' : arrayElement.join(',');
                params[paramName] = choiceElementValue;
                break;
              case "Binary":
                params[paramName] = element["fileData"];
                assignmentColumns.push(tableAliasInQuery + '[' + element.cinchyColumn.name + ']');
                assignmentValues.push('\'' + params[paramName] + '\'');
                i++;
                paramName = '@p' + i.toString();
                params[paramName] = element["fileName"];
                assignmentColumns.push(tableAliasInQuery + '[File Name]');
                assignmentValues.push('\'' + params[paramName] + '\'');
                i++;
                paramName = '@p' + i.toString();
                params[paramName] = this.rowId;
                assignmentColumns.push(tableAliasInQuery + '[Cinchy Id]');
                assignmentValues.push(params[paramName]);
                //Todo: for the purpose to save files
                rowID = null;
                break;
              case "Link":
                let stringLink = '';
                if (element.value instanceof Array) {
                  let stringLinkArray = [];
                  element.value.forEach(element => {
                    //stringLink = element + ',0';
                    stringLinkArray.push(element);
                    stringLinkArray.push(0);
                  });
                  params[paramName] = stringLinkArray.join(',');
                } else {
                  if (element.cinchyColumn.name === 'Source Table Name'
                    || element.cinchyColumn.name === 'Raw View Name' ||
                    element.cinchyColumn.name === 'Curated Table Name' ||
                    element.cinchyColumn.name === 'Curated View Table Name') {
                    params[paramName] = sourceID;
                  } else {
                    params[paramName] = (isNullOrUndefined(element.value) ||
                      element.value === '') ? null : element.value;
                  }
                }
                break;
              default:
                params[paramName] = isNullOrUndefined(element.value) ? '' : element.value;
            }
            //TOdo: Return Insert Data when binary
            if (element.cinchyColumn.dataType !== 'Binary') {
              if (element.cinchyColumn.name === 'Source System Short Name') {
                assignmentColumns.push(tableAliasInQuery + '[Source System Name]');
              } else {
                assignmentColumns.push(tableAliasInQuery + '[' + element.cinchyColumn.name + ']');
              }

            }
            if (isNullOrUndefined(element.cinchyColumn.linkTargetColumnName) &&
              element.cinchyColumn.dataType !== 'Binary') {
              //ToDO: for insert data ... because insert is giving error with parameters
              isNullOrUndefined(this.rowId) ? assignmentValues.push('\'' + params[paramName] + '\'') :
                assignmentValues.push(paramName);
            } else if (element.cinchyColumn.dataType !== 'Binary') {
              //TODO: code for the multi select Link
              if (element.value instanceof Array) {
                let stringLinkArray = [];
                element.value.forEach(element => {
                  //stringLink = element + ',0';
                  stringLinkArray.push(element);
                  stringLinkArray.push(0);
                });
                //ToDO: for insert data ... because insert is giving error with parameters
                isNullOrUndefined(this.rowId) ? assignmentValues.push(stringLinkArray.join(',')) : assignmentValues.push(paramName);
              } else {
                //ToDO: for insert data ... because insert is giving error with parameters
                isNullOrUndefined(this.rowId) ? assignmentValues.push('ResolveLink(' + params[paramName] + ',\'' + "Cinchy Id" + '\')') : assignmentValues.push('ResolveLink(' + paramName + ',\'' + "Cinchy Id" + '\')');
              }


            }
            i++;
          }
        }
      });
    });

    //query = new Query('insert into [' + this.targetTableDomain + '].[' + this.targetTableName + '] (' + assignmentColumns.join(',') + ') values (' + assignmentValues.join(',') + ') select 1', null);
    if (isNullOrUndefined(rowID)) {
      //Todo: Change in insert query.
      query = new Query('insert into [' + this.targetTableDomain + '].[' + this.targetTableName + '] (' + assignmentColumns.join(',') + ') values (' + assignmentValues.join(',') + ')', params);
    } else {
      let assignmentSetClauses: string[] = [];
      for (let j = 0; j < assignmentColumns.length; j++) {
        assignmentSetClauses.push(assignmentColumns[j] + ' = ' + assignmentValues[j]);
      }
      query = new Query('update t set ' + assignmentSetClauses.join(',') + ' from [' + this.targetTableDomain + '].[' + this.targetTableName + '] t where t.[Cinchy Id] = ' + this.rowId + ' and t.[Deleted] is null', params);
    }
    return query;
  }

  generateDeleteQuery(): IQuery {
    let query: IQuery = new Query('delete from [' + this.targetTableDomain + '].[' + this.targetTableName + '] where [Cinchy Id] = ' + this.rowId + ' and [Deleted] is null', null);
    return query;
  }
  // Check For the Required Field Before Save Data
  checkFormValidation() {
    let message = '';
    let validationResult = {
      status: true,
      message: ''
    };
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        if (element.cinchyColumn.isMandatory === true && (isNullOrUndefined(element.value) || element.value === "")) {
          validationResult.status = false;
          validationResult.message = `Field ${element.cinchyColumn.name} is required`;
        };

        if (element.cinchyColumn.validationExpression !== '' && !isNullOrUndefined(element.cinchyColumn.validationExpression)) {
          var exp = element.cinchyColumn.validationExpression;
          const regex = new RegExp(exp);
          if(!isNullOrUndefined(element.value) && element.value !== '') {
            element.value = element.value.trim();
          }
          if (!regex.test(element.value)) {
            validationResult.status = false;
            validationResult.message = `No special characters are allowed in ${element.cinchyColumn.name}`
          };
        }
      });
    });
    return validationResult;
  }

  checkChildFormValidation() {
    let message = '';
    let validationResult = {
      status: true,
      message: ''
    };
    this.sections.forEach(section => {
      section.fields.forEach(element => {
        if (element.cinchyColumn.isMandatory === true && (isNullOrUndefined(element.value) || element.value === "")
          && element.cinchyColumn.name !== 'Source Table Name' && element.cinchyColumn.name !== 'Raw Table Name'
          && element.cinchyColumn.name !== 'Curated Table Name'
        ) {
          validationResult.status = false;
          validationResult.message = `Field ${element.cinchyColumn.name} is required`;
        };

        if (element.cinchyColumn.validationExpression !== '' && !isNullOrUndefined(element.cinchyColumn.validationExpression)) {
          var exp = element.cinchyColumn.validationExpression;
          const regex = new RegExp(exp);
          if(!isNullOrUndefined(element.value) && element.value !== '') {
            element.value = element.value.trim();
          }
          if (!regex.test(element.value)) {
            validationResult.status = false;
            validationResult.message = `No special characters are allowed in ${element.cinchyColumn.name}`
          };
        }
      });
    });
    return validationResult;
  }
}