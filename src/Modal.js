export default class Modal {
    constructor() {
        this.window = null;
        this.mode = 'text';
        this.menu = [
            'text',
            'video',
            'widget',
            'link',
        ];
    }

    createMenu() {
        return this.menu.map(item => {
            let mode = '';
            if (this.mode === item) mode = 'uk-active';
            return `<li class="${mode}" ><a href="#">${item}</a></li>`
        }).join('');
    }

    createBody(element, data) {
        switch(this.mode) {
            case 'text':
                return this.text(element, data);
            case 'widget':
                return this.widget(element, data);
            case 'video':
                return this.video(element, data);
            case 'link':
                return this.link(element, data);
            default: 
                return this.text(element, data);
        }
    }

    text(element, content) {
        element.innerHTML = null;
        this.mode = 'text';
        const textareaEl = document.createElement('textarea');
        textareaEl.value = content;
        element.appendChild(textareaEl);
        this.mde(textareaEl);
    }

    widget(element, content) {
        element.innerHTML = null;
        this.mode = 'widget';
    }

    video(element, data) {
        const fileEl = document.createElement('input');
        fileEl.value = data.file;

        element.appendChild(fileEl);
        this.mode = 'video';
    }

    link() {}

    mde(container) {
        window.mdEditor = new SimpleMDE({ 
            element: document.getElementById(container),
            status: false,
            spellChecker: false,
            toolbar: ["bold", "italic", "|", "quote", "link", "image", "|", "preview", "guide"], 
        });
    }

    open(data, type) {
        this.window = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <ul id="modal_tabs" class="uk-padding uk-padding-remove-bottom uk-margin-remove-bottom" data-uk-tab="{connect:'#body'}" uk-tab>${this.createMenu()}</ul>
        <ul id="body" class="uk-switcher uk-margin uk-modal-body uk-padding-remove">
            <li><textarea id="mde_text">${data}</textarea></li>
            <li>
                <label class="uk-text-meta" for="file_video">Имя файла</label>
                <input class="uk-input" id="file_video" type="text" placeholder="Имя файла" value="${data.file}">    
                <textarea id="mde_video">${data.text}</textarea>
            </li>
            <li>Content 3</li>
            <li>Content 4</li>
        </ul>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" id="editor_save" type="button">Save</button>
        </div>`);

        this.mde('mde_text');
        this.mde('mde_video');

        // UIkit.util.on(this.window.$el, 'shown', (e) => {
           // const bodyEl = this.window.$el.querySelector('#body li');
           // this.createBody(bodyEl, content);
        // });

        UIkit.tab(this.window.$el.querySelector('#modal_tabs')).show(this.menu.indexOf(type));
    }
}