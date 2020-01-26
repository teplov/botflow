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
    //isTarget: false,
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
    //isSource: false,
    dragAllowedWhenFull:false
};

const toolbar = {
    blank: document.querySelector('#toolbar .blank'),
    add: document.querySelector('#toolbar .add'),
    delete: document.querySelector('#toolbar .delete'),
    load: document.querySelector('#toolbar .load'),
    export: document.querySelector('#toolbar .export'),
    codeview: document.querySelector('#toolbar .codeview'),
    zoomIn: document.querySelector('#zoomToolbar .zoomIn'),
    zoomValue: document.querySelector('#zoomToolbar .zoomValue'),
    zoomOut: document.querySelector('#zoomToolbar .zoomOut'),
    info: document.querySelector('#zoomToolbar .info'),
};

const panel = {
    output: document.querySelector('#output'),
}

const lang = {
    'EN': {
        nodeLabelDefault: 'Double click to edit',
        connectorLabelDefault: 'Suggest',
        nodeMarkerStart: 'START'
    },
    'RU': {
        nodeLabelDefault: 'Кликни дважды для правки',
        connectorLabelDefault: 'Кнопка',
        nodeMarkerStart: 'НАЧАЛО'
    }
};

const modalEl = {
    window: '#modal-sections',
    saveButton: document.querySelector('#editor_save')
};

export default {
    sourceEndpoint,
    targetEndpoint,
    toolbar,
    panel,
    lang,
    modalEl
};