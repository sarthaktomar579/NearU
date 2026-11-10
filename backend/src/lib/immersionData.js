/**
 * High-quality multilingual linguistic database
 * Contains words of the day, cultural idioms, slang, and conversation icebreakers
 * for all languages supported in NearU.
 */

export const IMMERSION_DATABASE = {
  spanish: [
    {
      word: "Sobremesa",
      phonetic: "[so-bre-me-sa]",
      partOfSpeech: "noun",
      meaning: "The time spent lingering around the table engaged in conversation after a meal.",
      example: "Nos quedamos dos horas de sobremesa contando anécdotas divertidas.",
      exampleTranslation: "We spent two hours lingering at the table telling funny stories.",
      idiom: {
        phrase: "Estar en las nubes",
        literalTranslation: "To be in the clouds",
        actualMeaning: "To be daydreaming or lost in one's thoughts",
        example: "¿Me estás escuchando o estás en las nubes?",
        exampleTranslation: "Are you listening to me or are you daydreaming?",
      },
      slang: {
        term: "Buena onda",
        meaning: "Cool / great vibe / friendly",
        example: "Tu amigo es muy buena onda.",
      },
      icebreaker: {
        question: "¿Cuál es tu comida tradicional favorita y qué recuerdos te trae?",
        translation: "What is your favorite traditional meal and what memories does it bring?",
        prompt: "¡Hola! Estaba aprendiendo la palabra 'Sobremesa' hoy. ¿Cuál es tu plato favorito para disfrutar con amigos?",
      },
    },
    {
      word: "Madrugar",
      phonetic: "[ma-dru-gar]",
      partOfSpeech: "verb",
      meaning: "To wake up very early in the morning.",
      example: "Mañana tengo que madrugar para aprovechar el día.",
      exampleTranslation: "Tomorrow I have to wake up early to make the most of the day.",
      idiom: {
        phrase: "Tomar el pelo",
        literalTranslation: "To take the hair",
        actualMeaning: "To pull someone's leg / tease someone",
        example: "No te enfades, solo te estaba tomando el pelo.",
        exampleTranslation: "Don't get upset, I was just pulling your leg.",
      },
      slang: {
        term: "Chulo / Chula",
        meaning: "Cool, pretty, neat",
        example: "¡Qué zapatos tan chulos llevas!",
      },
      icebreaker: {
        question: "¿Eres una persona madrugadora o nocturna?",
        translation: "Are you an early bird or a night owl?",
        prompt: "¡Hola! Una pregunta rápida para romper el hielo: ¿eres más de madrugar o de trasnochar?",
      },
    },
    {
      word: "Estrenar",
      phonetic: "[es-tre-nar]",
      partOfSpeech: "verb",
      meaning: "To wear or use something for the very first time.",
      example: "Hoy voy a estrenar los zapatos nuevos.",
      exampleTranslation: "Today I'm wearing my new shoes for the first time.",
      idiom: {
        phrase: "Ponerse las pilas",
        literalTranslation: "To put in your batteries",
        actualMeaning: "To get your act together / get energized",
        example: "Tenemos mucho que hacer, ¡hay que ponerse las pilas!",
        exampleTranslation: "We have a lot to do, let's get our act together!",
      },
      slang: {
        term: "Mola",
        meaning: "It's cool / I like it (Spain)",
        example: "Esa canción mola un montón.",
      },
      icebreaker: {
        question: "¿Cuál fue el último lugar que estrenaste visitando?",
        translation: "What was the latest place you visited for the first time?",
        prompt: "¡Hola! Me encanta intercambiar idiomas contigo. ¿Cuál es un lugar nuevo que hayas visitado recientemente?",
      },
    },
  ],

  french: [
    {
      word: "Flâner",
      phonetic: "[fla-ne]",
      partOfSpeech: "verb",
      meaning: "To stroll leisurely without any specific destination, soaking in the atmosphere.",
      example: "J'adore flâner le long de la Seine le dimanche après-midi.",
      exampleTranslation: "I love strolling along the Seine on Sunday afternoons.",
      idiom: {
        phrase: "Poser un lapin",
        literalTranslation: "To put down a rabbit",
        actualMeaning: "To stand someone up / fail to meet as agreed",
        example: "Il n'est jamais venu au café, il m'a posé un lapin !",
        exampleTranslation: "He never showed up at the cafe, he stood me up!",
      },
      slang: {
        term: "C'est ouf",
        meaning: "That's crazy / incredible (verlan slang)",
        example: "Cette vue sur la ville, c'est un truc de ouf !",
      },
      icebreaker: {
        question: "Quel est ton quartier ou endroit préféré pour te promener ?",
        translation: "What is your favorite neighborhood or place to stroll around?",
        prompt: "Salut ! J'ai appris le mot 'Flâner' aujourd'hui. Quel est ton endroit préféré pour te balader dans ta ville ?",
      },
    },
    {
      word: "Retrouvailles",
      phonetic: "[ʁə.tʁu.vaj]",
      partOfSpeech: "noun",
      meaning: "The happiness of meeting someone again after a long period of separation.",
      example: "Nos retrouvailles à la gare étaient très émouvantes.",
      exampleTranslation: "Our reunion at the train station was very moving.",
      idiom: {
        phrase: "Avoir le coup de foudre",
        literalTranslation: "To have a lightning strike",
        actualMeaning: "Love at first sight / sudden intense passion",
        example: "Quand j'ai visité cette ville, j'ai eu un vrai coup de foudre.",
        exampleTranslation: "When I visited this city, it was love at first sight.",
      },
      slang: {
        term: "Stylé",
        meaning: "Classy, stylish, cool",
        example: "Ton nouvel appartement est super stylé !",
      },
      icebreaker: {
        question: "Quel est le voyage qui t'a le plus marqué ?",
        translation: "Which trip has made the biggest impression on you?",
        prompt: "Salut ! Si tu pouvais revivre un souvenir de voyage mémorable, lequel choisirais-tu ?",
      },
    },
  ],

  german: [
    {
      word: "Fernweh",
      phonetic: "[fɛʁn-veː]",
      partOfSpeech: "noun",
      meaning: "An intense longing for distant places; the opposite of homesickness (wanderlust).",
      example: "Wenn ich alte Fotos ansehe, packt mich sofort das Fernweh.",
      exampleTranslation: "When I look at old photos, wanderlust grabs hold of me immediately.",
      idiom: {
        phrase: "Ich verstehe nur Bahnhof",
        literalTranslation: "I only understand train station",
        actualMeaning: "It's all Greek to me / I don't understand anything",
        example: "Er sprach so schnell, ich habe nur Bahnhof verstanden.",
        exampleTranslation: "He spoke so fast, I didn't understand a single word.",
      },
      slang: {
        term: "Krass",
        meaning: "Intense, extreme, awesome",
        example: "Das Konzert gestern war echt krass!",
      },
      icebreaker: {
        question: "In welches Land möchtest du als Nächstes reisen?",
        translation: "Which country would you like to travel to next?",
        prompt: "Hallo! Ich habe heute das Wort 'Fernweh' gelernt. Welches Reiseziel steht ganz oben auf deiner Liste?",
      },
    },
    {
      word: "Gemütlichkeit",
      phonetic: "[ɡəˈmyːtlɪçkaɪt]",
      partOfSpeech: "noun",
      meaning: "A state of warmth, friendliness, coziness, and good cheer.",
      example: "Der Abend am Kaminfeuer war voller Gemütlichkeit.",
      exampleTranslation: "The evening by the fireplace was full of coziness.",
      idiom: {
        phrase: "Daumen drücken",
        literalTranslation: "To press thumbs",
        actualMeaning: "To cross your fingers / wish good luck",
        example: "Ich drücke dir für die Prüfung ganz fest die Daumen!",
        exampleTranslation: "I'll keep my fingers crossed for your exam!",
      },
      slang: {
        term: "Na?",
        meaning: "Hey, what's up? How are things? (quintessential German greeting)",
        example: "Na, wie läuft dein Tag?",
      },
      icebreaker: {
        question: "Wie sieht für dich ein perfekter gemütlicher Sonntag aus?",
        translation: "What does a perfect cozy Sunday look like for you?",
        prompt: "Hallo! Was ist deine liebste Art, dich an einem freien Tag zu entspannen?",
      },
    },
  ],

  japanese: [
    {
      word: "木漏れ日 (Komorebi)",
      phonetic: "[ko-mo-re-bi]",
      partOfSpeech: "noun",
      meaning: "The sunlight filtering gently through the leaves of trees.",
      example: "午後の公園で、木漏れ日を感じながら本を読みました。",
      exampleTranslation: "In the afternoon park, I read a book feeling the dappled sunlight through the leaves.",
      idiom: {
        phrase: "猫の手も借りたい (Neko no te mo karitai)",
        literalTranslation: "Willing to borrow even a cat's paw",
        actualMeaning: "Extremely busy and desperate for any help",
        example: "今週は仕事が忙しくて、猫の手も借りたいです。",
        exampleTranslation: "Work is so busy this week that I'd take help from anyone.",
      },
      slang: {
        term: "ヤバい (Yabai)",
        meaning: "Crazy, incredible, dangerous, amazing (versatile slang)",
        example: "このラーメン、マジでヤバい！",
      },
      icebreaker: {
        question: "日本のアニメや音楽で一番好きな作品は何ですか？",
        translation: "What is your favorite Japanese anime, movie, or song?",
        prompt: "こんにちは！日本語を勉強しています。あなたのおすすめのアニメや映画はありますか？",
      },
    },
    {
      word: "一期一会 (Ichigo Ichie)",
      phonetic: "[i-chi-go i-chi-e]",
      partOfSpeech: "proverb / noun",
      meaning: "Treasure every unrepeatable encounter, for it happens only once in a lifetime.",
      example: "旅先での出会いは一期一会を大切にしたいですね。",
      exampleTranslation: "I want to treasure encounters while traveling as once-in-a-lifetime moments.",
      idiom: {
        phrase: "猿も木から落ちる (Saru mo ki kara ochiru)",
        literalTranslation: "Even monkeys fall from trees",
        actualMeaning: "Even experts make mistakes",
        example: "ミスしても気にしないで、猿も木から落ちるって言うよ。",
        exampleTranslation: "Don't worry about the mistake; even monkeys fall from trees.",
      },
      slang: {
        term: "ウケる (Ukeru)",
        meaning: "Hilarious / that cracks me up",
        example: "その話、めっちゃウケる！",
      },
      icebreaker: {
        question: "最近何か新しいことを始めましたか？",
        translation: "Have you started anything new recently?",
        prompt: "こんにちは！今日はどんな一日でしたか？",
      },
    },
  ],

  italian: [
    {
      word: "Mozzafiato",
      phonetic: "[mot-tsa-fja-to]",
      partOfSpeech: "adjective",
      meaning: "Breathtaking; so stunning that it takes your breath away.",
      example: "Il tramonto sul mare a Positano era assolutamente mozzafiato.",
      exampleTranslation: "The sunset over the sea in Positano was absolutely breathtaking.",
      idiom: {
        phrase: "In bocca al lupo",
        literalTranslation: "Into the wolf's mouth",
        actualMeaning: "Good luck! (reply with 'Crepi il lupo!' - may the wolf die)",
        example: "Domani hai il colloquio? In bocca al lupo!",
        exampleTranslation: "You have the interview tomorrow? Good luck!",
      },
      slang: {
        term: "Che figata",
        meaning: "How cool! / What an awesome thing!",
        example: "Andiamo al concerto insieme? Che figata!",
      },
      icebreaker: {
        question: "Qual è il piatto italiano che ti riesce meglio cucinare?",
        translation: "Which Italian dish do you cook best?",
        prompt: "Ciao! Ho imparato la parola 'Mozzafiato'. Qual è il posto più bello che tu abbia mai visto?",
      },
    },
  ],

  korean: [
    {
      word: "정 (Jeong)",
      phonetic: "[dʒʌŋ]",
      partOfSpeech: "noun",
      meaning: "A deep emotional bond, warm affection, and unspoken connection cultivated over time.",
      example: "우리는 함께 일하며 서로 정이 많이 들었어요.",
      exampleTranslation: "Working together, we built a deep bond of warm affection.",
      idiom: {
        phrase: "눈이 높다 (Nuni nopda)",
        literalTranslation: "Eyes are high",
        actualMeaning: "To have high standards / picky taste",
        example: "그 친구는 눈이 너무 높아서 연애하기 힘들어요.",
        exampleTranslation: "That friend has such high standards that it's hard to find a date.",
      },
      slang: {
        term: "대박 (Daebak)",
        meaning: "Jackpot! / Awesome! / Wow!",
        example: "시험 100점 받았어? 대박!",
      },
      icebreaker: {
        question: "가장 좋아하는 한국 음식이나 K-drama는 무엇인가요?",
        translation: "What is your favorite Korean food or K-drama?",
        prompt: "안녕하세요! 한국어를 배우고 있어요. 추천하고 싶은 한국 드라마나 노래가 있나요?",
      },
    },
  ],

  hindi: [
    {
      word: "जुगाड़ (Jugaad)",
      phonetic: "[ju-gaad]",
      partOfSpeech: "noun",
      meaning: "An ingenious, resourceful hack or frugal solution to a complex problem.",
      example: "चिंता मत करो, हम कुछ न कुछ जुगाड़ निकाल लेंगे।",
      exampleTranslation: "Don't worry, we will figure out a clever workaround.",
      idiom: {
        phrase: "दाल में कुछ काला है (Daal mein kuch kaala hai)",
        literalTranslation: "There is something black in the lentils",
        actualMeaning: "Something is suspicious or fishy",
        example: "वह इतनी तारीफ़ क्यों कर रहा है? दाल में कुछ काला है।",
        exampleTranslation: "Why is he praising so much? Something is fishy.",
      },
      slang: {
        term: "बिंदास (Bindaas)",
        meaning: "Cool, carefree, without hesitation",
        example: "वह हमेशा बिंदास रहता है।",
      },
      icebreaker: {
        question: "आपकी पसंदीदा भारतीय मिठाई कौन सी है?",
        translation: "What is your favorite Indian sweet or festival?",
        prompt: "नमस्ते! आज मैंने 'जुगाड़' शब्द सीखा। आप अपनी पसंदीदा मिठाई के बारे में बताएंगे?",
      },
    },
  ],

  mandarin: [
    {
      word: "缘分 (Yuánfèn)",
      phonetic: "[yüan-fen]",
      partOfSpeech: "noun",
      meaning: "The fateful serendipity or destined affinity that brings people together.",
      example: "我们能在这里认识，真是一种特别的缘分。",
      exampleTranslation: "That we could meet here is truly a special destined coincidence.",
      idiom: {
        phrase: "半途而废 (Bàn tú ér fèi)",
        literalTranslation: "To give up halfway along the road",
        actualMeaning: "To abandon an endeavor without finishing",
        example: "学语言最重要的就是坚持，不能半途而废。",
        exampleTranslation: "In language learning the most important thing is perseverance, never giving up halfway.",
      },
      slang: {
        term: "给力 (Gěilì)",
        meaning: "Awesome, effective, cool, energizing",
        example: "今天大家的工作都很给力！",
      },
      icebreaker: {
        question: "你最喜欢中国的哪个城市或美食？",
        translation: "Which Chinese city or food do you like the most?",
        prompt: "你好！今天学了'缘分'这个词。很高兴在这里遇到你，你平时喜欢喝茶还是咖啡？",
      },
    },
  ],

  english: [
    {
      word: "Serendipity",
      phonetic: "[ˌser.ənˈdɪp.ə.ti]",
      partOfSpeech: "noun",
      meaning: "The occurrence of finding valuable or pleasant things by chance in a happy way.",
      example: "Finding this cozy language cafe was pure serendipity.",
      exampleTranslation: "Descubrir este acogedor café fue pura casualidad afortunada.",
      idiom: {
        phrase: "Break the ice",
        literalTranslation: "To crack the frozen water",
        actualMeaning: "To start a conversation and make people feel comfortable",
        example: "He told a funny joke to break the ice with the new team.",
        exampleTranslation: "He told a joke to ease the tension with the new team.",
      },
      slang: {
        term: "No worries",
        meaning: "It's all good / you're welcome / don't stress",
        example: "Thanks for the help! - No worries at all!",
      },
      icebreaker: {
        question: "What is a book, movie, or song that recently inspired you?",
        translation: "¿Qué libro, película o canción te ha inspirado recientemente?",
        prompt: "Hey there! Looking forward to practicing. What's a song or movie you've been enjoying lately?",
      },
    },
  ],
};

