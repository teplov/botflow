import Config from './config.js';
import Modal from './Modal.js';
import Node from './Node.js';

export default class StartNode extends Node {
    constructor(container, instance) {
        super(container, instance);
        this.type = 'start';
        this.defaultData = 'Double click to edit';
    }

    create(id, x, y, data = this.defaultData, nodeName) {
        super.create(id, x, y, data, nodeName);
        this.node.dataset.data = JSON.stringify(this.data);
        this.node.appendChild(this._createLabel());
        this._addEndpoints(this.node, ['BottomCenter'], []);
        jsp.repaintEverything();
        jsp.Report.create();
    }

    _createLabel() {
        const nodeLabel = document.createElement('span');
        nodeLabel.className = 'node_label';
        nodeLabel.innerHTML = this.data;
        return nodeLabel
    }

    save(text) {
        this.node.querySelector('.node_label').innerText = text;
        super.save(text);
    }

    edit() {
        super.edit();
        const modal = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title uk-margin-small-bottom">Start node</h2>
            <h5 class="uk-margin-remove-top">id: ${this.id}</h5>
        </div>
        <div id="body" class=" uk-modal-body">
            <textarea id="mde_text">${this.data}</textarea>
            <br> 
            <label class="uk-text-meta" for="nodeName">Название блока (опция)</label>
            <input class="uk-input" id="nodeName" type="text" placeholder="" value="${this.nodeName || null}">   
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" id="editor_save" type="button">Save</button>
        </div>`);

        this.mde("mde_text");
        UIkit.util.on(modal.$el, 'shown', (e) => {
            const editModal = e.target;
            e.target.querySelector("#editor_save").addEventListener('click', (e) => {
                this.nodeName = editModal.querySelector('#nodeName').value;
                const text = window.mdEditor.value();
                this.save(text);
            });
        });
    }


}