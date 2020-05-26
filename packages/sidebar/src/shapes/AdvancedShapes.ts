import mx from "@mxgraph-app/mx";
const { mxCell, mxGeometry } = mx;
import { AbstractShaper } from "./AbstractShaper";

export class AdvancedShapes extends AbstractShaper {
  /**
   * Adds the container palette to the sidebar.
   */
  createAdvancedShapes() {
    // Avoids having to bind all functions to "this"
    var sb: any = this;

    // Reusable cells
    var field = new mxCell(
      "List Item",
      new mxGeometry(0, 0, 60, 26),
      "text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;"
    );
    field.vertex = true;

    return [
      this.createVertexTemplateEntry(
        "shape=tapeData;whiteSpace=wrap;html=1;perimeter=ellipsePerimeter;",
        80,
        80,
        "",
        "Tape Data"
      ),
      this.createVertexTemplateEntry(
        "shape=manualInput;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Manual Input"
      ),
      this.createVertexTemplateEntry(
        "shape=loopLimit;whiteSpace=wrap;html=1;",
        100,
        80,
        "",
        "Loop Limit"
      ),
      this.createVertexTemplateEntry(
        "shape=offPageConnector;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Off Page Connector"
      ),
      this.createVertexTemplateEntry(
        "shape=delay;whiteSpace=wrap;html=1;",
        80,
        40,
        "",
        "Delay"
      ),
      this.createVertexTemplateEntry(
        "shape=display;whiteSpace=wrap;html=1;",
        80,
        40,
        "",
        "Display"
      ),
      this.createVertexTemplateEntry(
        "shape=singleArrow;direction=west;whiteSpace=wrap;html=1;",
        100,
        60,
        "",
        "Arrow Left"
      ),
      this.createVertexTemplateEntry(
        "shape=singleArrow;whiteSpace=wrap;html=1;",
        100,
        60,
        "",
        "Arrow Right"
      ),
      this.createVertexTemplateEntry(
        "shape=singleArrow;direction=north;whiteSpace=wrap;html=1;",
        60,
        100,
        "",
        "Arrow Up"
      ),
      this.createVertexTemplateEntry(
        "shape=singleArrow;direction=south;whiteSpace=wrap;html=1;",
        60,
        100,
        "",
        "Arrow Down"
      ),
      this.createVertexTemplateEntry(
        "shape=doubleArrow;whiteSpace=wrap;html=1;",
        100,
        60,
        "",
        "Double Arrow"
      ),
      this.createVertexTemplateEntry(
        "shape=doubleArrow;direction=south;whiteSpace=wrap;html=1;",
        60,
        100,
        "",
        "Double Arrow Vertical",
        null,
        null,
        "double arrow"
      ),
      this.createVertexTemplateEntry(
        "shape=actor;whiteSpace=wrap;html=1;",
        40,
        60,
        "",
        "User",
        null,
        null,
        "user person human"
      ),
      this.createVertexTemplateEntry(
        "shape=cross;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Cross"
      ),
      this.createVertexTemplateEntry(
        "shape=corner;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Corner"
      ),
      this.createVertexTemplateEntry(
        "shape=tee;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Tee"
      ),
      this.createVertexTemplateEntry(
        "shape=datastore;whiteSpace=wrap;html=1;",
        60,
        60,
        "",
        "Data Store",
        null,
        null,
        "data store cylinder database"
      ),
      this.createVertexTemplateEntry(
        "shape=orEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;",
        80,
        80,
        "",
        "Or",
        null,
        null,
        "or circle oval ellipse"
      ),
      this.createVertexTemplateEntry(
        "shape=sumEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;",
        80,
        80,
        "",
        "Sum",
        null,
        null,
        "sum circle oval ellipse"
      ),
      this.createVertexTemplateEntry(
        "shape=lineEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;",
        80,
        80,
        "",
        "Ellipse with horizontal divider",
        null,
        null,
        "circle oval ellipse"
      ),
      this.createVertexTemplateEntry(
        "shape=lineEllipse;line=vertical;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;backgroundOutline=1;",
        80,
        80,
        "",
        "Ellipse with vertical divider",
        null,
        null,
        "circle oval ellipse"
      ),
      this.createVertexTemplateEntry(
        "shape=sortShape;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Sort",
        null,
        null,
        "sort"
      ),
      this.createVertexTemplateEntry(
        "shape=collate;whiteSpace=wrap;html=1;",
        80,
        80,
        "",
        "Collate",
        null,
        null,
        "collate"
      ),
      this.createVertexTemplateEntry(
        "shape=switch;whiteSpace=wrap;html=1;",
        60,
        60,
        "",
        "Switch",
        null,
        null,
        "switch router"
      ),
      this.addEntry("process bar", function () {
        return sb.createVertexTemplateFromData(
          "zZXRaoMwFIafJpcDjbNrb2233rRQ8AkyPdPQaCRJV+3T7yTG2rUVBoOtgpDzn/xJzncCIdGyateKNeVW5iBI9EqipZLS9KOqXYIQhAY8J9GKUBrgT+jbRDZ02aBhCmrzEwPtDZ9MHKBXdkpmoDWKCVN9VptO+Kw+8kqwGqMkK7nIN6yTB7uTNizbD1FSSsVPsjYMC1qFKHxwIZZSSIVxLZ1/nJNar5+oQPMT7IYCrqUta1ENzuqGaeOFTArBGs3f3Vmtoo2Se7ja1h00kSoHK4bBIKUNy3hdoPYU0mF91i9mT8EEL2ocZ3gKa00ayWujLZY4IfHKFonVDLsRGgXuQ90zBmWgneyTk3yT1iArMKrDKUeem9L3ajHrbSXwohxsQd/ggOleKM7ese048J2/fwuim1uQGmhQCW8vQMkacP3GCQgBFMftHEsr7cYYe95CnmKTPMFbYD8CQ++DGQy+/M5X4ku5wHYmdIktfvk9tecpavThqS3m/0YtnqIWPTy1cD77K2wYjo+Ay317I74A",
          296,
          100,
          "Process Bar"
        );
      }),
      this.createVertexTemplateEntry(
        "swimlane;",
        200,
        200,
        "Container",
        "Container",
        null,
        null,
        "container swimlane lane pool group"
      ),
      this.addEntry("list group erd table", function () {
        var cell = new mxCell(
          "List",
          new mxGeometry(0, 0, 140, 110),
          "swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;" +
            "resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;"
        );
        cell.vertex = true;
        cell.insert(sb.cloneCell(field, "Item 1"));
        cell.insert(sb.cloneCell(field, "Item 2"));
        cell.insert(sb.cloneCell(field, "Item 3"));

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          "List"
        );
      }),
      this.addEntry("list item entry value group erd table", function () {
        return sb.createVertexTemplateFromCells(
          [sb.cloneCell(field, "List Item")],
          field.geometry.width,
          field.geometry.height,
          "List Item"
        );
      }),
    ];
  }
}
