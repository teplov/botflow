import Config from './config.js';

export default class Node {
    constructor (instance) {
        this.node;
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
        this.lang = window.lang;
        this.count = 0;
    }

    get length () {
        return this.count;
    }

    create(x, y, label = this.lang.nodeLabelDefault) {
        this.count++;
        const nodeEl = document.createElement("div");
        const nodeLabel = document.createElement('span');
        const nodeMarker = document.createElement('div');
        const id = jsPlumbUtil.uuid();
        nodeEl.className = "node";
        nodeEl.id = id;
        nodeLabel.innerText = label;
        nodeEl.style.left = `${x}px`;
        nodeEl.style.top = `${y}px`;
        nodeEl.appendChild(nodeLabel);

        const nodeExist = canvas.querySelectorAll('.node').length;

        // для первого узла ставим признак стартового узла
        if(!nodeExist) {
            nodeMarker.innerText = this.lang.nodeMarkerStart;
            nodeMarker.classList.add('uk-badge', 'uk-label', 'uk-position-top-right', 'uk-text-small');
            nodeEl.dataset.start = true;
            nodeEl.appendChild(nodeMarker);
            this.instance.getContainer().appendChild(nodeEl);
            this._addEndpoints(id, ['BottomCenter'], []);
        } else {
            this.instance.getContainer().appendChild(nodeEl);
            this._addEndpoints(id, ['BottomCenter'], ["TopCenter"]);
        }

        this.instance.draggable(nodeEl);
        nodeEl.addEventListener('dblclick', e => this._editLabel(e));
    }

    delete(el) {
        if (el.dataset.start) {
            alert('Нельзя удалять стартовый узел');
        } else {
            this.instance.remove(el.id);
        }
    }

    select(el) {
        if (el.parentNode.classList.contains('node')) el = el.parentNode;
        if (el.id == this.canvas.id || el.classList.contains('node')) this._deselect();
        el.classList.toggle('selected');
    }

    _deselect() {
        this.canvas.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        this.instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        this.instance.getConnections().forEach(conn => conn.setPaintStyle({ stroke:"#000", strokeWidth:3 }));
    }

    _editLabel(e) {
        e.stopPropagation();
        if (e.target.tagName == 'SPAN') {
            const label = prompt('Текст узла', e.target.innerText);
            if (label) e.target.innerText = label;
            this.instance.repaintEverything();
        }
    }

    _addEndpoints(toId, sourceAnchors, targetAnchors) {
        for (let i = 0; i < sourceAnchors.length; i++) {
            const sourceUUID = toId + sourceAnchors[i];
            this.instance.addEndpoint(toId, Config.sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID, connectionsDetachable: false });
        }
        for (let j = 0; j < targetAnchors.length; j++) {
            const targetUUID = toId + targetAnchors[j];
            this.instance.addEndpoint(toId, Config.targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID, connectionsDetachable: true });
        }
    };
}
