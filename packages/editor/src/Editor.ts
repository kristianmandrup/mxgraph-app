import mx from "@mxgraph-app/mx";
import resources from "@mxgraph-app/resources";
const {
  mxEventObject,
  mxCodec,
  mxRectangle,
  mxGraph,
  mxChildChange,
  mxUndoManager,
  mxPoint,
  mxEvent,
  mxClient,
  mxResources,
  mxUtils,
} = mx;
const { IMAGE_PATH } = resources;

const Graph: any = {};

/**
 * Editor constructor executed on page load.
 */
export class Editor {
  undoMgr: any; // mxUndoManager
  documentMode: any;
  /**
   * Editor inherits from mxEventSource
   */
  // mxUtils.extend(Editor, mxEventSource);

  /**
   * Counts open editor tabs (must be global for cross-window access)
   */
  static pageCounter: any = 0;
  /**
   * Specifies if local storage should be used (eg. on the iPad which has no filesystem)
   */
  static useLocalStorage = typeof Storage != "undefined" && mxClient.IS_IOS;

  /**
   *
   */
  static moveImage = mxClient.IS_SVG
    ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI4cHgiIGhlaWdodD0iMjhweCI+PGc+PC9nPjxnPjxnPjxnPjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuNCwyLjQpc2NhbGUoMC44KXJvdGF0ZSg0NSwxMiwxMikiIHN0cm9rZT0iIzI5YjZmMiIgZmlsbD0iIzI5YjZmMiIgZD0iTTE1LDNsMi4zLDIuM2wtMi44OSwyLjg3bDEuNDIsMS40MkwxOC43LDYuN0wyMSw5VjNIMTV6IE0zLDlsMi4zLTIuM2wyLjg3LDIuODlsMS40Mi0xLjQyTDYuNyw1LjNMOSwzSDNWOXogTTksMjEgbC0yLjMtMi4zbDIuODktMi44N2wtMS40Mi0xLjQyTDUuMywxNy4zTDMsMTV2Nkg5eiBNMjEsMTVsLTIuMywyLjNsLTIuODctMi44OWwtMS40MiwxLjQybDIuODksMi44N0wxNSwyMWg2VjE1eiIvPjwvZz48L2c+PC9nPjwvc3ZnPgo="
    : IMAGE_PATH + "/move.png";

  /**
   * Images below are for lightbox and embedding toolbars.
   */
  static helpImage = mxClient.IS_SVG
    ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTExIDE4aDJ2LTJoLTJ2MnptMS0xNkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bTAtMTRjLTIuMjEgMC00IDEuNzktNCA0aDJjMC0xLjEuOS0yIDItMnMyIC45IDIgMmMwIDItMyAxLjc1LTMgNWgyYzAtMi4yNSAzLTIuNSAzLTUgMC0yLjIxLTEuNzktNC00LTR6Ii8+PC9zdmc+"
    : IMAGE_PATH + "/help.png";

  /**
   * Sets the default font size.
   */
  static checkmarkImage = mxClient.IS_SVG
    ? "data:image/gif;base64,R0lGODlhFQAVAMQfAGxsbHx8fIqKioaGhvb29nJycvr6+sDAwJqamltbW5OTk+np6YGBgeTk5Ly8vJiYmP39/fLy8qWlpa6ursjIyOLi4vj4+N/f3+3t7fT09LCwsHZ2dubm5r6+vmZmZv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEY4NTZERTQ5QUFBMTFFMUE5MTVDOTM5MUZGMTE3M0QiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEY4NTZERTU5QUFBMTFFMUE5MTVDOTM5MUZGMTE3M0QiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Rjg1NkRFMjlBQUExMUUxQTkxNUM5MzkxRkYxMTczRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Rjg1NkRFMzlBQUExMUUxQTkxNUM5MzkxRkYxMTczRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAB8ALAAAAAAVABUAAAVI4CeOZGmeaKqubKtylktSgCOLRyLd3+QJEJnh4VHcMoOfYQXQLBcBD4PA6ngGlIInEHEhPOANRkaIFhq8SuHCE1Hb8Lh8LgsBADs="
    : IMAGE_PATH + "/checkmark.gif";

