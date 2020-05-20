export class UrlParamsParser {
  urlParams: any = {}

  init() {
    this.urlParams = this.parse(window.location.href)
  }

  // Parses URL parameters. Supported parameters are:
  // - lang=xy: Specifies the language of the user interface.
  // - touch=1: Enables a touch-style user interface.
  // - storage=local: Enables HTML5 local storage.
  // - chrome=0: Chromeless mode.
  parse(url) {
    var result = new Object();
    var idx = url.lastIndexOf('?');

    if (idx > 0)
    {
      var params = url.substring(idx + 1).split('&');
      
      for (var i = 0; i < params.length; i++)
      {
        idx = params[i].indexOf('=');
        
        if (idx > 0)
        {
          result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
        }
      }
    }    
    return result;
  }
}    