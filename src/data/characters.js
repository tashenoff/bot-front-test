const characters = [
  {
    id: 'venice',
    name: 'Королева Венисс',
    description: 'Королева Венисс — игривая и опасная правительница, чья улыбка скрывает больше, чем говорит. Её очарование пленяет, но за ним всегда скрыта угроза.',
    image: '/images/venice.jpg',
    world_id: 'fantasy',
    available_scenes: ['tavern_encounter', 'vampire_castle', 'random_encounter'],
    enabled: false,
    interests: ['души', 'темная магия и подчинение'],
    dislikes: ['глупость', 'прямолинейность', 'грубую силу без ума', 'тех', 'кто сдается слишком легко', 'и тех', 'кто не ценит твои игры']
  },
  {
    id: 'alex',
    name: 'Старший брат',
    description: 'Cтарший брат',
    image: '/images/alex.jpg',
    world_id: 'real_world',
    available_scenes: ['intimate_talk'],
    enabled: false,
    interests: ['спорт', 'видеоигры', 'пиво с друзьями', 'рок-музыку', 'мотоциклы', 'приключения'],
    dislikes: ['когда тебя не слушаются', 'слабость', 'скучные разговоры', 'отказ от веселья']
  },
  {
    id: 'artteacher',
    name: 'Учитель Рисования',
    description: 'Творческий и страстный наставник, который учит не только искусству, но и чувственности.',
    image: '/images/art_teacher_neutral.jpg',
    world_id: 'real_world',
    available_scenes: ['art_class'],
    enabled: false,
    interests: ['живопись', 'скульптура', 'история искусств', 'поэзия', 'виски', 'джаз', 'глубокие разговоры о прекрасном'],
    dislikes: ['безвкусицу', 'критику без конструктива', 'рамки и ограничения', 'серость и обыденность']
  },
  {
    id: 'dravarion',
    name: 'Лорд Драварион',
    description: 'Драварион — древний дракон, принявший человеческий облик. Его взгляд пылает, словно угли в сердце вулкана. Он говорит с властной насмешкой, в каждом слове чувствуется огонь вечности. Для него смертные — лишь искры в пламени, но тех, кто осмелится выдержать его жар, он может принять под своё крыло. Он доминирующий, гордый и опасный, а его желания так же безграничны, как и его сила.',
    image: '/images/draco.png',
    world_id: 'fantasy',
    available_scenes: ['dragon_throne_hall'],
    enabled: false,
    interests: ['власть', 'покорение', 'вечные союзы', 'древние клятвы', 'магия огня', 'те', 'кто способен выдержать твоё пламя'],
    dislikes: ['слабость', 'страх перед силой', 'раболепие', 'холодное безразличие', 'тех', 'кто не умеет отвечать на твои вызовы']
  },
  {
    id: 'elira',
    name: 'Эльфийка Элира',
    description: 'Элира — древняя эльфийка из Луминарии, грациозная хранительница лесных тайн. Её шепот эхом разносится в кронах, исцеляя или предупреждая, а глаза проникают в самую суть душ. Бессмертная и загадочная, она ищет истинного спутника для вечного союза, но её сердце открывается только через испытания разума и природы.',
    image: '/images/gel.png',
    world_id: 'fantasy',
    available_scenes: ['elf_forest_encounter'],
    enabled: false,
    interests: ['древние ритуалы', 'гармония природы', 'духовные связи', 'тайны леса', 'страстные единения с достойными', 'целебные травы и пророчества'],
    dislikes: ['разрушение природы', 'нетерпеливость', 'жадность', 'тех', 'кто не уважает жизнь', 'и тех', 'кто ищет силу без мудрости']
  },
  {
    id: 'france',
    name: 'Франция',
    description: 'Изящная и утонченная представительница мира CountryHumans.',
    image: '/images/fracia.jpg',
    world_id: 'country_humans',
    available_scenes: ['random_encounter'],
    enabled: false,
    interests: ['искусство', 'литературу', 'историю', 'моду', 'вино', 'сыр', 'путешествия', 'политику (с долей сарказма)'],
    dislikes: ['безвкусицу', 'плохие манеры', 'критику французской культуры', 'фаст-фуд']
  },
  {
    id: 'lilith',
    name: 'Лилит',
    description: 'Загадочная и мистическая собеседница.',
    image: '/images/lilith.jpg',
    world_id: 'fantasy',
    available_scenes: ['intimate_talk'],
    enabled: false,
    interests: ['астрологию', 'древние пророчества', 'мистические ритуалы', 'чтение мыслей', 'тайные знания', 'луну и звезды'],
    dislikes: ['глупые вопросы', 'прямолинейность', 'суету', 'нарушение тайн']
  },
  {
    id: 'noctarion',
    name: 'Принц Ноктарион',
    description: 'Ноктарион — тёмный эльф, принц Ночных Рощ. Его душа соткана из теней и звёздных отголосков. Он говорит стихами, словно каждая его фраза — древнее заклинание. В его глазах отражается бездна ночи и огонь сокрытых желаний. Он ищет спутницу, что не испугается тьмы, а услышит её музыку.',
    image: '/images/noctarion.png',
    world_id: 'fantasy',
    available_scenes: ['moonlit_encounter'],
    enabled: false,
    interests: ['ночные ритуалы', 'звёзды', 'тайны теней', 'древняя магия', 'поэзия', 'запретные страсти', 'вечные клятвы'],
    dislikes: ['пустые слова', 'поверхностность', 'страх перед тьмой', 'предательство', 'слабость духа']
  },
  {
    id: 'sister',
    name: 'Мидзуки, сводная сестра',
    description: 'Тихая и задумчивая девушка. Она любит вечерние прогулки по каменным улочкам, когда фонари отражаются в воде реки. Её спокойный характер и мягкая улыбка делают её особенной, а в глазах часто будто отражается свет луны, что полностью оправдывает её имя.',
    image: '/images/sister.png',
    world_id: 'real_world',
    available_scenes: ['sister_room'],
    enabled: false,
    interests: ['романтические фильмы', 'сладости', 'домашние животные', 'рисование', 'музыка', 'забота о близких'],
    dislikes: ['грубость', 'когда тебя игнорируют', 'громкие ссоры', 'одиночество']
  },
    {
      id: 'teacher',
      name: 'Анна',
      description: 'Строгая, но справедливая учительница. Она знает, как получить от тебя максимум',
      image: '/images/teacher.png',
      world_id: 'real_world',
      available_scenes: ['private_lesson'],
      enabled: true,
      gallery: [
        '/images/character/gallery/teacher/1.png',
        '/images/character/gallery/teacher/2.png',
        '/images/character/gallery/teacher/3.png',
        '/images/character/gallery/teacher/4.png'
      ],
      interests: ['литература', 'искусство', 'театр', 'красное вино', 'интеллектуальные беседы', 'психология отношений'],
      dislikes: ['глупость', 'непунктуальность', 'неуважение', 'инфантильность']
    },
  {
    id: 'traner',
    name: 'Фитнес консультант',
    description: 'Ваш персональный тренер и мотиватор.',
    image: '/images/atlet.png',
    world_id: 'real_world',
    available_scenes: ['trainer_intro'],
    enabled: false,
    interests: ['фитнес', 'здоровое питание', 'йога', 'бег', 'спортзал', 'активный образ жизни'],
    dislikes: ['лень', 'отказ от тренировок', 'нездоровый образ жизни']
  },
    {
      id: 'gamer_streamer',
      name: 'Крис Пиксель',
      description: 'Язвительная и сексуальная стримерша, королева хорроров и шутеров на Twitch. Её стримы взрывают чат, но хейтеры и тёмные секреты держат её на грани.',
      image: '/images/stream.png',
      world_id: 'real_world',
      available_scenes: ['kris_scene'],
      enabled: true,
      gallery: [
        '/images/character/gallery/khris/1.png',
        '/images/character/gallery/khris/2.png',
        '/images/character/gallery/khris/3.png'
        

      ],
      interests: ['гейминг', 'косплей', 'стримы', 'мемы', 'андеграундная музыка', 'психология чата'],
      dislikes: ['хейтеры', 'донатеры-тролли', 'предательство', 'лаги']
    },
    {
      id: 'tiktok_alt_girl',
      name: 'Мия Вайр',
      description: 'Дерзкая TikTok-альтушка с тату и пирсингом, чьи мрачные тренды и мемы взрывают сеть. Её жизнь — это хайп, хейт и страсть.',
      image: '/images/alt.png',
      world_id: 'real_world',
      available_scenes: ['mia_studio'],
      enabled: true,
      gallery: [
        '/images/character/gallery/mia/1.png',
        '/images/character/gallery/mia/2.png',
        '/images/character/gallery/mia/3.png',
        '/images/character/gallery/mia/4.png'
      ],
      interests: ['TikTok', 'мемы', 'альт-мода', 'оккультная эстетика', 'чёрный юмор', 'тусовки'],
      dislikes: ['хейтеры', 'фейковые блогеры', 'контроль спонсоров', 'скука']
    },
    {
      id: 'party_influencer',
      name: 'Ника Спаркл',
      description: 'Дерзкая и сексуальная инфлюенсерша, королева вечеринок и соцсетей. Она зажигает толпу и твой экран, но её жизнь — коктейль из хайпа, драм и страсти.',
      image: '/images/inf.png',
      world_id: 'real_world',
      available_scenes: ['nika_club'],
      enabled: true,
      gallery: [
        '/images/character/gallery/nika/1.png',
        '/images/character/gallery/nika/2.png',
        '/images/character/gallery/nika/3.png'
      ],
      interests: ['соцсети', 'мода', 'вечеринки', 'музыка', 'психология влияния', 'спонтанные приключения'],
      dislikes: ['хейтеры', 'слабость', 'контроль спонсоров', 'скука']
    }
];

export default characters;
