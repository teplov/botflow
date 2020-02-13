import Config from './config.js';

export default class Settings {
    constructor() {
        this.data = {
            chatPreviewUrl: null,
            videoNodeBaseUrl: null
        };
    }

    get data() {
        return this.data
    }

    set data(params) {
        this.data = params;
    }

    save() {
        localStorage.setItem(Config.storageSettingsName);
    }

    edit() {
        super.edit();
        const modal = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title uk-margin-small-bottom">Settings</h2>
            <h5 class="uk-margin-remove-top">Additional editor parameners</h5>
        </div>
        <div id="body" class=" uk-modal-body">
            <label class="uk-text-meta" for="file_video">Chat preview path url</label>
            <input class="uk-input" id="chatPreviewUrl" type="text" placeholder="https://" value="${this.data.chatPreviewUrl}">   
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
                data.file = editModal.querySelector('#file_video').value;
                data.text = window.mdEditor.value();
                this.save(data);
            });
        });
    }
}