  /**
   * Images below are for lightbox and embedding toolbars.
   */
  static maximizeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABXRSTlMA758vX1Pw3BoAAABJSURBVAjXY8AJQkODGBhUQ0MhbAUGBiYY24CBgRnGFmZgMISwgwwDGRhEhVVBbAVmEQYGRwMmBjIAQi/CTIRd6G5AuA3dzYQBAHj0EFdHkvV4AAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static zoomOutImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAElBMVEUAAAAAAAAsLCxxcXEhISFgYGChjTUxAAAAAXRSTlMAQObYZgAAAEdJREFUCNdjIAMwCQrB2YKCggJQJqMwA7MglK1owMBgqABVApITgLJZXFxgbIQ4Qj3CHIT5ggoIe5kgNkM1KSDYKBKqxPkDAPo5BAZBE54hAAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static zoomInImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAElBMVEUAAAAAAAAsLCwhISFxcXFgYGBavKaoAAAAAXRSTlMAQObYZgAAAElJREFUCNdjIAMwCQrB2YKCggJQJqMIA4sglK3owMzgqABVwsDMwCgAZTMbG8PYCHGEeoQ5CPMFFRD2MkFshmpSQLBRJFSJ8wcAEqcEM2uhl2MAAAAASUVORK5CYII=";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static zoomFitImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAD1BMVEUAAAAAAAAwMDBwcHBgYGC1xl09AAAAAXRSTlMAQObYZgAAAEFJREFUCNdjIAMwCQrB2YKCggJQJqMwA7MglK1owMBgqABVApITwMdGqEeYgzBfUAFhLxPEZqgmBQQbRUKFOH8AAK5OA3lA+FFOAAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static layersImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAaVBMVEUAAAAgICAICAgdHR0PDw8WFhYICAgLCwsXFxcvLy8ODg4uLi4iIiIqKiokJCQYGBgKCgonJycFBQUCAgIqKiocHBwcHBwODg4eHh4cHBwnJycJCQkUFBQqKiojIyMuLi4ZGRkgICAEBATOWYXAAAAAGnRSTlMAD7+fnz8/H7/ff18/77+vr5+fn39/b28fH2xSoKsAAACQSURBVBjTrYxJEsMgDARZZMAY73sgCcn/HxnhKtnk7j6oRq0psfuoyndZ/SuODkHPLzfVT6KeyPePnJ7KrnkRjWMXTn4SMnN8mXe2SSM3ts8L/ZUxxrbAULSYJJULE0Iw9pjpenoICcgcX61mGgTgtCv9Be99pzCoDhNQWQnchD1mup5++CYGcoQexajZbfwAj/0MD8ZOaUgAAAAASUVORK5CYII=";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static previousImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAh0lEQVQ4je3UsQnCUBCA4U8hpa1NsoEjpHQJS0dxADdwEMuMIJkgA1hYChbGQgMi+JC8q4L/AB/vDu7x74cWWEZhJU44RmA1zujR5GIbXF9YNrjD/Q0bDRY4fEBZ4P4LlgTnCbAf84pUM8/9hY08tMUtEoQ1LpEgrNBFglChFXR6Q6GfwwR6AGKJMF74Vtt3AAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static nextImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAi0lEQVQ4jeXUIQ7CUAwA0MeGxWI2yylwnALJUdBcgYvM7QYLmjOQIAkIPmJZghiIvypoUtX0tfnJL38X5ZfaEgUeUcManFBHgS0SLlhHggk3bCPBhCf2keCQR8wjwYTDp6YiZxJmOU1jGw7vGALescuBxsArNlOwd/CM1VSM/ut1qCIw+uOwiMJ+OF4CQzBCXm3hyAAAAABJRU5ErkJggg==";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static editImage = mxClient.IS_SVG
    ? "data:image/gif;base64,R0lGODlhCwALAIABAFdXV////yH5BAEAAAEALAAAAAALAAsAAAIZjB8AiKuc4jvLOGqzrjX6zmkWyChXaUJBAQA7"
    : IMAGE_PATH + "/edit.gif";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static zoomOutLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA+vTcKMM96GRBHwXxi0YaX1HLrKWhiHpWEOnOr52Vb2xKSDcT19PKv5l/Ngdk8+viAAABJklEQVQ4y4WT2XaDMAxEvWD2nSSUNEnTJN3r//+9Sj7ILAY6L0ijC4ONYVZRpo6cByrz2YKSUGorGTpz71lPVHvT+avoB5wIkU/mxk8veceSuNoLg44IzziXjvpih72wKQnm8yc2UoiP/LAd8jQfe2Xf4Pq+2EyYIvv9wbzHHCgwxDdlBtWZOdqDfTCVgqpygQpsZaojVAVc9UjQxnAJDIBhiQv84tq3gMQCAVTxVoSibXJf8tMuc7e1TB/DCmejBNg/w1Y3c+AM5vv4w7xM59/oXamrHaLVqPQ+OTCnmMZxgz0SdL5zji0/ld6j88qGa5KIiBB6WeJGKfUKwSMKLuXgvl1TW0tm5R9UQL/efSDYsnzxD8CinhBsTTdugJatKpJwf8v+ADb8QmvW7AeAAAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static zoomInLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA+vTcKMM96GRBHwXxi0YaX1HLrKWhiHpWEOnOr52Vb2xKSDcT19PKv5l/Ngdk8+viAAABKElEQVQ4y4WT6WKCMBCENwkBwn2oFKvWqr3L+79es4EkQIDOH2d3Pxk2ABiJlB8JCXjqw4LikHVGLHTm3nM3UeVN5690GBBN0GwyV/3kkrUQR+WeKnREeKpzaXWd77CmJiXGfPIEI4V4yQ9TIW/ntlcMBe731Vts9w5TWG8F5j3mQI4hvrKpdGeYA7CX9qAcl650gVJartxRuhyHVghF8idQAIbFLvCLu28BsQEC6aKtCK6Pyb3JT7PmbmtNH8Ny56CotD/2qOs5cJbuffxgXmCib+xddVU5RNOhkvvkhTlFehzVWCOh3++MYElOhfdovaImnRYVmqDdsuhNp1QrBBE6uGC2+3ZNjGdg5B94oD+9uyVgWT79BwAxEBTWdOu3bWBVgsn/N/AHUD9IC01Oe40AAAAASUVORK5CYII=";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static actualSizeLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA+vTcKMM96GRBHwXxi0YaX1HLrKWhiHpWEOnOr52Vb2xKSDcT19PKv5l/Ngdk8+viAAABIUlEQVQ4y4WT2XqDIBCFBxDc9yTWNEnTJN3r+79eGT4BEbXnaubMr8dBBaM450dCQp4LWFAascGIRd48eB4cNYE7f6XjgGiCFs5c+dml6CFN6j1V6IQIlHPpdV/usKcmJcV88gQTRXjLD9Mhb+fWq8YG9/uCmTCFjeeDeY85UGKIUGUuqzN42kv7oCouq9oHamlzVR1lVfpAIu1QVRiW+sAv7r4FpAYIZZVsRXB9TP5Dfpo1d1trCgzz1iiptH/sUbdz4CzN9+mLeXHn3+hdddd4RDegsrvzwZwSs2GLPRJidAqCLTlVwaMPqpYMWjTWBB2WRW86pVkhSKyDK2bdt2tmagZG4sBD/evdLQHLEvQfAOKRoLCmG1FAB6uKmby+gz+REDn7O5+EwQAAAABJRU5ErkJggg==";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static printLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAXVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9RKvvlAAAAHnRSTlMAydnl77qbMLT093H7K4Nd4Ktn082+lYt5bkklEgP44nQSAAAApUlEQVQ4y73P2Q6DIBRF0cOgbRHHzhP//5m9mBAQKjG1cT0Yc7ITAMu1LNQgUZiQ2DYoNQ0sCQb6qgHAfRx48opq3J9AZ6xuF7uOew8Ik1OsCZRS2UAC9V+D9a+QZYxNA45YFQftPtSkATOhw7dAc0vPBwKWiIOjP0JZ0yMuQJ27g36DipOUsqRAM0dR8KD1/ILHaHSE/w8DIx09E3g/BTce6rHUB5sAPKvfF+JdAAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static layersLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAmVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7///+bnZkkAAAAMnRSTlMABPr8ByiD88KsTi/rvJb272mjeUA1CuPe1M/KjVxYHxMP6KZ0S9nYzGRGGRaznpGIbzaGUf0AAAHESURBVDjLbZLZYoIwEEVDgLCjbKIgAlqXqt3m/z+uNwu1rcyDhjl3ktnYL7OY254C0VX3yWFZfzDrOClbbgKxi0YDHjwl4jbnRkXxJS/C1YP3DbBhD1n7Ex4uaAqdVDb3yJ/4J/3nJD2to/ngQz/DfUvzMp4JJ5sSCaF5oXmemgQDfDxzbi+Kq4sU+vNcuAmx94JtyOP2DD4Epz2asWSCz4Z/4fECxyNj9zC9xNLHcdPEO+awDKeSaUu0W4twZQiO2hYVisTR3RCtK/c1X6t4xMEpiGqXqVntEBLolkZZsKY4QtwH6jzq67dEHlJysB1aNOD3XT7n1UkasQN59L4yC2RELMDSeCRtz3yV22Ub3ozIUTknYx8JWqDdQxbUes98cR2kZtUSveF/bAhcedwEWmlxIkpZUy4XOCb6VBjjxHvbwo/1lBAHHi2JCr0NI570QhyHq/DhJoE2lLgyA4RVe6KmZ47O/3b86MCP0HWa73A8/C3SUc5Qc1ajt6fgpXJ+RGpMvDSchepZDOOQRcZVIKcK90x2D7etqtI+56+u6n3sPriO6nfphitR4+O2m3EbM7lh3me1FM1o+LMI887rN+s3/wZdTFlpNVJiOAAAAABJRU5ErkJggg==";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static closeLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAUVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////8IN+deAAAAGnRSTlMAuvAIg/dDM/QlOeuFhj0S5s4vKgzjxJRQNiLSey0AAADNSURBVDjLfZLbEoMgDEQjRRRs1XqX///QNmOHJSnjPkHOGR7IEmeoGtJZstnwjqbRfIsmgEdtPCqe9Ynz7ZSc07rE2QiSc+qv8TvjRXA2PDUm3dpe82iJhOEUfxJJo3aCv+jKmRmH4lcCjCjeh9GWOdL/GZZkXH3PYYDrHBnfc4D/RVZf5sjoC1was+Y6HQxwaUxFvq/a0Pv343VCTxfBSRiB+ab3M3eiQZXmMNBJ3Y8pGRZtYQ7DgHMXJEdPLTaN/qBjzJOBc3nmNcbsA16bMR0oLqf+AAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static editLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAKnRSTlMA+hzi3nRQWyXzkm0h2j3u54gzEgSXjlYoTBgJxL2loGpAOS3Jt7Wxm35Ga7gRAAAA6UlEQVQ4y63Q2XaCMBSF4Q0JBasoQ5DJqbXjfv8HbCK2BZNwo/8FXHx7rcMC7lQu0iX8qU/qtvAWCpoqH8dYzS0SwaV5eK/UAf8X9pd2CWKzuF5Jrftp1owXwnIGLUaL3PYndOHf4kNNXWrXK/m7CHunk7K8LE6YtBpcknwG9GKxnroY+ylBXcx4xKyx/u/EuXi509cP9V7OO1oyHnzrdFTcqLG/4ibBA5pIMr/4xvKzuQDkVy9wW8SgBFD6HDvuzMvrZcC9QlkfMzI7w64m+b4PqBMNHB05lH21PVxJo2/fBXxV4hB38PcD+5AkI4FuETsAAAAASUVORK5CYII=";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static previousLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMA7fci493c0MW8uJ6CZks4MxQHEZL6ewAAAFZJREFUOMvdkskRgDAMA4lDwg2B7b9XOlge/KKvdsa25KFb5XlRvxXC/DNBEv8IFNjBgGdDgXtFgTyhwDXiQAUHCvwa4Uv6mR6UR+1led2mVonvl+tML45qCQNQLIx7AAAAAElFTkSuQmCC";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static nextLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMA7fci493c0MW8uJ6CZks4MxQHEZL6ewAAAFRJREFUOMvd0skRgCAQBVEFwQ0V7fxzNQP6wI05v6pZ/kyj1b7FNgik2gQzzLcAwiUAigHOTwDHK4A1CmB5BJANJG1hQ9qafYcqFlZP3IFc9eVGrR+iIgkDQRUXIAAAAABJRU5ErkJggg==";

