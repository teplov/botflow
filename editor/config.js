window.sberCareChat.init({
    startForm: 'Bot', // 'Chat' | 'Icon' | 'Bot' | 'Elena' | 'Conversations'
    conversations: ['Bot'], //каждый должен быть описан в конфиге | 'Elena'
    applicationName: 'sberCareChat', // для вызова публичных методов
    mainBundlePath: 'https://sbchat.netlify.app/dist/4.0.12/',// путь до js файла
    mountContainerId: 'retailChat-container', // id контейнера для рендера чата
    headerIsEnabled: true,
    chatEnabled: true,
    chatInContent: true,
    formsOption: {
        Icon: {
            formAfterClick: 'Bot',
            iconImgUrl: '', // если iconType: 'custom'
        },
        Conversations: {
            withPicture: false,
            title: 'Центр поддержки',
            text: 'С радостью ответим на ваши вопросы в чате! Если бот не сможет помочь – к чату подключиться оператор.'
        },
    },
    Chat: {
        type: 'messanger',
        name: 'Сбербанк',
        iconImgUrl: '', // если iconType: 'custom'
        apiRestUrl: 'https://messenger.sberbank.ru/api/device/auth_prelogin', // IFT- messenger-ift.sberbank.ru, PSI- messenger-t.sberbank.ru PROM- messenger.sberbank.ru
        apiWSUrl: 'wss://messenger.sberbank.ru/api/', // IFT- messenger-ift.sberbank.ru, PSI- messenger-t.sberbank.ru PROM- messenger.sberbank.ru
        isNewOperatorPlace: false,
        withAnimation: true,
        firstMessage: {
            text: 'Здравствуйте! Здесь вы можете задать общие вопросы по новой трубе',
            suggestions: [{
                text: 'Что нового?',
                order_id: 0
            }, {
                text: 'Что это такое?',
                order_id: 1
            }]
        },
        domain: 'sberbank.ru', // по умолчанию location.host
        browserName: '', // для отправки auth_prelogin
        browserVersion: '', // для отправки auth_prelogin
        chatVersion: '', // для отправки auth_prelogin
        reconnectMaxCount: 2,
        reconnectDuration: 10,
        initTimeout: 30,
        suggestionShowTime: 60,
        dictionary: {
            headerTitle: 'Чат Х',
            botName: 'Помощник по чатам Х',
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
        botScenarioName: 'default.json',
        jsonSrc: '/data/json/sample/',
        videoSrc: '/data/video/', 
        //videoSrc: 'https://messenger-ift.sberbank.ru:8877/api/public/media/getVideo/', 
        videoQuality: 'sd',
        dictionary: {
            headerTitle: 'Чат поддержки',
            botName: 'Помощник',
            inputPlaceholder: 'Напишите сообщение...',
            techBreakTitle: 'На данный момент отправка сообщений невозможна',
            techBreakText: 'Попробуйте зайти позже',
        },
    },
});