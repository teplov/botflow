window.sberCareChat.init({
    startForm: 'Bot', // 'Chat' | 'Icon' | 'Bot' | 'Elena' | 'Conversations'
    conversations: ['Bot'], //каждый должен быть описан в конфиге | 'Elena'
    applicationName: 'sberCareChat', // для вызова публичных методов
    mainBundlePath: 'https://sbchat.netlify.app/dist/3.1.3/',// путь до js файла
    mountContainerId: 'chat_container', // id контейнера для рендера чата
    size: {
        width: '330px', // string
        height: '600px' // string
    },
    headerIsEnabled: true,
    chatEnabled: true,
    chatInContent: true,
    formsOption: {
        Icon: {
            formAfterClick: 'Bot',
            iconImgUrl: '', // если iconType: 'custom'
            iconPosition: '', //на будущее
            zIndex: 99999,
        },
        Conversations: {
            withPicture: false,
            pictureUrl: 'http://localhost:8080/data/bot.lottie.json',
            title: 'Центр поддержки',
            text: 'С радостью ответим на ваши вопросы в чате! Если бот не сможет помочь – к чату подключиться оператор.'
        },
    },
    Chat: {
        type: 'messanger',
        name: 'Чат',
        iconImgUrl: '', // если iconType: 'custom'
        //apiRestUrl: 'https://sbertele.com/chat_connect' + location.search, // => https://messenger-ift.sberbank.ru/api/device/prelogin/init_session
        apiRestUrl: 'https://messenger-t.sberbank.ru/api/device/auth_prelogin' + location.search, // IFT- messenger-ift.sberbank.ru, PSI- messenger-t.sberbank.ru PROM- messenger.sberbank.ru
        apiWSUrl: 'wss://messenger-t.sberbank.ru/api/', // IFT- messenger-ift.sberbank.ru, PSI- messenger-t.sberbank.ru PROM- messenger.sberbank.ru
        isNewOperatorPlace: false,
        firstMessage: {
            text: 'Здравствуйте! Здесь вы можете задать общие вопросы по продуктам и услугам',
            suggestions: [{
                text: 'Что нового?',
                order_id: 0
            }, {
                text: 'Что это такое?',
                order_id: 1
            }]
        },
        domain: 'sbermobile.ru', // по умолчанию location.host
        browserName: '', // для отправки auth_prelogin
        browserVersion: '', // для отправки auth_prelogin
        chatVersion: '', // для отправки auth_prelogin
        reconnectMaxCount: 2,
        reconnectDuration: 10,
        initTimeout: 30,
        suggestionShowTime: 60,
        dictionary: {
            headerTitle: 'Чат поддержки',
            botName: 'Помощник',
            inputPlaceholder: 'Напишите сообщение...',
            techBreakTitle: 'На данный момент отправка сообщений невозможна',
            techBreakText: 'Попробуйте зайти позже',
        },
    },

    Bot: {
        type: 'chatBotFlow',
        name: 'Ответы на частые вопросы',
        iconImgUrl: '/data/ava.png', // если iconType: 'custom'
        crossOrigin: true,
        //botScenarioName: 'default.json',
        jsonSrc: '/data/json/sample/',
        dictionary: {
            headerTitle: 'Чат поддержки',
            botName: 'Помощник',
            inputPlaceholder: 'Напишите сообщение...',
            techBreakTitle: 'На данный момент отправка сообщений невозможна',
            techBreakText: 'Попробуйте зайти позже',
        },
    },
});