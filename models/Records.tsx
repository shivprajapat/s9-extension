import {RecordFieldBox} from './RecordFieldBox';
import {RecordContentBox} from './RecordContentBox';
import {CryptoConfigBox} from './CryptoConfigBox';
import {RecordShareBox} from './RecordShareBox';

export class Records {
  private id: String;
  private dId: String;
  private lId: String;
  private userId: String;
  private categoryId: String;
  private typeId: String;
  private iconId: String;
  private name: String;
  private fav: Boolean;
  private otp: Boolean;
  private notes: Boolean;
  private shared: Boolean;
  private attachment: Boolean;
  private fields: Array<RecordFieldBox>;
  private attachments: Array<RecordContentBox>;
  private tags: Array<RecordContentBox>;
  private shares:RecordShareBox;
  private archived: Boolean;
  private recycled: Boolean;
  private deleted: Boolean;
  private encKey: String;
  private encConfig: CryptoConfigBox;
  private createTs: String;
  private updateTs: String;
  private recycleTs: String;
  private deleteTs: String;
  private schemaVersion: Number;
  private sync: Boolean;
  private boxKey: Number;

  constructor(
      id: String, 
      dId: String, 
      lId: String, 
      userId: String,
      categoryId: String, 
      typeId: String, 
      iconId: String, 
      name: String, 
      fav: Boolean, 
      otp: Boolean, 
      notes: Boolean, 
      shared: Boolean, 
      attachment: Boolean,
      fields:Array<RecordFieldBox>,
      attachments:Array<RecordContentBox>,
      tags:Array<RecordContentBox>,
      shares:RecordShareBox,
      archived: Boolean,
      recycled: Boolean,
      deleted: Boolean,
      encKey: String, 
      encConfig:CryptoConfigBox,
      createTs: String, 
      updateTs: String, 
      recycleTs: String, 
      deleteTs: String, 
      schemaVersion: Number, 
      sync: Boolean, 
      boxKey: Number, 
      
    ) {
      this.id = id;
      this.dId = dId;
      this.lId = lId;
      this.userId = userId;
      this.categoryId = categoryId;
      this.typeId = typeId;
      this.iconId = iconId;
      this.name = name;
      this.fav = fav;
      this.otp = otp;
      this.notes = notes;
      this.shared = shared;
      this.attachment = attachment;
      this.fields = fields;
      this.attachments = attachments;
      this.tags = tags;
      this.shares = shares;
      this.archived = archived;
      this.recycled = recycled;
      this.deleted = deleted;
      this.encKey = encKey;
      this.encConfig = encConfig;
      this.createTs = createTs;
      this.updateTs = updateTs;
      this.recycleTs = recycleTs;
      this.deleteTs = deleteTs;
      this.schemaVersion = schemaVersion;
      this.sync = sync;
      this.boxKey = boxKey;
  }
}