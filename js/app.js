import Config from '../src/config.js';
import Canvas from '../src/Canvas.js';
import VideoNode from '../src/VideoNode.js';
import TextNode from '../src/TextNode.js';
import StartNode from '../src/StartNode.js';
import LinkNode from '../src/LinkNode.js';
import WidgetNode from '../src/WidgetNode.js';
import Connector from '../src/Connector.js';
import Report from '../src/Report.js';


jsPlumb.ready(() => {
    
    window.canvas = document.getElementById('canvas');
    window.lang = Config.lang['EN'];
    let zoom = 1;
    window.currentNodeType = 'start';
    
    const instance = window.jsp = jsPlumb.getInstance({
        Node: null,
        Conn: null,
        Report: null,
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
    
    instance.Canvas = new Canvas(instance);
    instance.VideoNode = new VideoNode(window.canvas, instance);
    instance.TextNode = new TextNode(window.canvas, instance);
    instance.StartNode = new StartNode(window.canvas, instance);
    instance.LinkNode = new LinkNode(window.canvas, instance);
    instance.WidgetNode = new WidgetNode(window.canvas, instance);
    instance.Conn = new Connector(instance);
    instance.Report = new Report(instance);

    window.mdEditor = new SimpleMDE({ 
        element: document.getElementById("mde"),
        status: false,
        spellChecker: false,
        toolbar: ["bold", "italic", "|", "quote", "link", "image", "|", "preview", "guide"], 
    });
   
    jsPlumb.fire("Loaded", instance);
    instance.setZoom(zoom);

    const loader = (json = null) => {
        let data = {};
        let filename = Config.appname;
        if (!json) {
            const _parseData = localStorage.getItem('chatbotflow');
            json = _parseData ? _parseData : '{}';
            //filename = _parseData ? _parseData.filename : filename;
        }
        if (json) {
            const _parseData = JSON.parse(json);
            data = _parseData.data || _parseData;
            filename = _parseData.filename || filename;
            instance.empty(canvas);
        }

        for (let i in data) {
            const item = data[i];
            instance.Canvas.load(item.id, item.data || item.text, item.type, item.x, item.y);
        }

        for (let i in data) {
            const item = data[i];
            item.suggestions.forEach((suggest) => {
                console.log(item.id, item.type);
                instance.Conn.load(item.id, suggest.target, suggest.text, item.type);
            });
        }

        Config.toolbar.filename.innerText = filename;
        instance.Report.create();
    };

    loader();

    instance.bind("dblclick", (i) => {
        instance.Conn.editLabel(i);
        instance.Report.create();
    });

    instance.bind("click", (i) => {
        instance.Conn.select(i);
        Config.toolbar.info.innerText = `Connection: ${i.sourceId} -> ${i.targetId}`;
    });

    instance.bind("connection", (i, e) => {
        console.log('connection');
        instance.Conn.create(i);
        instance.Report.create();
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
            //instance.Canvas.create(e.offsetX, e.offsetY);
            setCurrentNodeType(window.currentNodeType, e.offsetX - 20, e.offsetY - 20);
            instance.Report.create();
        }
    });

    canvas.addEventListener('click', (e) => { 
        if (e.target === window.canvas) {
            instance.Canvas._deselect();
        }
    });

    Config.toolbar.blank.addEventListener('click', (e) => {
        instance.empty(canvas);
        Config.toolbar.filename.innerText = Config.appname;
        instance.Report.create();
    });

    const setCurrentNodeType = (type, x = 20, y = 20) => {
        const nodeExist = canvas.querySelectorAll('.node').length;
        if (!nodeExist) type = 'start';
        switch(type) {
            case 'text':
                instance.TextNode.create(jsPlumbUtil.uuid(), x, y);
                window.currentNodeType = 'text';
                break;
            case 'video':
                instance.VideoNode.create(jsPlumbUtil.uuid(), x, y);
                window.currentNodeType = 'video';
                break;
            case 'link':
                instance.LinkNode.create(jsPlumbUtil.uuid(), x, y);
                window.currentNodeType = 'link';
                break;
            case 'widget':
                instance.WidgetNode.create(jsPlumbUtil.uuid(), x, y);
                window.currentNodeType = 'widget';
                break;
            default:
                instance.StartNode.create(jsPlumbUtil.uuid(), x, y);
                window.currentNodeType = 'text';
        }
        Config.toolbar.add.innerHTML = `<span uk-icon="icon: ${Config.labelIcon[window.currentNodeType]}"></span>`;
    };

    Config.toolbar.add.addEventListener('click', (e) => {
        setCurrentNodeType(window.currentNodeType);
    });

    Config.toolbar.delete.addEventListener('click', (e) => {
        canvas.querySelectorAll('.node:not(.deselected)').forEach(el => instance.Canvas.delete(el));
        instance.Conn.delete();
        instance.Report.create();
    });

    Config.toolbar.addType.addEventListener('click', (e) => {
        setCurrentNodeType(e.target.dataset.type);
    });

    // Config.modalEl.saveButton.addEventListener('click', (e) => {
    //     const value = window.mdEditor.value();
    //     UIkit.modal(Config.modalEl.window).hide();
    //     instance.Canvas.save(value);
    // });

    Config.toolbar.load.addEventListener('click', (e) => {
       // loader();
    });

    Config.toolbar.export.addEventListener('click', (e) => {
        instance.Report.download();
    });

    Config.toolbar.zoomIn.addEventListener('click', (e) => {
        zoom += 0.1;
        Config.toolbar.zoomValue.innerText = parseInt(zoom * 100, 10) + '%';
        setZoom(zoom, instance, [0.5, 0.5], canvas);
    });

    Config.toolbar.zoomOut.addEventListener('click', (e) => {
        zoom -= 0.1;
        if (zoom <= 0) return;
        Config.toolbar.zoomValue.innerText = parseInt(zoom * 100, 10) + '%';
        setZoom(zoom, instance, [0.5, 0.5], canvas);
    });

    // Config.toolbar.lang.addEventListener('click', (e) => {
    //     window.lang = Config.lang['EN'];
    //     if (e.target.innerText == 'RU') {
    //         window.lang = Config.lang['EN'];
    //         e.target.innerText = 'EN';
    //     } else {
    //         window.lang = Config.lang['RU'];
    //         e.target.innerText = 'RU'; 
    //     }
    // });
    
    Config.toolbar.codeview.addEventListener('click', (e) => {
        instance.Report.create();
        const output = document.querySelector('#output');
        output.classList.toggle('visible');
    });
    
    Config.toolbar.preview.addEventListener('click', (e) => {
        instance.Report.create();
        window.sberCare.setBotScenario(instance.Report.data);
        const preview = document.querySelector('#preview');
        preview.classList.toggle('visible');
    });

    Config.toolbar.file.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        if (file && file.type === 'application/json' && file.size > 0) {
            reader.addEventListener("load", (event) => {
                const jsonData = event.target.result;
                loader(jsonData);
            });
        }
    });

    Config.toolbar.filename.addEventListener('input', (e) => {
        instance.Report.create();
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