  /**
   * Specifies the image to be used for the refresh button.
   */
  static refreshLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAolBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8ELnaCAAAANXRSTlMABfyE2QKU+dfNyyDyoVYKwnTv7N+6rntsYlFNQjEqEw316uSzf2c1JB3GvqebiVw6GAjQB4DQr10AAAE7SURBVDjLvZLXcoMwEABPIgRCx3TT3A3udqL//7UgAdGRcR4yk8k+idsdmgS/QyWEqD/axS2JDV33zlnzLHIzQ2MDq9OeJ3m8l76KKENYlxrmM/b65Ys1+8YxnTEZFIEY0vVhszFWfUGZDJpQTDznTgAe5k4XhQxILB7ruzBQn+kkyDXuHfRtjoYDEvH7J9Lz98dBZXXL94X0Ofco2PFlChKbjVzEdakoSlKjoNoqPYkJ/wUZAYwc+PpLj1Ei7+jdoBWlwQZoJv2H1w3CWgRvo7dd9DP5btgwCWz0M02+oVoxCcIWeY9PNmR6B++m9prMxYEISpCBYBlfy9bc745is7UUULAem1Ww7FfalsiA2uaJsgmWP3pQI9q9/yMLkaaHAp2fxhHff/cNq7dBdHXhGW7l+Mo2zU0Cf8knJ2xA0oJ8enwAAAAASUVORK5CYII=";

