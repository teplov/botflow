import Node from '../src/Node.js';
import Connector from '../src/Connector.js';
import Report from '../src/Report.js';

const toolbar = {
    blank: document.querySelector('#toolbar .blank'),
    add: document.querySelector('#toolbar .add'),
    delete: document.querySelector('#toolbar .delete'),
    export: document.querySelector('#toolbar .export'),
    codeview: document.querySelector('#toolbar .codeview'),
    zoomIn: document.querySelector('#zoomToolbar .zoomIn'),
    zoomValue: document.querySelector('#zoomToolbar .zoomValue'),
    zoomOut: document.querySelector('#zoomToolbar .zoomOut'),
    info: document.querySelector('#zoomToolbar .info'),
};


jsPlumb.ready(() => {
    
    window.canvas = document.getElementById('canvas');
    let zoom = 1;
    
    const instance = window.jsp = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000, grid: [20, 20] },
        Container: "canvas"
    });
    
    const node = new Node(instance);
    const conn = new Connector(instance);
    const report = new Report(instance);
   
    jsPlumb.fire("Loaded", instance);
    instance.setZoom(zoom);

    instance.bind("dblclick", (i) => {
        conn.editLabel(i);
    });

    instance.bind("click", (i) => {
        conn.select(i);
        toolbar.info.innerText = `Connection: ${i.sourceId} -> ${i.targetId}`;
    });

    instance.bind("connection", (i) => {
            conn.create(i, 'Кнопка');
            report.create();
    });

    instance.on(canvas, "dblclick", (e) => {
        // проверяем, что кликаем по пустому холсту, а не по элементам
        if (e.target.id == canvas.id) {
            node.create(e.offsetX, e.offsetY);
            report.create();
        }
    });

    canvas.addEventListener('click', (e) => { 
        node.select(e.target);
    });

    toolbar.blank.addEventListener('click', (e) => {
        instance.empty(canvas);
        report.create();
    });

    toolbar.add.addEventListener('click', (e) => {
        node.create(20, 20);
        report.create();
    });

    toolbar.delete.addEventListener('click', (e) => {
        canvas.querySelectorAll('.selected').forEach(el => node.delete(el));
        report.create();
    });

    toolbar.export.addEventListener('click', (e) => {
        report.download();
    });

    toolbar.zoomIn.addEventListener('click', (e) => {
        zoom += 0.1;
        toolbar.zoomValue.innerText = parseInt(zoom * 100, 10) + '%';
        setZoom(zoom, instance, [0.5, 0.5], canvas);
    });

    toolbar.zoomOut.addEventListener('click', (e) => {
        zoom -= 0.1;
        if (zoom <= 0) return;
        toolbar.zoomValue.innerText = parseInt(zoom * 100, 10) + '%';
        setZoom(zoom, instance, [0.5, 0.5], canvas);
    });
    
    toolbar.codeview.addEventListener('click', (e) => {
        report.create();
        const output = document.querySelector('#output');
        output.classList.toggle('visible');
    });

    const setZoom = (zoom, instance, transformOrigin, el) => {
        transformOrigin = transformOrigin || [ 0.5, 0.5 ];
        instance = instance || jsPlumb;
        el = el || instance.getContainer();
        const p = [ "webkit", "moz", "ms", "o" ],
            s = "scale(" + zoom + ")";
      
        for (let i = 0; i < p.length; i++) {
          el.style[p[i] + "Transform"] = s;
        }
      
        el.style["transform"] = s;
        instance.setZoom(zoom);    
      };
});

