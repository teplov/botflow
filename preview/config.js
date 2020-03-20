window.sberCareChat.init({
    mode: 'full',
    withBot: true,
    jsonSrc: '/data/json/',
    //botScenarioUrl: 'https://chatbotflow.netlify.com/data/elena_bot_4.json',   
    crossOrigin: true,
    videoSrc: '/data/video/', 
    videoQuality: 'sd',
    startForm: "Chat", // 'Chat' | 'Icon'
    mainBundlePath: "./preview/2.1.7/",
    mountContainerId: 'chat_container',
    theme: {
        name: 'default' // "default" | "light" | "dark"
    },
chatVersion: '2.1.7',
headerIsEnabled: false,
domain: "test2.sberbank.ru", // по умолчанию location.host
applicationName: "sberCare",
firstMessage: {
    enable: true,
    format: 'markdown', // plain | markdown
},
apiRestUrl: 'https://messenger-t.sberbank.ru/api/device',
apiWSUrl: 'wss://messenger-t.sberbank.ru/api/',
dictionary: {
    headerTitle: "Связь с банком",
    connectionError: "Пожалуйста, обратитесь в контактный центр, позвоните на номер 900 или +7 495 500-55-50 - для звонков из любой точки мира",
    botName: "Помощник от Сбербанка"
}
});




