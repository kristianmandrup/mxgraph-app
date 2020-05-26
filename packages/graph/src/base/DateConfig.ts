export class DateConfig {
  pad(number) {
    var r = String(number);

    if (r.length === 1) {
      r = "0" + r;
    }

    return r;
  }

  configure() {
    this.setNow();
    this.setToISOString();
  }

  setNow() {
    // Shim for Date.now()
    if (!Date.now) {
      Date.now = function () {
        return new Date().getTime();
      };
    }
    return this;
  }

  setToISOString() {
    // Shim for missing toISOString in older versions of IE
    // See https://stackoverflow.com/questions/12907862
    if (!Date.prototype.toISOString) {
      Date.prototype.toISOString = this.toISOString;
    }
    return this;
  }

  toISOString = () => {
    const { pad } = this;
    const $ = Date.prototype;
    return (
      $.getUTCFullYear() +
      "-" +
      pad($.getUTCMonth() + 1) +
      "-" +
      pad($.getUTCDate()) +
      "T" +
      pad($.getUTCHours()) +
      ":" +
      pad($.getUTCMinutes()) +
      ":" +
      pad($.getUTCSeconds()) +
      "." +
      String(($.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
      "Z"
    );
  };
}
