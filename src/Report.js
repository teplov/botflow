import Config from './config.js';

export default class Report {
    constructor(instance) {
        this.JSON = {};
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
    }

    create() {
        this.JSON = {};
        this.canvas.querySelectorAll('.node').forEach(el => {
            this.JSON[el.id] = {
                id: el.id,
                text: el.firstChild.innerText,
                type: el.dataset.start ? 'start' : 'step',
                suggestions: [],
                x: parseInt(el.style.left, 10),
                y: parseInt(el.style.top, 10),
            };
        });

        this.instance.getConnections().forEach((i, c) => {
            this.JSON[i.sourceId].suggestions.push({
                text: i.getLabel(),
                target: i.targetId
            });
        });

        Config.panel.output.innerHTML = this._syntaxHighlight(this.JSON);
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

    download(data) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
        const filename = prompt('Имя файла', `bot_scenario_` + Date.now());
        
        if (!filename) return;
    
        element.setAttribute('download', filename + '.json');
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }
    
}