import {Records} from './Records';

export class RecordModel {
  private records: Array<Records>;
  
  constructor(records: Array<Records>) {
    this.records = records;
  }
}