  /**
   * Specifies the image to be used for the back button.
   */
  static backLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAclBMVEUAAAD////////////////+/v7////////////////////////////////////////////+/v7///////////////////////////////////////////////////////////////////////////////8vKLfTAAAAJXRSTlMACh7h9gby3NLIwzwZ55uVJgH57b+8tbCljYV1RRMQ46FrTzQw+vtxOQAAAJ5JREFUOMuF00cWgzAQA1DRDQFCbwFSdf8rZpdVrNH2z3tuMv7mldZQ2WN2yi8x+TT8JvyTkqvwpiKvwsOIrA1fWr+XGTklfj8dOQR+D3KyUF6QufBkJN0hfCazEv6sZBRCJDUcPasGKpu1RLtYE8lkHAPBQLoTsK/SfAyRw5FjAuhCzC2MSj0gJ+66lHatgXdKboD9tfREB5m9/+3iC9jHDYvsGNcUAAAAAElFTkSuQmCC";

  /**
   * Specifies the image to be used for the back button.
   */
  static fullscreenLargeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAllBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AJcWoAAAAMXRSTlMA+wIFxPWPCIb446tnUxmsoIykgxTe29jQnpKBe2MNsZhVTR/KyLuWbFhEPjUq7L9z+bQj+gAAAWxJREFUOMttk4l2gkAMRTODCO4FtQgIbnWpS9v8/881iZFh8R51NO8GJ+gAjMN8zuTRFSw04cIOHQcqFHH6oaQFGxf0jeBjEgB8Y52TpW9Ag4zB5QICWOtHrgwGuFZBcw+gPP0MFS7+iiD5inOmDIQS9sZgTwUzwEzyxhxHVEEU7NdDUXsqUPtqjIgR2IZSCT4upzSeIeOdcMHnfDsx3giPoezfU6MrQGB5//SckLEG2xYscK4GfnUFqaix39zrwooaOD/cXoYuvHKQIc7pzd3HVPusp6t2FAW/RmjMonbl8vwHDeZo/GkleJC7e+p5XA/rAq1X/V10wKag04rBpa2/d0LL4OYYceOEtsG5jyMntI1wS+N1BGcQBl/CoLoPOl9ABrW/BP53e1bwSJHHlkIVchJwmHwyyfJ4kIvEnKtwkxNSEct83KSChT7WiWgDZ3ccZ0BM4tloJow2YUAtifNT3njnyD+y/pMsnP4DN3Y4yl1Gyk0AAAAASUVORK5CYII=";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static ctrlKey = mxClient.IS_MAC ? "Cmd" : "Ctrl";

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  static hintOffset = 20;

