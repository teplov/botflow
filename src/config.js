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
    addType: document.querySelector('#toolbar .add-type'),
    addVideo: document.querySelector('#toolbar .add_video'),
    addText: document.querySelector('#toolbar .add_text'),
    addLink: document.querySelector('#toolbar .add_link'),
    addAnchor: document.querySelector('#toolbar .add_anchor'),
    addWidget: document.querySelector('#toolbar .add_widget'),
    delete: document.querySelector('#toolbar .delete'),
    load: document.querySelector('#toolbar .load'),
    export: document.querySelector('#toolbar .export'),
    filename: document.querySelector('#toolbar .filename'),
    codeview: document.querySelector('#toolbar .codeview'),
    help: document.querySelector('#toolbar .help'),
    preview: document.querySelector('#toolbar .preview'),
    zoomIn: document.querySelector('#zoomToolbar .zoomIn'),
    zoomValue: document.querySelector('#zoomToolbar .zoomValue'),
    zoomOut: document.querySelector('#zoomToolbar .zoomOut'),
    info: document.querySelector('#zoomToolbar .info'),
    file: document.querySelector('#file'),
};

const ui = {
    overlay: document.querySelector('#overlay'),
    output: document.querySelector('#output'),
    preview: document.querySelector('#preview'),
    help: document.querySelector('#help'),
};

const panel = {
    output: document.querySelector('#output'),
}

const labelColor = {
    'start': 'red',
    'video': 'orange',
    'text': 'grey',
    'link': 'blue',
    'anchor': 'purple',
    'widget': 'green'
};

const labelIcon = {
    'start': 'bolt',
    'video': 'play-circle',
    'text': 'commenting',
    'link': 'link',
    'anchor': 'hashtag',
    'widget': 'nut'
};

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

const appname = 'ChatbotFlow';
const storageScenarionName = 'chatbotflow';
const storageSettingsName = 'chatbotflow_settings';

export default {
    sourceEndpoint,
    targetEndpoint,
    toolbar,
    panel,
    lang,
    modalEl,
    appname,
    storageScenarionName,
    storageSettingsName,
    labelColor,
    labelIcon,
    ui
};