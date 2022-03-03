export class RecordFieldBox {
  private type: String;
  private label: String;
  private value: String;
  private masked: Boolean;
  
  constructor(
    type: String,
    label: String,
    value: String,
    masked: Boolean,
  ) {
    this.type = type;
    this.label = label;
    this.value = value;
    this.masked = masked;
  }
}