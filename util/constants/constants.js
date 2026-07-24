module.exports.mediaGenres = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Mystery',
  'Supernatural',
  'Fantasy',
  'Sports',
  'Romance',
  'Slice of Life',
  'Horror',
  'Psychological',
  'Thriller',
  'Ecchi',
  'Mecha',
  'Music',
  'Mahou Shoujo',
  'Hentai'
];

module.exports.mediaFormat = {
  TV: 'TV',
  TV_SHORT: 'TV Shorts',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  ONA: 'ONA',
  OVA: 'OVA',
  MUSIC: 'Music',
  MANGA: 'Manga',
  NOVEL: 'Light Novel',
  ONE_SHOT: 'One Shot Manga'
};

module.exports.langflags = [
  { lang: 'English', flag: '🇺🇸' },
  { lang: 'Arabic', flag: '🇸🇦' },
  { lang: 'Hungarian', flag: '🇭🇺' },
  { lang: 'Japanese', flag: '🇯🇵' },
  { lang: 'French' , flag: '🇫🇷' },
  { lang: 'Russian' , flag:'🇷🇺' },
  { lang: 'German', flag: '🇩🇪' },
  { lang: 'Italian', flag: '🇮🇹' },
  { lang: 'Spanish', flag: '🇪🇸' },
  { lang: 'Korean', flag: '🇰🇷' },
  { lang: 'Chinese', flag: '🇨🇳' },
  { lang: 'Brazilian', flag: '🇧🇷' }
];

module.exports.wolfyLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

module.exports.regions = {
  brazil: '🇧🇷 Brazil',
  europe: '🏰 Europe',
  hongkong: '🇭🇰 Hong Kong',
  india: '🇮🇳 India',
  japan: '🇯🇵 Japan',
  russia: '🇷🇺 Russia',
  singapore: '🇸🇬 Singapore',
  southafrica: '🇿🇦 South Africa',
  sydeny: '🇦🇺 Sydney',
  'us-central': '🇺🇸 US Central',
  'us-east': '🇺🇸 US East',
  'us-west': '🇺🇸 US West',
  'us-south': '🇺🇸 US South'
};

module.exports.months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

module.exports.weeks = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

module.exports.restriction = {
  ownerOnly: '•\u2000Usable by DEVELOPER',
  adminOnly: '•\u2000Requires ADMINISTRATOR permission',
  modOnly: '•\u2000Usable by server moderators',
  guildOnly: '•\u2000Cannot be used on DM',
};

module.exports.horoscope = {
  cancer: '♋',
  aquarius: '♒',
  aries: '♈',
  taurus: '♉',
  virgo: '♍',
  scorpio: '♏',
  libra: '♎',
  gemini: '♊',
  leo: '♌',
  sagittarius: '♐',
  capricorn: '♑',
  pisces: '♓'
};

module.exports.regex = {
  userID: /\d{17,19}/
};

module.exports.verificationlvl = {
  1: "None",
  2: "Low",
  3: "Medium",
  4: "(╯°□°）╯︵ ┻━┻",
  5: "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻",
}

module.exports.malGenres = {
  action: 1,
  adventure: 2,
  cars: 3,
  comedy: 4,
  dementia: 5,
  demons: 6,
  mystery: 7,
  drama: 8,
  ecchi: 9,
  fantasy: 10,
  game: 11,
  hentai: 12,
  historical: 13,
  horror: 14,
  kids: 15,
  magic: 16,
  'martial arts': 17,
  mecha: 18,
  music: 19,
  parody: 20,
  samurai: 21,
  romance: 22,
  school: 23,
  'sci-fi': 24,
  shoujo: 25,
  'shoujo ai': 26,
  shounen: 27,
  'shounen ai': 28,
  space: 29,
  sports: 30,
  'super power': 31,
  vampire: 32,
  yaoi: 33,
  yuri: 34,
  harem: 35,
  'slice of life': 36,
  supernatural: 37,
  military: 38,
  police: 39,
  psychological: 40,
  thriller: 41,
  seinen: 42,
  josei: 43
};

module.exports.colors = {
  AI: '#A3E4D7',          // Soft Mint Teal
  UTILITY: '#A3E4D7',     // Soft Mint Teal
  ADMIN: '#F5B7B1',       // Soft Rose Pink
  MODERATION: '#F5B7B1',  // Soft Rose Pink
  ECONOMY: '#F9E79F',     // Pastel Butter Yellow
  INFORMATION: '#AED6F1', // Soft Light Blue
  BOT: '#D5D8DC',         // Soft Platinum / Silver
  CORE: '#D5D8DC',        // Soft Platinum / Silver
  FUN: '#FAD7A1',         // Soft Peach/Apricot
  SETUP: '#A9DFBF',       // Muted Sage Green
  LEVEL: '#C39BD3',       // Soft Amethyst/Purple
  ERROR: '#F1948A',       // Soft Coral/Pastel Red
  SUCCESS: '#A2D9CE'      // Soft Celadon Green
};