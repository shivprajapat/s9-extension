import {RecordContentBox} from './RecordContentBox';

export class RecordShareBox {
  private users: Array<RecordContentBox>;
  private groups: Array<RecordContentBox>;
  
  constructor(
    users: Array<RecordContentBox>,
    groups: Array<RecordContentBox>,
  ) {
    this.users = users;
    this.groups = groups;
  }
}