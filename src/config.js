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

export default {
    sourceEndpoint,
    targetEndpoint
};