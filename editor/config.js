window.sberCareChat.init({
    startForm: 'Bot', // 'Chat' | 'Icon' | 'Bot' | 'Elena' | 'Conversations'
    conversations: ['Bot'], //каждый должен быть описан в конфиге | 'Elena'
    applicationName: 'sberCareChat', // для вызова публичных методов
    mainBundlePath: 'https://sbchat.netlify.app/dist/latest/',// путь до js файла
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
    Bot: {
        type: 'chatBotFlow',
        name: 'Ответы на частые вопросы',
        iconImgUrl: '/data/ava.png', // если iconType: 'custom'
        crossOrigin: true,
        //botScenarioName: 'default.json',
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