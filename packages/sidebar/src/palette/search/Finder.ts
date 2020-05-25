import mx from "@mxgraph-app/mx";
import { SearchPalette } from "./SearchPalette";
const { mxResources } = mx;

export class Finder extends SearchPalette {
  page = 0;
  hash = new Object();

  // Count is dynamically updated below
  count =
    4 *
    Math.max(
      1,
      Math.floor(this.container.clientWidth / (this.thumbWidth + 10))
    );

  constructor() {
    super();
  }

  find = () => {
    const {
      input,
      center,
      button,
      div,
      active,
      complete,
      searchTerm,
      count,
      page,
      hash,
      clearDiv,
    } = this;
    // Shows 4 rows (minimum 4 results)
    this.hideTooltip();

    if (input.value != "") {
      if (center.parentNode != null) {
        if (searchTerm != input.value) {
          clearDiv();
          this.searchTerm = input.value;
          this.hash = new Object();
          this.complete = false;
          this.page = 0;
        }

        if (!active && !complete) {
          button.setAttribute("disabled", "true");
          button.style.display = "";
          button.style.cursor = "wait";
          button.innerHTML = mxResources.get("loading") + "...";
          this.active = true;

          // Ignores old results
          var current = new Object();
          this.currentSearch = current;

          this.searchEntries(
            searchTerm,
            count,
            page,
            (results, len, more, terms) => {
              if (this.currentSearch == current) {
                results = results != null ? results : [];
                this.active = false;
                this.page++;
                this.insertSearchHint(
                  div,
                  searchTerm,
                  count,
                  page,
                  results,
                  len,
                  more,
                  terms
                );

                // Allows to repeat the search
                if (results.length == 0 && page == 1) {
                  this.searchTerm = "";
                }

                if (center.parentNode != null) {
                  center.parentNode.removeChild(center);
                }

                for (var i = 0; i < results.length; i++) {
                  try {
                    var elt = results[i]();

                    // Avoids duplicates in results
                    if (hash[elt.innerHTML] == null) {
                      hash[elt.innerHTML] = "1";
                      div.appendChild(elt);
                    }
                  } catch (e) {
                    // ignore
                  }
                }

                if (more) {
                  button.removeAttribute("disabled");
                  button.innerHTML = mxResources.get("moreResults");
                } else {
                  button.innerHTML = mxResources.get("reset");
                  button.style.display = "none";
                  this.complete = true;
                }

                button.style.cursor = "";
                div.appendChild(center);
              }
            },
            () => {
              // TODO: Error handling
              button.style.cursor = "";
            }
          );
        }
      }
    } else {
      clearDiv();
      input.value = "";
      this.searchTerm = "";
      this.hash = new Object();
      button.style.display = "none";
      this.complete = false;
      input.focus();
    }
  };
}
