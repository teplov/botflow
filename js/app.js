import Config from '../src/config.js';
import Node from '../src/Node.js';
import Connector from '../src/Connector.js';
import Report from '../src/Report.js';

const toolbar = {
    blank: document.querySelector('#toolbar .blank'),
    add: document.querySelector('#toolbar .add'),
    delete: document.querySelector('#toolbar .delete'),
    load: document.querySelector('#toolbar .load'),
    export: document.querySelector('#toolbar .export'),
    lang: document.querySelector('#toolbar .lang'),
    codeview: document.querySelector('#toolbar .codeview'),
    zoomIn: document.querySelector('#zoomToolbar .zoomIn'),
    zoomValue: document.querySelector('#zoomToolbar .zoomValue'),
    zoomOut: document.querySelector('#zoomToolbar .zoomOut'),
    info: document.querySelector('#zoomToolbar .info'),
    file: document.querySelector('#file'),
};


jsPlumb.ready(() => {
    
    window.canvas = document.getElementById('canvas');
    window.lang = Config.lang['EN'];
    let zoom = 1;
    
    const instance = window.jsp = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000, grid: [20, 20] },
        Container: "canvas",
        Connector: [ "Flowchart", { cornerRadius: 5, gap: 8 } ],
        //ConnectorStyle: { stroke:"#ff0000", strokeWidth: 3 },
        Endpoint:[ "Dot", { stroke: "#fff", radius: 7, strokeWidth: 2 } ],
        //Endpoint: Config.targetEndpoint,
        EndpointStyle : { fillStyle: "#000" },
        Anchors : [ "BottomCenter", "TopCenter" ],
        MaxConnections: -1,
        isSource: true,
        //isTarget: true,
        //ReattachConnections: false,
        ConnectionsDetachable: false,
        deleteEndpointsOnDetach:true,
        //allowLoopback: false,
        //dragAllowedWhenFull:false
    });
    
    const node = new Node(instance);
    const conn = new Connector(instance);
    const report = new Report(instance);
   
    jsPlumb.fire("Loaded", instance);
    instance.setZoom(zoom);

    const loader = (json = null) => {
        let data = {};
        if (!json) {
            json = localStorage.getItem('chatbotflow');
        }
        if (json) {
            data = JSON.parse(json);
            instance.empty(canvas);
        }

        for (let i in data) {
            const item = data[i];
            node.load(item.id, item.text, item.type, item.x, item.y);
        }

        for (let i in data) {
            const item = data[i];
            item.suggestions.forEach((suggest) => {
                //console.log(item.id, suggest.target);
                conn.load(item.id, suggest.target, suggest.text, item.type);
            });
        }

    };

    loader();

    instance.bind("dblclick", (i) => {
        conn.editLabel(i);
        report.create();
    });

    instance.bind("click", (i) => {
        conn.select(i);
        toolbar.info.innerText = `Connection: ${i.sourceId} -> ${i.targetId}`;
    });

    instance.bind("connection", (i, e) => {
        conn.create(i);
        report.create();
    });


    // проверяем, есть ли коннект между нодами, которые пытается соединить юзер
    instance.bind('beforeDrop', (i,e) => {
        // ищем все коннекты между двумя узлами
        const arr=instance.select({source:i.sourceId,target:i.targetId});
        // если вернуть false, то коннект не произойдет
        return !arr.length;
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
        conn.select(e.target);
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
        conn.delete();
        report.create();
    });

    toolbar.load.addEventListener('click', (e) => {
       // loader();
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

    toolbar.lang.addEventListener('click', (e) => {
        window.lang = Config.lang['EN'];
        if (e.target.innerText == 'RU') {
            window.lang = Config.lang['EN'];
            e.target.innerText = 'EN';
        } else {
            window.lang = Config.lang['RU'];
            e.target.innerText = 'RU'; 
        }
    });
    
    toolbar.codeview.addEventListener('click', (e) => {
        report.create();
        const output = document.querySelector('#output');
        output.classList.toggle('visible');
    });

    toolbar.file.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        console.log(file);
        if (file && file.type === 'application/json' && file.size > 0) {
            reader.addEventListener("load", (event) => {
                const jsonData = event.target.result;
                loader(jsonData);
            });
        }
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

