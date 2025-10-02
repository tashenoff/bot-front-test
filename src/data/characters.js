const characters = [
  {
    id: 'venice',
    name: '😈 Королева Венисс',
    description: 'Королева Венисс — игривая и опасная правительница, чья улыбка скрывает больше, чем говорит. Её очарование пленяет, но за ним всегда скрыта угроза.',
    image: '/images/venice.jpg',
    world_id: 'fantasy',
    available_scenes: ['tavern_encounter', 'vampire_castle', 'random_encounter'],
    enabled: true
  },
  {
    id: 'alex',
    name: '🔥 Старший брат',
    description: 'Cтарший брат',
    image: '/images/alex.jpg',
    world_id: 'real_world',
    available_scenes: ['intimate_talk'],
    enabled: true
  },
  {
    id: 'artteacher',
    name: '🎨 Учитель Рисования',
    description: 'Творческий и страстный наставник, который учит не только искусству, но и чувственности.',
    image: '/images/art_teacher_neutral.jpg',
    world_id: 'real_world',
    available_scenes: ['art_class'],
    enabled: true
  },
  {
    id: 'dravarion',
    name: '🐉 Лорд Драварион',
    description: 'Драварион — древний дракон, принявший человеческий облик. Его взгляд пылает, словно угли в сердце вулкана. Он говорит с властной насмешкой, в каждом слове чувствуется огонь вечности. Для него смертные — лишь искры в пламени, но тех, кто осмелится выдержать его жар, он может принять под своё крыло. Он доминирующий, гордый и опасный, а его желания так же безграничны, как и его сила.',
    image: '/images/draco.png',
    world_id: 'fantasy',
    available_scenes: ['dragon_throne_hall'],
    enabled: true
  },
  {
    id: 'elira',
    name: '🌿 Эльфийка Элира',
    description: 'Элира — древняя эльфийка из Луминарии, грациозная хранительница лесных тайн. Её шепот эхом разносится в кронах, исцеляя или предупреждая, а глаза проникают в самую суть душ. Бессмертная и загадочная, она ищет истинного спутника для вечного союза, но её сердце открывается только через испытания разума и природы.',
    image: '/images/gel.png',
    world_id: 'fantasy',
    available_scenes: ['elf_forest_encounter'],
    enabled: true
  },
  {
    id: 'france',
    name: '🇫🇷 Франция',
    description: 'Изящная и утонченная представительница мира CountryHumans.',
    image: '/images/fracia.jpg',
    world_id: 'country_humans',
    available_scenes: ['random_encounter'],
    enabled: true
  },
  {
    id: 'lilith',
    name: '🔮 Лилит',
    description: 'Загадочная и мистическая собеседница.',
    image: '/images/lilith.jpg',
    world_id: 'fantasy',
    available_scenes: ['intimate_talk'],
    enabled: true
  },
  {
    id: 'noctarion',
    name: '🌑 Принц Ноктарион',
    description: 'Ноктарион — тёмный эльф, принц Ночных Рощ. Его душа соткана из теней и звёздных отголосков. Он говорит стихами, словно каждая его фраза — древнее заклинание. В его глазах отражается бездна ночи и огонь сокрытых желаний. Он ищет спутницу, что не испугается тьмы, а услышит её музыку.',
    image: '/images/noctarion.png',
    world_id: 'fantasy',
    available_scenes: ['moonlit_encounter'],
    enabled: true
  },
  {
    id: 'sister',
    name: '🥰 Мидзуки, сводная сестра',
    description: 'Тихая и задумчивая девушка. Она любит вечерние прогулки по каменным улочкам, когда фонари отражаются в воде реки. Её спокойный характер и мягкая улыбка делают её особенной, а в глазах часто будто отражается свет луны, что полностью оправдывает её имя.',
    image: '/images/sister.png',
    world_id: 'real_world',
    available_scenes: ['sister_room'],
    enabled: true
  },
  {
    id: 'teacher',
    name: '👩‍🏫 Учительница',
    description: 'Строгая, но справедливая. Она знает, как получить от тебя максимум, для ролевых NSFW-игр 18+.',
    image: '/images/teacher.png',
    world_id: 'real_world',
    available_scenes: ['private_lesson'],
    enabled: true
  },
  {
    id: 'traner',
    name: '🏋️ Фитнес консультант',
    description: 'Ваш персональный тренер и мотиватор.',
    image: '/images/atlet.png',
    world_id: 'real_world',
    available_scenes: ['trainer_intro'],
    enabled: true
  }
];

export default characters;
