import mx from "@mxgraph-app/mx";
const { mxResources, mxUtils } = mx;

/**
 *
 */
export class ErrorDialog {
  btn: any;
  container: any;

  constructor(editorUi, title, message, buttonText, opts: any = {}) {
    let { fn, retry, buttonText2, fn2, hide, buttonText3, fn3 } = opts;
    hide = hide != null ? hide : true;

    var div = document.createElement("div");
    div.style.textAlign = "center";

    if (title != null) {
      var hd = document.createElement("div");
      hd.style.padding = "0px";
      hd.style.margin = "0px";
      hd.style.fontSize = "18px";
      hd.style.paddingBottom = "16px";
      hd.style.marginBottom = "10px";
      hd.style.borderBottom = "1px solid #c0c0c0";
      hd.style.color = "gray";
      hd.style.whiteSpace = "nowrap";
      hd.style.textOverflow = "ellipsis";
      hd.style.overflow = "hidden";
      mxUtils.write(hd, title);
      hd.setAttribute("title", title);
      div.appendChild(hd);
    }

    var p2 = document.createElement("div");
    p2.style.lineHeight = "1.2em";
    p2.style.padding = "6px";
    p2.innerHTML = message;
    div.appendChild(p2);

    var btns = document.createElement("div");
    btns.style.marginTop = "12px";
    btns.style.textAlign = "center";

    if (retry != null) {
      var retryBtn = mxUtils.button(mxResources.get("tryAgain"), function () {
        editorUi.hideDialog();
        retry();
      });
      retryBtn.className = "geBtn";
      btns.appendChild(retryBtn);

      btns.style.textAlign = "center";
    }

    if (buttonText3 != null) {
      var btn3 = mxUtils.button(buttonText3, function () {
        if (fn3 != null) {
          fn3();
        }
      });

      btn3.className = "geBtn";
      btns.appendChild(btn3);
    }

    var btn = mxUtils.button(buttonText, function () {
      if (hide) {
        editorUi.hideDialog();
      }

      if (fn != null) {
        fn();
      }
    });

    btn.className = "geBtn";
    btns.appendChild(btn);

    if (buttonText2 != null) {
      var mainBtn = mxUtils.button(buttonText2, function () {
        if (hide) {
          editorUi.hideDialog();
        }

        if (fn2 != null) {
          fn2();
        }
      });

      mainBtn.className = "geBtn gePrimaryBtn";
      btns.appendChild(mainBtn);
    }

    div.appendChild(btns);

    this.container = div;
  }

  init() {
    this.btn.focus();
  }
}