  /**
   * Specifies if the diagram should be saved automatically if possible. Default
   * is true.
   */
  static popupsAllowed = true;

  /**
   * Stores initial state of mxClient.NO_FO.
   */
  originalNoForeignObject: any = mxClient.NO_FO;

  /**
   * Specifies the image URL to be used for the transparent background.
   */
  transparentImage: string = mxClient.IS_SVG
    ? "data:image/gif;base64,R0lGODlhMAAwAIAAAP///wAAACH5BAEAAAAALAAAAAAwADAAAAIxhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8egpAAA7"
    : IMAGE_PATH + "/transparent.gif";

  /**
   * Specifies if the canvas should be extended in all directions. Default is true.
   */
  extendCanvas: boolean = true;

  /**
   * Specifies if the app should run in chromeless mode. Default is false.
   * This default is only used if the contructor argument is null.
   */
  chromeless: boolean = false;

  /**
   * Specifies the order of OK/Cancel buttons in dialogs. Default is true.
   * Cancel first is used on Macs, Windows/Confluence uses cancel last.
   */
  cancelFirst: boolean = true;

  /**
   * Specifies if the editor is enabled. Default is true.
   */
  enabled: boolean = true;

  /**
   * Contains the name which was used for the last save. Default value is null.
   */
  filename?: string;

  /**
   * Contains the current modified state of the diagram. This is false for
   * new diagrams and after the diagram was saved.
   */
  modified: boolean = false;

  /**
   * Specifies if the diagram should be saved automatically if possible. Default
   * is true.
   */
  autosave: boolean = true;

  /**
   * Specifies the top spacing for the initial page view. Default is 0.
   */
  initialTopSpacing: number = 0;

  /**
   * Specifies the app name. Default is document.title.
   */
  appName: string = document.title;

  /**
   *
   */
  editBlankUrl: string =
    window.location.protocol + "//" + window.location.host + "/";

  /**
   * Default value for the graph container overflow style.
   */
  defaultGraphOverflow: string = "hidden";

  editable: boolean;
  graph: any;
  undoManager: any;
  status: string;

