window.sberCareChat.init({
    mode: 'full',
    withBot: true,
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
    text:   '![](/images/chatbot_s0061_barabanSmall.gif) Здравствуйте! Я виртуальный помощник от Сбербанка. С радостью отвечу на ваши вопросы!',
    //text:   'Здравствуйте! Я виртуальный помощник от Сбербанка. С радостью отвечу на ваши вопросы!',
    suggestions: [
    {
        text: 'Что умеет помощник?',
        order_id: 0
    },
    {
        text: 'Как оформить карту?',
        order_id: 1
    }
]
},
// apiRestUrl: 'https://messenger.sberbank.ru:7766/api/device',
// apiWSUrl: 'wss://messenger.sberbank.ru:7766/api/',
apiRestUrl: 'https://messenger-t.sberbank.ru:7766/api/device',
apiWSUrl: 'wss://messenger-t.sberbank.ru:7766/api/',
dictionary: {
    headerTitle: "Связь с банком",
    connectionError: "Пожалуйста, обратитесь в контактный центр, позвоните на номер 900 или +7 495 500-55-50 - для звонков из любой точки мира",
    botName: "Помощник от Сбербанка"
}
});