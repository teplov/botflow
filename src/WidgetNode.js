import Config from './config.js';
import Modal from './Modal.js';
import Node from './Node.js';

export default class WidgetNode extends Node {
    constructor(container, instance) {
        super(container, instance);
        this.type = 'widget';
        this.defaultData = {
            endpoint: 'https://',
            file: '',
            params: '{}'
        };
    }

    create(id, x, y, data = this.defaultData, nodeName) {
        super.create(id, x, y, data, nodeName);
        this.node.dataset.data = JSON.stringify(this.data);
        this.node.appendChild(this._createLabel());
        this._addEndpoints(this.node, ['BottomCenter'], ["TopCenter"]);
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
        nodeLabel.innerHTML += '';
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
        this.data.params = typeof this.data.params == 'string' ? this.data.params : JSON.stringify(this.data.params);
        window.modal = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Widget node</h2>
        </div>
        <div id="body" class=" uk-modal-body">
                <label class="uk-text-meta" for="nodeName">Название блока</label>
                <input class="uk-input" id="nodeName" type="text" placeholder="" value="${this.nodeName}">   
                <br><br> 
                <label class="uk-text-meta" for="endpoint">Endpoint</label>
                <input class="uk-input" id="endpoint" type="text" placeholder="Адрес виджета" value="${this.data.endpoint}">   
                <br><br> 
                <label class="uk-text-meta" for="file">Файл с данными</label>
                <input class="uk-input" id="file" type="text" placeholder="Файл с данными" value="${this.data.file}">   
                <br><br> 
                <label class="uk-text-meta" for="params">Параметры</label>
                <textarea id="params" rows="8" class="uk-textarea">${this.data.params}</textarea>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" id="editor_save" type="button">Save</button>
        </div>`);

        UIkit.util.on(modal.$el, 'shown', (e) => {
            const editModal = e.target;
            editModal.querySelector("#editor_save").addEventListener('click', (e) => {
                let data = {};
                this.nodeName = editModal.querySelector('#nodeName').value;
                data.endpoint = editModal.querySelector('#endpoint').value;
                data.file = editModal.querySelector('#file').value;
                data.params = editModal.querySelector('#params').value;
                this.save(data);
            });
        });
    }


}