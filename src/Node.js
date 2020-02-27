import Config from './config.js';
import Modal from './Modal.js';

export default class Node {
    constructor(container, instance) {
        this.id = null;
        this.node = null;
        this.container = container;
        this.type = null;
        this.instance = instance;
        this.modal = new Modal();
        this.data = null;
    }

    create(id, x = 20, y = 20, data) {
        this.id = id;
        this.data = data;
        this.node = document.createElement("div");
        this.node.className = "node";
        this.node.id = this.id;
        this.node.style.left = `${x}px`;
        this.node.style.top = `${y}px`;
        this.node.dataset.id = this.id;
        this.node.dataset.type = this.type;
        this.node.classList.add('node_' + Config.labelColor[this.type], 'deselected');
        
        canvas.appendChild(this.node);
        this.node.appendChild(this._createMarker());
        //this._addEndpoints(this.node, ['BottomCenter'], ["TopCenter"]);
        
        jsp.draggable(this.node, {
            stop: () => {
                this.instance.repaintEverything();
                this.instance.Report.create();
            }
        });

        //this.node.addEventListener('click', e => this._select());
        this.node.addEventListener('dblclick', e => this.edit());
    }

    edit() {
        const modalEl = document.querySelectorAll('.uk-modal');
        !!modalEl.length && modalEl.forEach(item => item.remove());
    }

    save(data) {
        this.data = data;
        this.node.dataset.data = JSON.stringify(data);
        this.instance.Report.create();
        this.instance.repaintEverything();
    }

    mde(container) {
        this.modal.mde(container);
    }

    delete() {}
    
    export() {
        const dataStr = this.node.dataset.data;
        return JSON.parse(dataStr);
    }

    _select() {
        this._deselect();
        this.node.classList.remove('deselected');
        this.instance.addToDragSelection(this.node);
    }

    _deselect() {
        canvas.querySelectorAll('.node').forEach(el => el.classList.add('deselected'));
        this.instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        this.instance.getConnections().forEach(conn => conn.setPaintStyle({ stroke:"#000", strokeWidth:3 }));
        console.log('clear selection');
        this.instance.clearDragSelection();
        ds.clearSelection();
    }

    _createLabel(text) {
        const nodeLabel = document.createElement('span');
        nodeLabel.className = 'node_label';
        nodeLabel.innerText = text;
        return nodeLabel
    }

    _createMarker() {
        const nodeLabel = document.createElement('span');
        const nodeMarker = document.createElement('div');
        nodeMarker.title = this.type;
        nodeLabel.setAttribute('uk-icon', 'icon:' + Config.labelIcon[this.type]);
        nodeMarker.classList.add('type_label', `label_${Config.labelColor[this.type]}`);
        nodeMarker.appendChild(nodeLabel);
        return nodeMarker
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