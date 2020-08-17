import Rhombus from '@app/flow/geometry/Rhombus';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { createMachinePath2D } from '@app/flow/utils/Path2DUtils';


export default class CanvasMachine extends CanvasShape {
  protected params: Rhombus;
  protected style: ShapeStyle;
  protected path2d: Path2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, style: ShapeStyle, params: Rhombus) {
    super(canvas, htmlLayer);
    this.params = { ...params };
    this.style = style;
    this.path2d = createMachinePath2D(this.params);
  }

  public move(dx: number, dy: number) {
    this.params.x += dx;
    this.params.y += dy;

    this.path2d = createMachinePath2D(this.params);
  }
}
