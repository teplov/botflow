import Config from './config.js';
import Node from './Node.js';

export default class Connector extends Node {
    constructor(instance) {
        super();
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
        this.selected = null;
    }

    create(connector, label = this.lang.connectorLabelDefault) {
        connector.connection.setLabel(label);
    }

    select(el) {
        console.log(el);
        if (this.selected && el.id != this.selected.id && el.tagName != 'path') {
            this._deselect();
        }
        if (el.connector) {
            super._deselect();
            el.setPaintStyle({ stroke:"#1e87f0", strokeWidth:3 });
            this.instance.selectEndpoints({source: el.sourceId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
            this.instance.selectEndpoints({target: el.targetId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
            this.selected = el;
        }
    }

    delete() {
        this.instance.deleteConnection(this.selected);
    }

    load(source, target, label, type) {
        const conn = this.instance.connect({ source, target });
        conn.setPaintStyle({ stroke:"#000", strokeWidth:3 });
        conn.setLabel(label);

        if (type === 'start') {
            this._addEndpoints(source, ['BottomCenter'], []);
        } else {
            this._addEndpoints(source, ['BottomCenter'], ["TopCenter"]);
        }
    }

    _deselect() {
        this.instance.getConnections().forEach(conn => conn.setPaintStyle({ stroke:"#000", strokeWidth:3 }));
        this.instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        this.selected = null;
        //super._deselect();
    }

    editLabel(connector) {
        const label = prompt('Текст саджеста', connector.getLabel());
        connector.setLabel(label);
    }

}