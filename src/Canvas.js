import Config from './config.js';
import Modal from './Modal.js';
import TextNode from './TextNode.js';
import VideoNode from './VideoNode.js';
import StartNode from './StartNode.js';
import LinkNode from './LinkNode.js';
import AnchorNode from './AnchorNode.js';
import WidgetNode from './WidgetNode.js';

export default class Canvas {
    constructor (instance) {
        this.node;
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
        this.lang = window.lang;
        this.count = 0;
        this._editLabelData = '';
        this.modal = new Modal();
        this.nodes = {};
    }

    get length () {
        return this.count;
    }

    create(x, y, label = this.lang.nodeLabelDefault) {
        const id = jsPlumbUtil.uuid();
        const nodeExist = canvas.querySelectorAll('.node').length;
        let type = 'start';
        if (nodeExist) type = 'text';
        this._createNode(id, x, y, label, type);
    }

    load(id, data, type, x = 20, y = 20) {
        this._createNode(id, x, y, data, type);
    }

    _createNode(id, x, y, data, type) { 
        if (type == 'start') {
            this.nodes[id] = new StartNode(this.instance.getContainer(), this.instance);
            this.nodes[id].create(id, x, y, data);
        } 

        if (type == 'text') {
            this.nodes[id] = new TextNode(this.instance.getContainer(), this.instance);
            this.nodes[id].create(id, x, y, data);
        } 

        if (type == 'video') {
            this.nodes[id] = new VideoNode(this.instance.getContainer(), this.instance);
            this.nodes[id].create(id, x, y, data);
        }

        if (type == 'link') {
            this.nodes[id] = new LinkNode(this.instance.getContainer(), this.instance);
            this.nodes[id].create(id, x, y, data);
        }

        if (type == 'anchor') {
            this.nodes[id] = new AnchorNode(this.instance.getContainer(), this.instance);
            this.nodes[id].create(id, x, y, data);
        }

        if (type == 'widget') {
            this.nodes[id] = new WidgetNode(this.instance.getContainer(), this.instance);
            this.nodes[id].create(id, x, y, data);
        }

        //this._addEndpoints(id, ['BottomCenter'], ["TopCenter"]);
        // обновляем report если произошло перемещение node
        this.instance.draggable(this.nodes[id].node, {
            stop: () => this.instance.Report.create()
        });
    }

    delete(el) {
        if (el.dataset.type === 'start') {
            alert('Нельзя удалять стартовый узел');
        } else {
            this.instance.remove(el.id);
            this.count--;
        }
    }

    // _createLabel(text) {
    //     const nodeLabel = document.createElement('span');
    //     nodeLabel.className = 'node_label';
    //     nodeLabel.innerText = text;
    //     return nodeLabel
    // }

    // _createVideoLabel(data) {
    //     const file = document.createElement('b');
    //     file.innerText = data.file;
    //     const nodeLabel = document.createElement('span');
    //     nodeLabel.className = 'node_label';
    //     nodeLabel.appendChild(file);
    //     nodeLabel.appendChild(document.createElement('br'));
    //     nodeLabel.innerHTML += data.text || data;
    //     return nodeLabel
    // }

    // _createMarker(text = this.lang.nodeMarkerStart) {
    //     const nodeLabel = document.createElement('span');
    //     const nodeMarker = document.createElement('div');
    //     //nodeLabel.innerText = text;
    //     nodeMarker.title = text;
    //     nodeLabel.setAttribute('uk-icon', 'icon:' + Config.labelIcon[text]);
    //     nodeMarker.classList.add('type_label', `label_${Config.labelColor[text]}`);
    //     nodeMarker.appendChild(nodeLabel);
    //     return nodeMarker
    // }

    _deselect() {
        this.canvas.querySelectorAll('.node').forEach(el => el.classList.add('deselected'));
        this.instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        this.instance.getConnections().forEach(conn => conn.setPaintStyle({ stroke:"#000", strokeWidth:3 }));
        //this.instance.clearDragSelection();
    }

    _editLabel(e) {
        let element = e.target.parentNode.querySelector('.node_label');
        //console.log(element.parentNode.querySelector('.node_label'));
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
}
