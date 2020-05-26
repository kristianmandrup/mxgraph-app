export class DomainUrl {
  baseUrl: any;
  domainUrl: any;
  domainPathUrl: any;

  configure() {
    var b = this.baseUrl;
    var p = b.indexOf("//");
    this.domainUrl = "";
    this.domainPathUrl = "";

    if (p > 0) {
      var d = b.indexOf("/", p + 2);
      if (d > 0) {
        this.domainUrl = b.substring(0, d);
      }
      d = b.lastIndexOf("/");
      if (d > 0) {
        this.domainPathUrl = b.substring(0, d + 1);
      }
    }
  }
}
