export default class Modal {
    constructor() {
        this.window = null;
        this.mode = 'text';
        this.menu = [
            'text',
            'widget',
            'link'
        ];
    }

    createMenu() {
        return this.menu.map(item => {
            let mode = '';
            if (this.mode === item) mode = 'uk-active';
            return `<li class="${mode}" ><a href="#">${item}</a></li>`
        }).join('');
    }

    createBody(element, content) {
        switch(this.mode) {
            case 'text':
                return this.text(element, content);
            case 'widget':
                return this.widget(content);
            case 'link':
                return this.link(content);
            default: 
                return this.text(content);
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

    link() {}

    mde(container) {
        window.mdEditor = new SimpleMDE({ 
            element: container,
            status: false,
            spellChecker: false,
            toolbar: ["bold", "italic", "|", "quote", "link", "image", "|", "preview", "guide"], 
        });
    }

    open(content) {
        this.window = UIkit.modal.dialog(`
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <ul id="modal_tabs" class="uk-padding uk-padding-remove-bottom uk-margin-remove-bottom" data-uk-tab="{connect:'#body'}" uk-tab>${this.createMenu()}</ul>
        <ul id="body" class="uk-switcher uk-margin uk-modal-body uk-padding-remove">
            <li>Content 1</li>
            <li>Content 2</li>
            <li>Content 3</li>
        </ul>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary" id="editor_save" type="button">Save</button>
        </div>`);

        UIkit.util.on(this.window.$el, 'shown', (e) => {
            const bodyEl = this.window.$el.querySelector('#body li');
            this.createBody(bodyEl, content);
        });

        //UIkit.tab(this.window.$el.querySelector('#modal_tabs')).show(1);
    }
}