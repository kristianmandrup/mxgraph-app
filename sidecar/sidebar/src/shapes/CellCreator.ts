import mx from 'mx'
import { SidebarEntries } from '../Entries'
import { Graph } from 'ui/graph/Graph'
const { mxPoint, mxGraphModel, mxCodec, mxUtils, mxCell, mxGeometry } = mx

export class CellCreator {
  entries: SidebarEntries
  graph: any
  sidebar: any

  constructor(entries?: any) {
    this.entries = entries || this.createEntries()
  }

  createItem(cells, title, showLabel, showTitle, width, height, allowCellsInserted?) {
    return this.sidebar.createItem(
      cells,
      title,
      showLabel,
      showTitle,
      width,
      height,
      allowCellsInserted
    )
  }

  cloneCell(cell, label) {
    this.sidebar.cloneCell(cell, label)
  }

  addEntry(tags, fn) {
    this.entries.addEntry(tags, fn)
  }

  createEntries() {
    return new SidebarEntries(this)
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  createVertexTemplateEntry(style, width, height, value, title, showLabel?, showTitle?, tags?) {
    tags = tags != null && tags.length > 0 ? tags : title != null ? title.toLowerCase() : ''

    return this.addEntry(tags, () => {
      return this.createVertexTemplate(style, width, height, value, title, showLabel, showTitle)
    })
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  createVertexTemplate(
    style,
    width,
    height,
    value,
    title,
    showLabel,
    showTitle,
    allowCellsInserted?
  ) {
    var cells = [new mxCell(value != null ? value : '', new mxGeometry(0, 0, width, height), style)]
    cells[0].vertex = true

    return this.createVertexTemplateFromCells(
      cells,
      width,
      height,
      title,
      showLabel,
      showTitle,
      allowCellsInserted
    )
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  createVertexTemplateFromData(
    data,
    width,
    height,
    title,
    showLabel,
    showTitle,
    allowCellsInserted
  ) {
    var doc = mxUtils.parseXml(Graph.decompress(data, undefined, undefined))
    var codec = new mxCodec(doc)

    var model = new mxGraphModel()
    codec.decode(doc.documentElement, model)

    var cells = this.graph.cloneCells(model.root.getChildAt(0).children)

    return this.createVertexTemplateFromCells(
      cells,
      width,
      height,
      title,
      showLabel,
      showTitle,
      allowCellsInserted
    )
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  createVertexTemplateFromCells(
    cells,
    width,
    height,
    title,
    showLabel,
    showTitle,
    allowCellsInserted
  ) {
    // Use this line to convert calls to this function with lots of boilerplate code for creating cells
    //console.trace('xml', Graph.compress(mxUtils.getXml(this.graph.encodeCells(cells))), cells);
    return this.createItem(cells, title, showLabel, showTitle, width, height, allowCellsInserted)
  }

  /**
   *
   */
  createEdgeTemplateEntry(style, width, height, value, title, showLabel, tags, allowCellsInserted) {
    tags = tags != null && tags.length > 0 ? tags : title.toLowerCase()

    return this.addEntry(tags, () => {
      return this.createEdgeTemplate(
        style,
        width,
        height,
        value,
        title,
        showLabel,
        allowCellsInserted
      )
    })
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  createEdgeTemplate(style, width, height, value, title, showLabel, allowCellsInserted) {
    var cell = new mxCell(value != null ? value : '', new mxGeometry(0, 0, width, height), style)
    cell.geometry.setTerminalPoint(new mxPoint(0, height), true)
    cell.geometry.setTerminalPoint(new mxPoint(width, 0), false)
    cell.geometry.relative = true
    cell.edge = true

    return this.createEdgeTemplateFromCells(
      [cell],
      width,
      height,
      title,
      showLabel,
      allowCellsInserted
    )
  }

  /**
   * Creates a drop handler for inserting the given cells.
   */
  createEdgeTemplateFromCells(cells, width, height, title, showLabel, allowCellsInserted) {
    return this.createItem(cells, title, showLabel, true, width, height, allowCellsInserted)
  }
}
