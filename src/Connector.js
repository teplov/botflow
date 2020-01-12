import Config from './config.js';

export default class Connector {
    constructor(instance) {
        this.instance = instance;
        this.canvas = window.canvas || document.querySelector('#canvas');
    }

    create(connector, label = 'Suggest') {
        connector.connection.setLabel(label);
    }

    select(connector) {
        this._deselect();
        connector.setPaintStyle({ stroke:"#1e87f0", strokeWidth:3 });
        this.instance.selectEndpoints({source: connector.sourceId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
        this.instance.selectEndpoints({target: connector.targetId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
    }

    _deselect() {
        this.instance.getConnections().forEach(conn => conn.setPaintStyle({ stroke:"#000", strokeWidth:3 }));
        this.instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        this.canvas.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    }

}