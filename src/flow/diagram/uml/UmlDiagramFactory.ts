import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator, { IndicatorParams } from '@app/flow/diagram/common/Indicator';
import DirectionalLink from '@app/flow/diagram/common/link/DirectionalLink';
import DiagramFactory from '@app/flow/diagram/DiagramFactory';
import ActivityNode from '@app/flow/diagram/uml/node/ActivityNode';
import DecisionNode from '@app/flow/diagram/uml/node/DecisionNode';
import EndNode from '@app/flow/diagram/uml/node/EndNode';
import HorizontalForkJoinNode from '@app/flow/diagram/uml/node/HorizontalForkJoinNode';
import StartNode from '@app/flow/diagram/uml/node/StartNode';
import TextNode from '@app/flow/diagram/uml/node/TextNode';
import VerticalForkJoinNode from '@app/flow/diagram/uml/node/VerticalForkJoinNode';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import MachineNode from './node/machine/MachineNode';
import MessageNode from './node/message/MessageNode';

export enum UmlNodes {
  ActivityNode = 'ActivityNode',
  DecisionNode = 'DecisionNode',
  EndNode = 'EndNode',
  HorizontalForkJoinNode = 'HorizontalForkJoinNode',
  StartNode = 'StartNode',
  TextNode = 'TextNode',
  VerticalForkJoinNode = 'VerticalForkJoinNode',
  MachineNode = 'MachineNode',
  MessageNode = 'MessageNode',
}
export const nodecustomProperties ={
  MachineNode: [
  {
    name : 'OperatingSystem',
    label : 'Operating System',
    datatype : 'list',
    listItem : [
      { 
        label : 'Windows',
      value : 'windows'
      },
      { 
        label : 'Linux',
      value : 'linux'
      }
    ]
  }
]
};
export default class UmlDiagramFactory implements DiagramFactory {
  private canvas: HTMLCanvasElement;
  private htmlLayer: HTMLElement;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
  }

  public getAnchorPoint(point: CoordinatePoint) {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    return new AnchorPoint(ctx, point)
  }

  public getLink(points: AnchorPoint[]) {
    return new DirectionalLink(this.canvas, this.htmlLayer, points, points.length === 2);
  }

  public getIndicator(params: IndicatorParams) {
    return new Indicator(this.canvas, this.htmlLayer, params);
  }

  public getNode(nodeName: string, nodeParams: any) {
    let node = null;
    switch (nodeName) {
      case UmlNodes.ActivityNode: {
        node = new ActivityNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.DecisionNode: {
        node = new DecisionNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.EndNode: {
        node = new EndNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.HorizontalForkJoinNode: {
        node = new HorizontalForkJoinNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.StartNode: {
        node = new StartNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.TextNode: {
        const textParams = { placeholder: 'Text', text: '', ...nodeParams };
        node = new TextNode(this.canvas, this.htmlLayer, textParams);
        break;
      }
      case UmlNodes.VerticalForkJoinNode: {
        node = new VerticalForkJoinNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.MachineNode: {
        node = new MachineNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      case UmlNodes.MessageNode: {
        node = new MessageNode(this.canvas, this.htmlLayer, nodeParams);
        break;
      }
      default: {
        break;
      }
    }

    return node;
  }
 
}
