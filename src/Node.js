import Config from './config.js';

export default class Node {
    constructor (instance) {
        this.node;
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
        this.lang = window.lang;
        this.count = 0;
        this._editLabelData = '';
    }

    get length () {
        return this.count;
    }

    create(x, y, label = this.lang.nodeLabelDefault) {
        const id = jsPlumbUtil.uuid();
        const nodeExist = canvas.querySelectorAll('.node').length;
        let type = 'start';
        if (nodeExist) type = 'step';
        this._createNode(id, x, y, label, type);
    }

    load(id, label, type, x = 20, y = 20) {
        this._createNode(id, x, y, label, type);
    }

    delete(el) {
        if (el.dataset.start) {
            alert('Нельзя удалять стартовый узел');
        } else {
            this.instance.remove(el.id);
            this.count--;
        }
    }

    select(el) {
        if (el.parentNode.classList.contains('node')) el = el.parentNode;
        if (el.id == this.canvas.id || el.classList.contains('node')) this._deselect();
        el.classList.toggle('selected');
    }

    _createNode(id, x, y, label, marker) {
        const nodeEl = document.createElement("div");
        nodeEl.className = "node";
        nodeEl.id = id;
        nodeEl.style.left = `${x}px`;
        nodeEl.style.top = `${y}px`;
        nodeEl.appendChild(this._createLabel(label));

        if (marker === 'start') {
            nodeEl.dataset.start = true;
            const nodeMarker = this._createMarker(this.lang.nodeMarkerStart);
            nodeEl.appendChild(nodeMarker);
        } 
        this.instance.getContainer().appendChild(nodeEl);
        this._addEndpoints(id, ['BottomCenter'], ["TopCenter"]);

        // обновляем report если произошло перемещение node
        this.instance.draggable(nodeEl, {
            stop: () => this.instance.Report.create()
        });
        nodeEl.addEventListener('dblclick', e => this._editLabel(e));
        return nodeEl
    }

    _createLabel(text) {
        const nodeLabel = document.createElement('span');
        nodeLabel.innerText = text;
        return nodeLabel
    }

    _createMarker(text = this.lang.nodeMarkerStart) {
        const nodeMarker = document.createElement('div');
        nodeMarker.innerText = text;
        nodeMarker.classList.add('uk-badge', 'uk-label', 'uk-position-top-right', 'uk-text-small');
        return nodeMarker
    }

    _deselect() {
        this.canvas.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        this.instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        this.instance.getConnections().forEach(conn => conn.setPaintStyle({ stroke:"#000", strokeWidth:3 }));
    }

    _editLabel(e) {
        let element = e.target;
            e.preventDefault();
            e.target.blur();

            const modal = UIkit.modal.dialog(`<button class="uk-modal-close-default" type="button" uk-close></button>
            <div class="uk-modal-body uk-padding-remove">
                <textarea id="mde" style="display: none">${element.innerText}</textarea>
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button class="uk-button uk-button-primary" id="editor_save" type="button">Save</button>
            </div>`);

            UIkit.util.on(modal.$el, 'shown', (e) => {
                window.mdEditor = new SimpleMDE({ 
                    element: e.target.querySelector("#mde"),
                    status: false,
                    spellChecker: false,
                    toolbar: ["bold", "italic", "|", "quote", "link", "image", "|", "preview", "guide"], 
                });

                e.target.querySelector("#editor_save").addEventListener('click', () => {
                        element.innerText = window.mdEditor.value();
                        modal.$destroy();
                        this.instance.Report.create();
                        this.instance.repaintEverything();
                    });
            });
    }

    save(data) {
        this._editLabelData = data;
    }

    _nl2br(text) {
        return text.replace(/\\n/gi, '<br>')
    }

    _addEndpoints(toId, sourceAnchors, targetAnchors) {
        for (let i = 0; i < sourceAnchors.length; i++) {
            const sourceUUID = toId + sourceAnchors[i];
            //this.instance.makeSource(toId, {maxConnections: -1});
            this.instance.addEndpoint(toId, Config.sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID, isSource: true, connectionsDetachable: false });
        }
        for (let j = 0; j < targetAnchors.length; j++) {
            const targetUUID = toId + targetAnchors[j];
            //this.instance.makeTarget(toId, {maxConnections: -1});
            this.instance.addEndpoint(toId, Config.targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID, isTarget: true, connectionsDetachable: true });
        }
    };
}