// Fallback generator for languages not in the primary custom list
export function getFallbackLanguageData(language) {
  const langLower = (language || "english").toLowerCase();

  if (IMMERSION_DATABASE[langLower]) {
    const list = IMMERSION_DATABASE[langLower];
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % list.length;
    return list[index];
  }

  // Generic universal fallback
  return {
    word: "Hello / Hola / Bonjour",
    phonetic: "[həˈloʊ]",
    partOfSpeech: "interjection",
    meaning: "The universal greeting to spark new connections and bridge cultures.",
    example: "A simple hello can lead to a million wonderful conversations.",
    exampleTranslation: "Un simple saludo puede abrir la puerta a un millón de conversaciones.",
    idiom: {
      phrase: "Break the ice",
      literalTranslation: "Romper el hielo",
      actualMeaning: "To overcome awkwardness and start a friendly dialogue",
      example: "Let's break the ice by introducing ourselves!",
      exampleTranslation: "¡Vamos a romper el hielo presentándonos!",
    },
    slang: {
      term: "Catch up",
      meaning: "To talk with someone and hear their latest news",
      example: "Let's catch up over coffee this afternoon.",
    },
    icebreaker: {
      question: "What motivated you to start learning this language?",
      translation: "¿Qué te motivó a empezar a aprender este idioma?",
      prompt: `Hello! I see you are learning ${language}. What inspired you to pick up this language?`,
    },
  };
}
