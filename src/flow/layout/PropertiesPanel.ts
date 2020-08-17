import Context from '@app/flow/Context';
import Indicator from '@app/flow/diagram/common/Indicator';
import Node from '@app/flow/diagram/Node';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import { textareaChange } from '@app/flow/utils/HtmlUtils';
import { UmlNodes, nodecustomProperties } from '@app/flow/diagram/uml/UmlDiagramFactory';

export default class PropertiesPanel {
  private store: Store;
  private propertiesPanel: HTMLElement;
  private propertiesPanelItems: HTMLElement;
  private propertiesPanelControl: HTMLElement;

  constructor(context: Context, propertiesPanel: HTMLElement) {
    this.store = context.store;

    this.propertiesPanel = propertiesPanel;
    this.propertiesPanelItems = propertiesPanel.querySelector('.fl-panel-items') as HTMLElement;
    this.propertiesPanelControl = this.propertiesPanel.querySelector('.fl-panel-toggler') as HTMLElement;
    this.propertiesPanelControl.onclick = this.handleToggle;

    this.store.subscribe(ACTION.SET_NODE, this.handleSetNode);
    this.store.subscribe(ACTION.ESCAPE, this.handleSetNode);
  }

  private handleToggle = () => {
    this.propertiesPanel.classList.toggle('active');
  };

  public handleSetNode = () => {
    this.hideProperties();
    const selectedShape = this.store.selectedIndicator || this.store.selectedNode;
    if (selectedShape) {
      this.displayProperties(selectedShape);
    }
  };

  private displayProperties = (shape: Indicator | Node) => {
    const panelBodyDocumentFragment = document.createDocumentFragment();

    const idLabel = this.createPropertyLabelElement('ID');
    const idValue = this.createPropertyValueElement(shape.id);
    const shapeIdElement = this.createPropertyElement([idLabel, idValue]);
    // name element start
    const id = `${performance.now()}`;
    const labelLabel = this.createPropertyLabelElement('Name', id);
    const labelTextarea = this.createPropertyNameElement(id, shape.label);
    labelTextarea.oninput = textareaChange((value) => {
      this.store.dispatch(ACTION.UPDATE_SHAPE_TEXT, { id: shape.id, text: value });
    });
    const shapeLabelElement = this.createPropertyElement([labelLabel, labelTextarea]);
    // name element end
    console.log('shape:', shape);
    // desc element start
    const desc_id = `desc_${performance.now()}`;
    const desc_labelLabel = this.createPropertyLabelElement('Description', desc_id);
    let desc = (shape.data) ? (shape.data['desc'] ? shape.data['desc'] : '') : '';
    const desc_labelTextarea = this.createPropertyTextareaElement(desc_id, desc);
    desc_labelTextarea.oninput = textareaChange((value) => {
      this.store.dispatch(ACTION.UPDATE_SHAPE_DATA, { id: shape.id, text: value, propname: 'desc' });
    });
    const shapedescElement = this.createPropertyElement([desc_labelLabel, desc_labelTextarea]);
    // desc element end
    panelBodyDocumentFragment.appendChild(shapeIdElement);
    panelBodyDocumentFragment.appendChild(shapeLabelElement);
    panelBodyDocumentFragment.appendChild(shapedescElement);
    // add custom fields
    this.addCustomProperties(shape,panelBodyDocumentFragment);

    this.propertiesPanelItems.appendChild(panelBodyDocumentFragment);
  };

  private addCustomProperties = (shape: Indicator | Node,panelBodyDocumentFragment: DocumentFragment) => {
    const selectedShape: any = this.store.selectedIndicator || this.store.selectedNode;
    if (selectedShape) {
      let nodeName: string = selectedShape.name;
      let elements:any[] = [];
      
      switch (nodeName) {
        case UmlNodes.MachineNode: {
          elements = nodecustomProperties.MachineNode;
          break;
        }
        default:
          break;
      }
      if(elements.length > 0){
        elements.forEach((item:any) => {
        
          const element_id = item.name+`_${performance.now()}`;
          const element_labelLabel = this.createPropertyLabelElement(item.label, element_id);
          let default_value = (shape.data) ? (shape.data[item.name] ? shape.data[item.name] : '') : '';
          var htmlElement :HTMLElement;
          var holderElment: HTMLElement;
          switch (item.datatype) {
            case 'text':
              htmlElement = this.createPropertyNameElement(element_id, default_value);
              htmlElement.oninput = textareaChange((value) => {
                this.store.dispatch(ACTION.UPDATE_SHAPE_DATA, { id: shape.id, text: value, propname: item.name });
              });
              const textElement = this.createPropertyElement([element_labelLabel, htmlElement]);
              panelBodyDocumentFragment.appendChild(textElement);
              break;
            case 'list' : 
            htmlElement = this.createPropertyListElement(element_id,item.listItem, default_value);
            htmlElement.oninput = textareaChange((value) => {
              this.store.dispatch(ACTION.UPDATE_SHAPE_DATA, { id: shape.id, text: value, propname: item.name });
            });
            const dropdownElement = this.createPropertyElement([element_labelLabel, htmlElement]);
            panelBodyDocumentFragment.appendChild(dropdownElement);
            break;
            default:
              break;
          }
          
      });
      
      }
    }
  }
  private createPropertyLabelElement = (label: string, attrFor?: string) => {
    const span = document.createElement('span');
    span.classList.add('fl-prop-label');
    span.innerText = label;

    if (attrFor) {
      span.setAttribute('for', attrFor);
    }

    return span;
  };

  private createPropertyValueElement = (innerText: string) => {
    const span = document.createElement('span');
    span.classList.add('fl-prop-value');
    span.innerText = innerText;

    return span;
  };
  private createPropertyNameElement = (id: string, value: string) => {
    const textarea = document.createElement('input');
    textarea.setAttribute('type', 'text');
    textarea.id = id;
    textarea.value = value;

    return textarea;
  };
  private createPropertyTextareaElement = (id: string, value: string) => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('rows', '3');
    textarea.id = id;
    textarea.value = value;

    return textarea;
  };
  private createPropertyListElement=(id: string,options:any[], value: string) => {
    const dropdown = document.createElement('select');
    for (const val of options) {
      var option = document.createElement("option");
      option.value = val.value;
      option.text = val.label;
      dropdown.appendChild(option);
    }
    dropdown.id = id;
    dropdown.value = value;

    return dropdown;
  };
  private createPropertyElement = (children: HTMLElement[]) => {
    const element = document.createElement('div');
    element.classList.add('fl-prop');
    children.forEach((it) => element.appendChild(it));

    return element;
  };

  private hideProperties = () => {
    const propertiesPanelItems = this.propertiesPanelItems;
    while (propertiesPanelItems.firstChild) {
      propertiesPanelItems.removeChild(propertiesPanelItems.firstChild);
    }
  };

  public unmount() {
    this.store.unsubscribe(ACTION.SET_NODE, this.handleSetNode);
  }
}
