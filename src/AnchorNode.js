import Config from './config.js';
import Modal from './Modal.js';
import Node from './Node.js';

export default class AnchorNode extends Node {
    constructor(container, instance) {
        super(container, instance);
        this.type = 'anchor';
        this.defaultData = {
            file: '',
            target: 'start'
        };
    }

    create(id, x, y, data = this.defaultData) {
        super.create(id, x, y, data);
        this.node.dataset.data = JSON.stringify(this.data);
        this.node.appendChild(this._createLabel());
        this._addEndpoints(this.node, [], ['TopCenter']);
        jsp.repaintEverything();
        jsp.Report.create();
    }

    _createLabel() {
        const nodeLabel = document.createElement('span');
        nodeLabel.className = 'node_label';
        nodeLabel.innerHTML = `${this.data.file}@${this.data.target}`;
        return nodeLabel
    }

    save(data) {
        this.data = data;
        this.node.querySelector('.node_label').remove();
        this.node.appendChild(this._createLabel());
        super.save(data);
    }

    edit() {
        super.edit();
        const modal = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title uk-margin-small-bottom">Anchor node</h2>
            <h5 class="uk-margin-remove-top">id: ${this.id}</h5>
        </div>
        <div id="body" class=" uk-modal-body">
            <label class="uk-text-meta" for="file_video">Файл сценария</label>
            <input class="uk-input" id="anchor_file" type="text" placeholder="файл" value="${this.data.file}"> 

            <label class="uk-text-meta" for="file_video">Узел сценария</label>
            <input class="uk-input" id="anchor_target" type="text" placeholder="ID узла" value="${this.data.target}">   
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" id="editor_save" type="button">Save</button>
        </div>`);

        UIkit.util.on(modal.$el, 'shown', (e) => {
            e.target.querySelector("#editor_save").addEventListener('click', (e) => {
                let data = {};
                data.file = document.querySelector('#anchor_file').value;
                data.target = document.querySelector('#anchor_target').value;
                this.save(data);
            });
        });
    }


}