const repaint = (instance) => {
    const connectorStyle = {
        deleteEndpointsOnDetach: true,
        anchor: [ "Continuous", { faces:["top", "bottom"], cssClass:"anchor", hoverClass:"anchorHover" }],
        connector: [ "Flowchart", { curviness:1, cssClass:"connector" } ],
        endpoint: [ "Dot", { radius: 5, cssClass:"endpoint", hoverClass:"endpointHover" } ]
    };
    const nodes = instance.getSelector(".node");
    instance.makeSource(nodes, connectorStyle);
    instance.makeTarget(nodes, connectorStyle);

};

const connectorPaintStyle = {
    strokeWidth: 3,
    stroke: "#000",
    joinstyle: "round"
};

const connectorHoverStyle = {
    strokeWidth: 3,
    stroke: "#1e87f0",
};

const endpointHoverStyle = {
    fill: "#1e87f0",
    stroke: "#fff"
};

const sourceEndpoint = {
    endpoint: "Dot",
    paintStyle: {
        stroke: "#fff",
        fill: "#000",
        radius: 7,
        strokeWidth: 2
    },
    isSource: true,
    isTarget: false,
    connector: [ "Flowchart", { cornerRadius: 5, gap: 8 } ],
    maxConnections: -1,
    reattachConnections: false,
    connectionsDetachable: false,
    allowLoopback: false,
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    //dragOptions: {},
    dragAllowedWhenFull:false
};

const targetEndpoint = {
    endpoint: "Dot",
    paintStyle: { fill: "#000", stroke: "#fff", strokeWidth: 2, radius: 7 },
    hoverPaintStyle: endpointHoverStyle,
    maxConnections: -1,
    reattachConnections: false,
    connectionsDetachable: false,
    allowLoopback: false,
    //dropOptions: { hoverClass: "hover", activeClass: "active" },
    isTarget: true,
    isSource: false,
    dragAllowedWhenFull:false
};


