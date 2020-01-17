import Config from './config.js';
import Node from './Node.js';

export default class Connector extends Node {
    constructor(instance) {
        super();
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
        // this.instance.registerConnectionTypes({
        //     "default": { paintStyle: Config.connectorPaintStyle },
        //   });
    }

    create(connector, label = this.lang.connectorLabelDefault) {
        connector.connection.setLabel(label);
    }

    select(connector) {
        //console.log(connector);
        this._deselect();
        connector.setPaintStyle({ stroke:"#1e87f0", strokeWidth:3 });
        this.instance.selectEndpoints({source: connector.sourceId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
        this.instance.selectEndpoints({target: connector.targetId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
    }

    delete() {

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
        //this.canvas.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        super._deselect();
    }

    editLabel(connector) {
        const label = prompt('Текст саджеста', connector.getLabel());
        connector.setLabel(label);
    }

}