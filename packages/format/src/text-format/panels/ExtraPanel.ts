export class ExtraPanel {
  create() {
    var extraPanel = this.createPanel();
    extraPanel.style.paddingTop = "2px";
    extraPanel.style.paddingBottom = "4px";

    // LATER: Fix toggle using '' instead of 'null'
    var wwOpt = this.createCellOption(
      mxResources.get("wordWrap"),
      mxConstants.STYLE_WHITE_SPACE,
      null,
      "wrap",
      "null",
      null,
      null,
      true
    );
    wwOpt.style.fontWeight = "bold";

    // Word wrap in edge labels only supported via labelWidth style
    if (!ss.containsLabel && !ss.autoSize && ss.edges.length == 0) {
      extraPanel.appendChild(wwOpt);
    }

    // Delegates switch of style to formattedText action as it also convertes newlines
    var htmlOpt = this.createCellOption(
      mxResources.get("formattedText"),
      "html",
      "0",
      null,
      null,
      null,
      ui.actions.get("formattedText")
    );
    htmlOpt.style.fontWeight = "bold";
    extraPanel.appendChild(htmlOpt);
    return extraPanel;
  }
}