  onDialogClose: any;
  dialogImg: any;
  bg: any;
  container: any;
  resizeListener: any;

  constructor(chromeless, themes, model, graph, editable) {
    // mxEventSource.call(this);
    this.chromeless = chromeless != null ? chromeless : this.chromeless;
    this.initStencilRegistry();
    this.graph = graph || this.createGraph(themes, model);
    this.editable = editable != null ? editable : !chromeless;
    this.undoManager = this.createUndoManager();
    this.status = "";
  }

  get urlParams(): any {
    return {};
  }

  getOrCreateFilename() {
    return (
      this.filename || mxResources.get("drawing", [Editor.pageCounter]) + ".xml"
    );
  }

  getFilename() {
    return this.filename;
  }

  // Sets the status and fires a statusChanged event
  setStatus(value) {
    this.status = value;
    this.dispatch("statusChanged");
  }

  dispatch(_event) {
    // this.fireEvent(new mxEventObject('statusChanged'));
  }

  // Returns the current status
  getStatus() {
    return this.status;
  }

  // Updates modified state if graph changes
  graphChangeListener(_sender, eventObject) {
    var edit = eventObject != null ? eventObject.getProperty("edit") : null;

    if (edit == null || !edit.ignoreEdit) {
      this.setModified(true);
    }
  }

  addChangeListener() {
    const model = this.graph.getModel();
    model.addListener(mxEvent.CHANGE, () => {
      model.graphChangeListener.apply(this, arguments);
    });

    // Sets persistent graph state defaults
    this.graph.resetViewOnRootChange = false;
    this.init();
  }

  // Cross-domain window access is not allowed in FF, so if we
  // were opened from another domain then this will fail.
  setup() {
    try {
      var op: any = window;

      while (
        op.opener != null &&
        typeof op.opener.Editor !== "undefined" &&
        !isNaN(op.opener.Editor.pageCounter) &&
        // Workaround for possible infinite loop in FF https://drawio.atlassian.net/browse/DS-795
        op.opener != op
      ) {
        op = op.opener;
      }

      // Increments the counter in the first opener in the chain
      if (op != null) {
        op.Editor.pageCounter++;
        Editor.pageCounter = op.Editor.pageCounter;
      }
    } catch (e) {
      // ignore
    }
  }

  /**
   * Initializes the environment.
   */
  init() {}

  /**
   * Sets the XML node for the current diagram.
   */
  isChromelessView() {
    return this.chromeless;
  }

  /**
   * Sets the XML node for the current diagram.
   */
  setAutosave(value) {
    this.autosave = value;
    this.dispatch("autosaveChanged");
    // this.fireEvent(new mxEventObject('autosaveChanged'));
  }

  /**
   *
   */
  getEditBlankUrl(params) {
    return this.editBlankUrl + params;
  }

  /**
   *
   */
  editAsNew(xml, title) {
    const { urlParams } = this;
    var p = title != null ? "?title=" + encodeURIComponent(title) : "";

    if (urlParams["ui"] != null) {
      p += (p.length > 0 ? "&" : "?") + "ui=" + urlParams["ui"];
    }

    if (
      typeof window.postMessage !== "undefined" &&
      (this.documentMode == null || this.documentMode >= 10)
    ) {
      var wnd: any = null;

      var l = (evt) => {
        if (evt.data == "ready" && evt.source == wnd) {
          mxEvent.removeListener(window, "message", l);
          wnd.postMessage(xml, "*");
        }
      };

      mxEvent.addListener(window, "message", l);
      wnd = this.graph.openLink(
        this.getEditBlankUrl(p + (p.length > 0 ? "&" : "?") + "client=1"),
        null,
        true
      );
    } else {
      this.graph.openLink(
        this.getEditBlankUrl(p) + "#R" + encodeURIComponent(xml)
      );
    }
  }

  /**
   * Sets the XML node for the current diagram.
   */
  createGraph(themes, model) {
    var graph = new Graph(null, model, null, null, themes);
    graph.transparentBackground = false;

    // Opens all links in a new window while editing
    if (!this.chromeless) {
      graph.isBlankLink = function (href) {
        return !this.isExternalProtocol(href);
      };
    }
    return graph;
  }

