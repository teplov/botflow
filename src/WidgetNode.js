import Config from './config.js';
import Modal from './Modal.js';
import Node from './Node.js';

export default class WidgetNode extends Node {
    constructor(container, instance) {
        super(container, instance);
        this.type = 'widget';
        this.defaultData = {
            endpoint: 'https://',
            template: '{}'
        };
    }

    create(id, x, y, data = this.defaultData) {
        super.create(id, x, y, data);
        this.node.dataset.data = JSON.stringify(this.data);
        this.node.appendChild(this._createLabel());
        jsp.repaintEverything();
        jsp.Report.create();
    }

    _createLabel() {
        const endpoint = document.createElement('b');
        endpoint.innerText = this.data.endpoint;
        const nodeLabel = document.createElement('span');
        nodeLabel.className = 'node_label';
        nodeLabel.appendChild(endpoint);
        nodeLabel.appendChild(document.createElement('br'));
        nodeLabel.innerHTML += '{}';
        return nodeLabel
    }

    edit() {
        super.edit();
        window.modal = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Widget node</h2>
        </div>
        <div id="body" class=" uk-modal-body">
                <label class="uk-text-meta" for="endpoint">Endpoint</label>
                <input class="uk-input" id="endpoint" type="text" placeholder="Точка вызова" value="${this.data.endpoint}">   
                <br><br> 
                <textarea id="mde_video" rows="8" class="uk-textarea">${this.data.template}</textarea>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" id="editor_save" type="button">Save</button>
        </div>`);
    }


}