jsPlumb.ready(() => {

    const canvas = document.getElementById('canvas');
    let zoom = 1;
    
    const instance = window.jsp = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000, grid: [20, 20] },
        Container: "canvas"
    });
    
    let nodeCount = instance.getSelector(".node").length || 0;
    //if (nodeCount) repaint(instance);


    const addEndpoints = (toId, sourceAnchors, targetAnchors) => {
        for (let i = 0; i < sourceAnchors.length; i++) {
            const sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, sourceEndpoint, { anchor: sourceAnchors[i], uuid: sourceUUID, connectionsDetachable: false });
        }
        for (let j = 0; j < targetAnchors.length; j++) {
            const targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID, connectionsDetachable: true });
        }
    };
    
    const newNode = (x, y) => {
        nodeCount++;
        const d = document.createElement("div");
        const s = document.createElement('span');
        var id = jsPlumbUtil.uuid();
        d.className = "node";
        d.id = id;
        s.innerText = `Double click to edit`;
        //d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>";
        d.style.left = `${x}px`;
        d.style.top = `${y}px`;
        d.appendChild(s);
        instance.getContainer().appendChild(d);
        addEndpoints(id, ['BottomCenter'], ["TopCenter"]);
        instance.draggable(d);
        //initNode(d);
        //return d;

        d.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (e.target.tagName == 'SPAN') {
                const label = prompt('Текст узла', e.target.innerText);
                //e.target.contentEditable = true;
                if (label) e.target.innerText = label;
                instance.repaintEverything();
            }
        });

        generateJSON();
    };
    
    //instance.connect({ source: "flowchartWindow1", target: "flowchartWindow2" }, connectorStyle);
    //instance.draggable(canvas, { grid:[20,20] });
    //instance.draggable(canvas, { grid: [20, 20] });
   
    jsPlumb.fire("Loaded", instance);
    instance.setZoom(zoom);

    instance.bind("dblclick", (i, e) => {
        const label = prompt('Текст саджеста', i.getLabel());
        i.setLabel(label);
    });

    instance.bind("click", (i, e) => {
        console.log(i);
        //instance.deleteConnection(i);
        //instance.remove(i.id);
        //instance.select({scope: i.scope}).setPaintStyle({ stroke:"#000", strokeWidth:3 });
        instance.getConnections().forEach(conn => {
            conn.setPaintStyle({ stroke:"#000", strokeWidth:3  });
        });
        i.setPaintStyle({ stroke:"#1e87f0", strokeWidth:3  });
        // instance.selectEndpoints().forEach(point => {
        //     point.setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        // });
        instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
        instance.selectEndpoints({source: i.sourceId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
        instance.selectEndpoints({target: i.targetId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
        //instance.selectEndpoints({source: i.sourceId}).setPaintStyle({ fill:"#1e87f0", strokeWidth:2, stroke: "#fff" });
        toolbar.info.innerText = `Connection: ${i.sourceId} -> ${i.targetId}`;
    });

    instance.bind("connection", (i, c) => {
            i.connection.setData('data');
            console.log("connection", i.connection.getData());
            //i.connection.addOverlay(["Label", { label: 'Suggest', location:0.5, cssClass: "connLabel"} ]);
            i.connection.setLabel('Suggest');
            // d.addEventListener('dblclick', (e) => {
            //     e.stopPropagation();
            //     if (e.target.tagName == 'SPAN') {
            //         const label = prompt('Текст узла', e.target.innerText);
            //         //e.target.contentEditable = true;
            //         e.target.innerText = label;
            //         instance.repaintEverything();
            //     }
            // });
            generateJSON();
    });

    instance.on(canvas, "dblclick", (e) => {
        // проверяем, что кликаем по пустому холсту, а не по элементам
        if (e.target.id == canvas.id) {
            newNode(e.offsetX, e.offsetY);
        }
    });

    // instance.on(canvas, "click", (e) => {
    //     let node = null;
    //     if (e.target.classList.contains('node')) node = e.target;
    //     if (e.target.parentNode.classList.contains('node')) node = e.target.parentNode;

    //     canvas.querySelectorAll('.selected').forEach(el => {
    //         el.classList.remove('selected');
    //     });

    //     node && node.classList.toggle('selected');
    //     if (node)  {
    //         toolbar.info.innerText = `Node id: ${node.id}`;
    //     } else {
    //         toolbar.info.innerText = '';
    //     }
    // });

    canvas.addEventListener('click', (e) => {
     let node = null;
        if (e.target.classList.contains('node')) node = e.target;
        if (e.target.parentNode.classList.contains('node')) node = e.target.parentNode;

        canvas.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });

        e.stopPropagation();

       // toolbar.info.innerText = '';
        node && node.classList.toggle('selected');
        if (node)  {
            toolbar.info.innerText = `Node id: ${node.id}`;
            instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
            instance.getConnections().forEach(conn => {
                conn.setPaintStyle({ stroke:"#000", strokeWidth:3  });
            });
        } 

        if (e.target.id == canvas.id) {
            toolbar.info.innerText = null;
            instance.selectEndpoints().setPaintStyle({ fill:"#000", strokeWidth:2, stroke: "#fff" });
            instance.getConnections().forEach(conn => {
                conn.setPaintStyle({ stroke:"#000", strokeWidth:3  });
            });
        }
    });

    const generateJSON = () => {
        let exportJSON = {};
        canvas.querySelectorAll('.node').forEach(el => {
            exportJSON[el.id] = {
                id: el.id,
                text: el.firstChild.innerText,
                suggestions: [],
                x: parseInt(el.style.left, 10),
                y: parseInt(el.style.top, 10),
            };
        });

        instance.getConnections().forEach((i, c) => {
            exportJSON[i.sourceId].suggestions.push({
                text: i.getLabel(),
                target: i.targetId
            });
        });

        document.querySelector('#output').innerHTML = syntaxHighlight(exportJSON);

        return exportJSON;
    };

    toolbar.blank.addEventListener('click', (e) => {
        instance.empty(canvas);
        generateJSON();
    });

    toolbar.add.addEventListener('click', (e) => {
        newNode(20, 20);
    });

    toolbar.delete.addEventListener('click', (e) => {
        canvas.querySelectorAll('.selected').forEach(el => {
            instance.remove(el.id);
        });
        generateJSON();
    });

    toolbar.export.addEventListener('click', (e) => {
        //document.querySelector('#output').innerText = syntaxHighlight(exportJSON);
        download(generateJSON());
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
        const output = document.querySelector('#output');
        output.classList.toggle('visible');
    });

    const setZoom = (zoom, instance, transformOrigin, el) => {
        transformOrigin = transformOrigin || [ 0.5, 0.5 ];
        instance = instance || jsPlumb;
        el = el || instance.getContainer();
        var p = [ "webkit", "moz", "ms", "o" ],
            s = "scale(" + zoom + ")",
            oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
      
        for (var i = 0; i < p.length; i++) {
          el.style[p[i] + "Transform"] = s;
          //el.style[p[i] + "TransformOrigin"] = oString;
          //el.style[p[i] + "TransformOrigin"] = 'center';
        }
      
        el.style["transform"] = s;
        //el.style["transformOrigin"] = oString;
      
        instance.setZoom(zoom);    
      };
});


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

function syntaxHighlight(json) {
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

function download(data) {
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
