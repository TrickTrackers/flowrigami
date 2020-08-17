import { SHAPE_SELECTION_STYLE } from '@app/flow/DefaultTheme';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Node from '@app/flow/diagram/Node';
import NodeParams from '@app/flow/diagram/NodeParams';
import {
  ACTIVITY_LABEL_STYLE,
  getAnchorPoints,
  getPreviewMessageShapeParams,
  getMessageShapeParams,
  getSelectionMessageShapeParams,
  getTextParams,
  previewStyles,
  styles,
} from '@app/flow/diagram/uml/node/message/MessageNodeConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasText from '@app/flow/graphics/canvas/CanvasText';
import CanvasMessage from '@app/flow/graphics/canvas/shapes/CanvasMessage';
import Store from '@app/flow/store/Store';


export default class MessageNode extends Node {
  public name = UmlNodes.MessageNode;
  public get label() { return super.label; }
  public set label(label: string) {
    super.label = label;
    this.textEditor.text = this.label;
  }

  private messageshape: CanvasMessage;
  private selection: CanvasMessage;
  private preview: CanvasMessage;

  private textEditor: CanvasText;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: NodeParams) {
    super(canvas, htmlLayer, params);

    this.messageshape = new CanvasMessage(canvas, htmlLayer, styles, getMessageShapeParams(params));
    this.selection = new CanvasMessage(canvas, htmlLayer, SHAPE_SELECTION_STYLE, getSelectionMessageShapeParams(params));
    this.preview = new CanvasMessage(canvas, htmlLayer, previewStyles, getPreviewMessageShapeParams(params));

    this.textEditor = new CanvasText(canvas, htmlLayer, getTextParams(params), ACTIVITY_LABEL_STYLE);

    const [top, right, bottom, left] = getAnchorPoints(params);
    this.createConnectionPoints([
      new AnchorPoint(this.ctx, top, AnchorPoint.Orientation.Top),
      new AnchorPoint(this.ctx, right, AnchorPoint.Orientation.Right),
      new AnchorPoint(this.ctx, bottom, AnchorPoint.Orientation.Bottom),
      new AnchorPoint(this.ctx, left, AnchorPoint.Orientation.Left),
    ]);
  }

  public draw() {
    this.messageshape.isActive = this.isActive;
    this.messageshape.isHover = this.isHover;

    this.messageshape.draw();
    if (this.isActive) {
      this.selection.draw();
    }

    if (!this.isEditing) {
      this.textEditor.isActive = this.isActive;
      this.textEditor.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(x: number, y: number) {
    const isInmessageshape = this.messageshape.includes(x, y);
    const isInConnectionPoint = !!this.getConnectionPoint({ x, y });

    return isInmessageshape || isInConnectionPoint;
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    this.messageshape.move(dx, dy);
    this.selection.move(dx, dy);
    this.textEditor.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textEditor.renderHtml(parent, store, this.id, this.isEditing);
  }

  public drawPreview() {
    this.preview.isHover = this.isHover;
    this.preview.draw();
  }

  public previewIncludes(coordinates: CoordinatePoint) {
    return this.preview.includes(coordinates.x, coordinates.y);
  }
}