  /**
   * Sets the XML node for the current diagram.
   */
  resetGraph() {
    const { urlParams } = this;
    this.graph.gridEnabled =
      !this.isChromelessView() || urlParams["grid"] == "1";
    this.graph.graphHandler.guidesEnabled = true;
    this.graph.setTooltips(true);
    this.graph.setConnectable(true);
    this.graph.foldingEnabled = true;
    this.graph.scrollbars = this.graph.defaultScrollbars;
    this.graph.pageVisible = this.graph.defaultPageVisible;
    this.graph.pageBreaksVisible = this.graph.pageVisible;
    this.graph.preferPageSize = this.graph.pageBreaksVisible;
    this.graph.background = null;
    this.graph.pageScale = mxGraph.prototype.pageScale;
    this.graph.pageFormat = mxGraph.prototype.pageFormat;
    this.graph.currentScale = 1;
    this.graph.currentTranslate.x = 0;
    this.graph.currentTranslate.y = 0;
    this.updateGraphComponents();
    this.graph.view.setScale(1);
  }

  /**
   * Sets the XML node for the current diagram.
   */
  readGraphState(node) {
    const { urlParams } = this;
    this.graph.gridEnabled =
      node.getAttribute("grid") != "0" &&
      (!this.isChromelessView() || urlParams["grid"] == "1");
    this.graph.gridSize =
      parseFloat(node.getAttribute("gridSize")) || mxGraph.prototype.gridSize;
    this.graph.graphHandler.guidesEnabled = node.getAttribute("guides") != "0";
    this.graph.setTooltips(node.getAttribute("tooltips") != "0");
    this.graph.setConnectable(node.getAttribute("connect") != "0");
    this.graph.connectionArrowsEnabled = node.getAttribute("arrows") != "0";
    this.graph.foldingEnabled = node.getAttribute("fold") != "0";

    if (this.isChromelessView() && this.graph.foldingEnabled) {
      this.graph.foldingEnabled = urlParams["nav"] == "1";
      this.graph.cellRenderer.forceControlClickHandler = this.graph.foldingEnabled;
    }

    var ps = parseFloat(node.getAttribute("pageScale"));

    if (!isNaN(ps) && ps > 0) {
      this.graph.pageScale = ps;
    } else {
      this.graph.pageScale = mxGraph.prototype.pageScale;
    }

    if (!this.graph.isLightboxView() && !this.graph.isViewer()) {
      var pv = node.getAttribute("page");

      if (pv != null) {
        this.graph.pageVisible = pv != "0";
      } else {
        this.graph.pageVisible = this.graph.defaultPageVisible;
      }
    } else {
      this.graph.pageVisible = false;
    }

    this.graph.pageBreaksVisible = this.graph.pageVisible;
    this.graph.preferPageSize = this.graph.pageBreaksVisible;

    var pw = parseFloat(node.getAttribute("pageWidth"));
    var ph = parseFloat(node.getAttribute("pageHeight"));

    if (!isNaN(pw) && !isNaN(ph)) {
      this.graph.pageFormat = new mxRectangle(0, 0, pw, ph);
    }

    // Loads the persistent state settings
    var bg = node.getAttribute("background");

    if (bg != null && bg.length > 0) {
      this.graph.background = bg;
    } else {
      this.graph.background = null;
    }
  }

  /**
   * Sets the XML node for the current diagram.
   */
  setGraphXml(node) {
    if (node != null) {
      var dec = new mxCodec(node.ownerDocument);

      if (node.nodeName == "mxGraphModel") {
        this.graph.model.beginUpdate();

        try {
          this.graph.model.clear();
          this.graph.view.scale = 1;
          this.readGraphState(node);
          this.updateGraphComponents();
          dec.decode(node, this.graph.getModel());
        } finally {
          this.graph.model.endUpdate();
        }

        this.fireEvent(new mxEventObject("resetGraphView"));
      } else if (node.nodeName == "root") {
        this.resetGraph();

        // Workaround for invalid XML output in Firefox 20 due to bug in mxUtils.getXml
        var wrapper = dec.document.createElement("mxGraphModel");
        wrapper.appendChild(node);

        dec.decode(wrapper, this.graph.getModel());
        this.updateGraphComponents();
        this.fireEvent(new mxEventObject("resetGraphView"));
      } else {
        throw {
          message: mxResources.get("cannotOpenFile"),
          node: node,
          toString: function () {
            return this.message;
          },
        };
      }
    } else {
      this.resetGraph();
      this.graph.model.clear();
      this.fireEvent("resetGraphView");
    }
  }

  fireEvent(_event) {
    // on mxEventSource
    // this.fireEvent(new mxEventObject('resetGraphView'));
  }

