import Config from '../src/config.js';
import Canvas from '../src/Canvas.js';
import VideoNode from '../src/VideoNode.js';
import TextNode from '../src/TextNode.js';
import StartNode from '../src/StartNode.js';
import LinkNode from '../src/LinkNode.js';
import AnchorNode from '../src/AnchorNode.js';
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
    instance.AnchorNode = new AnchorNode(window.canvas, instance);
    instance.WidgetNode = new WidgetNode(window.canvas, instance);
    instance.Conn = new Connector(instance);
    instance.Report = new Report(instance);
    instance.dragSelect = dragSelect;
    instance.canvasZoom = 1;


    var selectableObjects=[];


    const loader = (json = null) => {
        Config.ui.overlay.style.display = 'block';
        let data = {};
        let filename = Config.appname;
        if (!json) {
            const _parseData = localStorage.getItem(Config.storageScenarionName);
            json = _parseData ? _parseData : '{}';
            //filename = _parseData ? _parseData.filename : filename;
        }
        if (json) {
            const _parseData = JSON.parse(json);
            data = _parseData.data || _parseData;
            filename = _parseData.filename || filename;
            instance.empty(canvas);
        }

        jsPlumb.batch(function() {
            for (let i in data) {
                const item = data[i];
                instance.Canvas.load(item.id, item.data || item.text, item.type, item.x, item.y, item.nodeName);
            }

            for (let i in data) {
                const item = data[i];
                item.suggestions.forEach((suggest) => {
                    instance.Conn.load(item.id, suggest.target, suggest.text, item.type);
                });
            }
        });

        Config.toolbar.filename.innerText = filename;
        instance.Report.create();
        Config.ui.overlay.style.display = 'none';
    };

    jsPlumb.setSuspendDrawing(true);
    loader();
    jsPlumb.setSuspendDrawing(false, true);

    instance.bind("dblclick", (i) => {
        instance.Conn.editLabel(i);
        instance.Report.create();
        amplitude.getInstance().logEvent('Edit Connection Label');
    });

    instance.bind("click", (i) => {
        //console.log('Con', i);
        instance.Conn.select(i);
        Config.toolbar.info.innerText = `Connection: ${i.sourceId} -> ${i.targetId}`;
    });

    instance.bind("connection", (i, e) => {
        //console.log('connection');
        instance.Conn.create(i);
        instance.Report.create();
        amplitude.getInstance().logEvent('Create connection');
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
            amplitude.getInstance().logEvent('Create Node');
        }
    });

    instance.on(canvas, "click", (e) => {
        // проверяем, что кликаем по пустому холсту, а не по элементам
        if (e.target.id == canvas.id) {
            // console.log('Con, deselect', e);
            instance.Conn.deselect();
        }
    });

    canvas.addEventListener('click', (e) => { 
        if (e.target === window.canvas) {
            instance.Canvas._deselect();
            Config.toolbar.info.innerText = ``;
        }
    });

    Config.toolbar.blank.addEventListener('click', (e) => {
        instance.empty(canvas);
        Config.toolbar.filename.innerText = Config.appname;
        instance.Report.create();
    });

    const setCurrentNodeType = (type, x = 20, y = 20) => {
        const nodeExist = canvas.querySelectorAll('.node').length;
        //console.log(nodeExist);
        if (!nodeExist) {
            window.currentNodeType = type = 'start';
        } else if (nodeExist && window.currentNodeType === 'start') {
            type = 'text';
        }
        const uuid = Math.floor(1000 + Math.random() * 9000);
        switch(type) {
            case 'text':
                instance.TextNode = new TextNode(window.canvas, instance);
                instance.TextNode.create(uuid, x, y);
                window.currentNodeType = 'text';
                break;
            case 'video':
                instance.VideoNode = new VideoNode(window.canvas, instance);
                instance.VideoNode.create(uuid, x, y);
                window.currentNodeType = 'video';
                break;
            case 'link':
                instance.LinkNode = new LinkNode(window.canvas, instance);
                instance.LinkNode.create(uuid, x, y);
                window.currentNodeType = 'link';
                break;
            case 'anchor':
                instance.AnchorNode = new AnchorNode(window.canvas, instance);
                instance.AnchorNode.create(uuid, x, y);
                window.currentNodeType = 'anchor';
                break;
            case 'widget':
                instance.WidgetNode = new WidgetNode(window.canvas, instance);
                instance.WidgetNode.create(uuid, x, y);
                window.currentNodeType = 'widget';
                break;
            default:
                instance.StartNode = new StartNode(window.canvas, instance);
                instance.StartNode.create(uuid, x, y);
                window.currentNodeType = 'text';
        }
        Config.toolbar.add.innerHTML = `<span uk-icon="icon: ${Config.labelIcon[window.currentNodeType]}"></span>`;
    };

    Config.toolbar.add.addEventListener('click', (e) => {
       // setCurrentNodeType(window.currentNodeType);
    });

    Config.toolbar.delete.addEventListener('click', (e) => {
        canvas.querySelectorAll('.node:not(.deselected)').forEach(el => instance.Canvas.delete(el));
        instance.Conn.delete();
        instance.Report.create();
        amplitude.getInstance().logEvent('Delete element');
    });

    Config.toolbar.addType.addEventListener('click', (e) => {
        window.currentNodeType = e.target.dataset.type || e.target.parentNode.parentNode.dataset.type;
        Config.toolbar.add.innerHTML = `<span uk-icon="icon: ${Config.labelIcon[window.currentNodeType]}"></span>`;
        //setCurrentNodeType(e.target.dataset.type);
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
        amplitude.getInstance().logEvent('Save');
    });

    Config.toolbar.zoomIn.addEventListener('click', (e) => {
        instance.canvasZoom += 0.1;
        instance.canvasZoom = Number((instance.canvasZoom).toFixed(1));
        Config.toolbar.zoomValue.innerText = parseInt(instance.canvasZoom * 100, 10) + '%';
        setZoom(instance.canvasZoom, instance, [0.5, 0.5], canvas);
        amplitude.getInstance().logEvent('Zoom In');
    });

    Config.toolbar.zoomOut.addEventListener('click', (e) => {
        instance.canvasZoom -= 0.1;
        instance.canvasZoom = Number((instance.canvasZoom).toFixed(1));
        if (instance.canvasZoom <= 0) return;
        Config.toolbar.zoomValue.innerText = parseInt(instance.canvasZoom * 100, 10) + '%';
        setZoom(instance.canvasZoom, instance, [0.5, 0.5], canvas);
        amplitude.getInstance().logEvent('Zoom Out');
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
        if (!Config.ui.output.classList.contains('visible')) {
            instance.Report.create();
            instance.Report.view();
        }
        Config.ui.output.classList.toggle('visible');
        amplitude.getInstance().logEvent('Code Review');
    });
    
    Config.toolbar.preview.addEventListener('click', (e) => {
        Config.ui.preview.classList.toggle('visible');
        if (Config.ui.preview.classList.contains('visible')) {
            instance.Report.create();
            window.sberCareChat.setBotScenario(instance.Report.data);
            amplitude.getInstance().logEvent('Chat Preview');
        } 
    });

    Config.toolbar.help.addEventListener('click', (e) => {
        // Config.ui.help.classList.toggle('visible');
        // if (Config.ui.help.classList.contains('visible')) {
        //     amplitude.getInstance().logEvent('Help');
        // } 
        introJs().showHints();
    });

    Config.toolbar.file.addEventListener('change', (e) => {
        //Config.ui.overlay.style.display = 'block';
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        if (file && file.type === 'application/json' && file.size > 0) {
            reader.addEventListener("load", (event) => {
                const jsonData = event.target.result;
                loader(jsonData);
                amplitude.getInstance().logEvent('File Loaded');
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
        instance.setZoom(instance.canvasZoom);    
        instance.dragSelect();
      };

    
      jsPlumb.fire("Loaded", instance);
      amplitude.getInstance().logEvent('Refresh editor');
      instance.setZoom(instance.canvasZoom);
      instance.dragSelect();


    var selector = document.createElement('div');
    selector.setAttribute("id", "selector");
    selector.style.position = 'absolute';
    selector.style.background = 'rgba(0, 0, 255, 0.1)';
    selector.style.border = '1px solid rgba(0, 0, 255, 0.45)';
    selector.style.display = 'none';
    selector.style.pointerEvents = 'none';
    selector.style.left = "0px";
    selector.style.top = "0px";
    canvas.append(selector);

    function dragSelect() {
        if (window.ds) {
            window.ds.stop();
        }

            window.ds = new DragSelect({
                selectables: document.querySelectorAll('.node'),
                selector: document.getElementById('selector'),
                area: document.getElementById('canvas'),
                zoom: instance.canvasZoom,
                onElementSelect: e=>{
                    instance.addToDragSelection(e);
                    e.classList.remove('deselected');
                    selectableObjects.push(e);
                },
                onElementUnselect: e=>{
                    e.classList.add('deselected');
                    instance.clearDragSelection();
                },
                multiSelectKeys: ['ctrlKey', 'shiftKey', 'metaKey'],  // special keys that allow multiselection.
            });

        amplitude.getInstance().logEvent('Drag Select');
    }

    
});

