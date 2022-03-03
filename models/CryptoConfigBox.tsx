export class CryptoConfigBox {
  private scheme: String;
  private config: String;
  
  constructor(
    scheme: String,
    config: String,
  ) {
    this.scheme = scheme;
    this.config = config;
  }
}