  /**
   * Returns the XML node that represents the current diagram.
   */
  getGraphXml(ignoreSelection) {
    ignoreSelection = ignoreSelection != null ? ignoreSelection : true;
    var node: any = null;

    if (ignoreSelection) {
      var enc = new mxCodec(mxUtils.createXmlDocument());
      node = enc.encode(this.graph.getModel());
    } else {
      node = this.graph.encodeCells(
        mxUtils.sortCells(
          this.graph.model.getTopmostCells(this.graph.getSelectionCells())
        )
      );
    }

    if (this.graph.view.translate.x != 0 || this.graph.view.translate.y != 0) {
      node.setAttribute(
        "dx",
        Math.round(this.graph.view.translate.x * 100) / 100
      );
      node.setAttribute(
        "dy",
        Math.round(this.graph.view.translate.y * 100) / 100
      );
    }

    node.setAttribute("grid", this.graph.isGridEnabled() ? "1" : "0");
    node.setAttribute("gridSize", this.graph.gridSize);
    node.setAttribute(
      "guides",
      this.graph.graphHandler.guidesEnabled ? "1" : "0"
    );
    node.setAttribute(
      "tooltips",
      this.graph.tooltipHandler.isEnabled() ? "1" : "0"
    );
    node.setAttribute(
      "connect",
      this.graph.connectionHandler.isEnabled() ? "1" : "0"
    );
    node.setAttribute("arrows", this.graph.connectionArrowsEnabled ? "1" : "0");
    node.setAttribute("fold", this.graph.foldingEnabled ? "1" : "0");
    node.setAttribute("page", this.graph.pageVisible ? "1" : "0");
    node.setAttribute("pageScale", this.graph.pageScale);
    node.setAttribute("pageWidth", this.graph.pageFormat.width);
    node.setAttribute("pageHeight", this.graph.pageFormat.height);

    if (this.graph.background != null) {
      node.setAttribute("background", this.graph.background);
    }

    return node;
  }

  /**
   * Keeps the graph container in sync with the persistent graph state
   */
  updateGraphComponents() {
    var graph = this.graph;

    if (graph.container != null) {
      graph.view.validateBackground();
      graph.container.style.overflow = graph.scrollbars
        ? "auto"
        : this.defaultGraphOverflow;

      this.fireEvent(new mxEventObject("updateGraphComponents"));
    }
  }

  /**
   * Sets the modified flag.
   */
  setModified(value) {
    this.modified = value;
  }

  /**
   * Sets the filename.
   */
  setFilename(value) {
    this.filename = value;
  }

  undoListener(_sender, evt) {
    this.undoMgr.undoableEditHappened(evt.getProperty("edit"));
  }

  // Installs the command history
  listener(_sender, _evt) {
    this.graph.undoListener.apply(this, arguments);
  }

  // Keeps the selection in sync with the history
  undoHandler(_sender, evt) {
    const { graph } = this;
    var cand = graph.getSelectionCellsForChanges(
      evt.getProperty("edit").changes,
      function (change) {
        // Only selects changes to the cell hierarchy
        return !(change instanceof mxChildChange);
      }
    );

    if (cand.length > 0) {
      // var model = graph.getModel();
      var cells = [];

      for (var i = 0; i < cand.length; i++) {
        const candidate = cand[i];
        if (graph.view.getState(candidate) != null) {
          this.addCell(cells, candidate);
        }
      }
      graph.setSelectionCells(cells);
    }
  }

  addCell(cells, cell) {
    cells.push(cell);
  }

  /**
   * Creates and returns a new undo manager.
   */
  createUndoManager() {
    const { undoMgr, graph, listener } = this;
    this.undoMgr = new mxUndoManager(200);

    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);

    undoMgr.addListener(mxEvent.UNDO, this.undoHandler);
    undoMgr.addListener(mxEvent.REDO, this.undoHandler);

    return undoMgr;
  }

  /**
   * Adds basic stencil set (no namespace).
   */
  initStencilRegistry() {}

  /**
   * ??????????????
   * Creates and returns a new undo manager.
   */
  destroy() {
    if (this.graph != null) {
      this.graph.destroy();
      this.graph = null;
    }
  }

  /**
   * Removes the dialog from the DOM.
   */
  getPosition(left, top) {
    return new mxPoint(left, top);
  }

  /**
   * Removes the dialog from the DOM.
   */
  close(cancel, isEsc) {
    if (this.onDialogClose) {
      if (this.onDialogClose(cancel, isEsc) == false) {
        return false;
      }

      this.onDialogClose = null;
    }

    if (this.dialogImg) {
      this.dialogImg.parentNode.removeChild(this.dialogImg);
      this.dialogImg = null;
    }

    if (this.bg && this.bg.parentNode) {
      this.bg.parentNode.removeChild(this.bg);
    }

    mxEvent.removeListener(window, "resize", this.resizeListener);
    this.container.parentNode.removeChild(this.container);
    return true;
  }
}
