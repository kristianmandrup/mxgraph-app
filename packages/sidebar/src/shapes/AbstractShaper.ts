import { CellCreator } from "./CellCreator";

export class AbstractShaper {
  cellCreator: CellCreator;

  constructor(cellCreator?) {
    this.cellCreator = cellCreator || this.createCellCreator();
  }

  createCellCreator() {
    return new CellCreator();
  }

  addEntry(tags, fn?) {
    return this.cellCreator.addEntry(tags, fn);
  }

  cloneCell(cell, label): any {
    return this.cellCreator.cloneCell(cell, label);
  }

  createEdgeTemplateFromCells(
    cells,
    width,
    height,
    title,
    showLabel?,
    allowCellsInserted?,
  ) {
    return this.cellCreator.createEdgeTemplateFromCells(
      cells,
      width,
      height,
      title,
      showLabel,
      allowCellsInserted,
    );
  }

  createEdgeTemplateEntry(
    style,
    width,
    height,
    value,
    title,
    showLabel?,
    tags?,
    allowCellsInserted?,
  ) {
    return this.cellCreator.createEdgeTemplateEntry(
      style,
      width,
      height,
      value,
      title,
      showLabel,
      tags,
      allowCellsInserted,
    );
  }

  createVertexTemplateFromCells(
    cells,
    width,
    height,
    title,
    showLabel?,
    showTitle?,
    allowCellsInserted?,
  ) {
    return this.cellCreator.createVertexTemplateFromCells(
      cells,
      width,
      height,
      title,
      showLabel,
      showTitle,
      allowCellsInserted,
    );
  }

  createVertexTemplateFromData(
    data,
    width,
    height,
    title,
    showLabel?,
    showTitle?,
    allowCellsInserted?,
  ) {
    return this.cellCreator.createVertexTemplateFromData(
      data,
      width,
      height,
      title,
      showLabel,
      showTitle,
      allowCellsInserted,
    );
  }

  createVertexTemplateEntry(
    style,
    width,
    height,
    value,
    title,
    showLabel?,
    showTitle?,
    tags?,
  ) {
    return this.cellCreator.createVertexTemplateEntry(
      style,
      width,
      height,
      value,
      title,
      showLabel,
      showTitle,
      tags,
    );
  }

  createVertexTemplate(
    style,
    width,
    height,
    value,
    title,
    showLabel?,
    showTitle?,
    allowCellsInserted?,
  ) {
    return this.cellCreator.createVertexTemplate(
      style,
      width,
      height,
      value,
      title,
      showLabel,
      showTitle,
      allowCellsInserted,
    );
  }
}
