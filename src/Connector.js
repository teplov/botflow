import Config from './config.js';
import Canvas from './Canvas.js';
import Modal from './Modal.js';

export default class Connector extends Canvas {
    constructor(instance) {
        super();
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
        this.selected = null;
        this.modal = new Modal();
        //console.log(this.modal.menu);
    }

    create(connector, label = this.lang.connectorLabelDefault) {
        connector.connection.setLabel(label);
    }

    select(el) {
        // console.log(el);
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
       
        // UIkit.modal.prompt('Suggest label:', connector.getLabel()).then((label) => {
        //     console.log('Prompted:', label)
        //     connector.setLabel(label);
        //     this.instance.Report.create();
        // });

        //this.modal.open(connector.getLabel());
    }

    _addEndpoints(toId, sourceAnchors, targetAnchors) {
        for (let i = 0; i < sourceAnchors.length; i++) {
            const sourceUUID = toId + sourceAnchors[i];
            jsp.addEndpoint(toId, Config.sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID, isSource: true, connectionsDetachable: false });
        }
        for (let j = 0; j < targetAnchors.length; j++) {
            const targetUUID = toId + targetAnchors[j];
            jsp.addEndpoint(toId, Config.targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID, isTarget: true, connectionsDetachable: true });
        }
    };

}