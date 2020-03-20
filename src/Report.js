import Config from './config.js';

export default class Report {
    constructor(instance) {
        this.JSON = {};
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
    }

    create() {
        this.JSON = {
            filename: Config.appname,
            data: {}
        };
        this.canvas.querySelectorAll('.node').forEach(el => {
            this.JSON.data[el.dataset.id] = {
                id: el.dataset.id,
                //data: el.firstChild.innerText,
                data: el.dataset.data ? JSON.parse(el.dataset.data) : el.querySelector('.node_label').innerText,
                type: el.dataset.type,
                suggestions: [],
                x: parseInt(el.style.left, 10),
                y: parseInt(el.style.top, 10),
            };
            if (typeof this.JSON.data[el.dataset.id].data.params == 'string') {
                this.JSON.data[el.dataset.id].data.params = JSON.parse(this.JSON.data[el.dataset.id].data.params);
            }
        });

        this.instance.getConnections().forEach((i, c) => {
            this.JSON.data[i.sourceId].suggestions.push({
                text: i.getLabel(),
                target: i.targetId
            });
        });

        this.JSON.filename = Config.toolbar.filename.innerText || Config.appname;
        //Config.panel.output.innerHTML = this._syntaxHighlight(this.JSON);
        this.save();
    }

    get data() {
        return this.JSON
    }

    set data(newData) {
        this.JSON = newData;
        this.save();
        this.instance.repaintEverything();
    }

    view() {
        Config.panel.output.innerHTML = this._syntaxHighlight(this.JSON);
    }

    save() {
        //console.log(this.JSON.filename);
        localStorage.setItem(Config.storageScenarionName, JSON.stringify(this.JSON));
    }

    _syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
       }
       json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
       return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
           var cls = 'number';
           if (/^"/.test(match)) {
               if (/:$/.test(match)) {
                   cls = 'key';
               } else {
                   cls = 'string';
               }
           } else if (/true|false/.test(match)) {
               cls = 'boolean';
           } else if (/null/.test(match)) {
               cls = 'null';
           }
           return '<span class="' + cls + '">' + match + '</span>';
       });
    }

    download() {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data)));
        const filename = prompt('File name', this.JSON.filename);
        
        if (!filename) return;
    
        element.setAttribute('download', filename + '.json');
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }
    
}