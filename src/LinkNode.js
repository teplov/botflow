import Config from './config.js';
import Modal from './Modal.js';
import Node from './Node.js';

export default class LinkNode extends Node {
    constructor(container, instance) {
        super(container, instance);
        this.type = 'link';
        this.defaultData = 'Double click to edit';
    }

    create(id, x, y, data = this.defaultData) {
        super.create(id, x, y, data);
        this.node.dataset.data = JSON.stringify(this.data);
        this.node.appendChild(this._createLabel());
        jsp.repaintEverything();
        jsp.Report.create();
    }

    _createLabel() {
        const nodeLabel = document.createElement('span');
        nodeLabel.className = 'node_label';
        nodeLabel.innerHTML = this.data;
        return nodeLabel
    }

    edit() {
        super.edit();
        window.modal = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Link node</h2>
        </div>
        <div id="body" class=" uk-modal-body">
            <label class="uk-text-meta" for="file_video">Ссылка</label>
            <input class="uk-input" id="link" type="text" placeholder="Адрес" value="${this.data}">   
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" id="editor_save" type="button">Save</button>
        </div>`);

        this.mde("mde_text");
    }


}