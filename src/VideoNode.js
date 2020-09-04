import Config from './config.js';
import Node from './Node.js';


export default class VideoNode extends Node {
    constructor(container, instance) {
        super(container, instance);
        this.type = 'video';
        this.defaultData = {
            file: 'unknown.mp4',
            text: 'Video description'
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
        const file = document.createElement('b');
        file.className = 'node_caption';
        file.innerText = this.data.file;
        const nodeLabel = document.createElement('span');
        nodeLabel.className = 'node_label';
        nodeLabel.appendChild(file);
        nodeLabel.appendChild(document.createElement('br'));
        nodeLabel.innerHTML += this.data.text;
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
            <h2 class="uk-modal-title uk-margin-small-bottom">Video node</h2>
            <h5 class="uk-margin-remove-top">id: ${this.id}</h5>
        </div>
        <div id="body" class=" uk-modal-body">
            <label class="uk-text-meta" for="nodeName">Название блока</label>
            <input class="uk-input" id="nodeName" type="text" placeholder="" value="${this.nodeName}">   
            <br><br>
            <label class="uk-text-meta" for="file_video">Имя файла</label>
            <input class="uk-input" id="file_video" type="text" placeholder="Имя файла" value="${this.data.file}">   
            <br><br> 
            <textarea id="mde_video">${this.data.text}</textarea>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" id="editor_save" type="button">Save</button>
        </div>`);

        this.mde("mde_video");

        UIkit.util.on(modal.$el, 'shown', (e) => {
            const editModal = e.target;
            editModal.querySelector("#editor_save").addEventListener('click', (e) => {
                let data = {};
                this.nodeName = editModal.querySelector('#nodeName').value;
                data.file = editModal.querySelector('#file_video').value;
                data.text = window.mdEditor.value();
                this.save(data);
            });
        });
    }

}