import type { Format, McQuestion, BuzzerQuestion, BoardCategory, TopRound, GameData } from "./types";

export interface GenTopic {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  formats: Format[];
}

export const GEN_TOPICS: GenTopic[] = [
  { id: "mix", label: "Festive Party Mix", emoji: "🎄", desc: "A fun variety of crowd-pleasing Christmas questions", formats: ["mc", "buzzer", "board", "top"] },
  { id: "funny", label: "Fun & Silly Holiday Facts", emoji: "🎅", desc: "Surprising, hilarious & weird Christmas trivia", formats: ["mc"] },
  { id: "movies", label: "Christmas Movies & TV", emoji: "🎬", desc: "Home Alone, Elf, The Grinch, Die Hard & holiday classics", formats: ["mc", "board"] },
  { id: "music", label: "Holiday Hits & Carols", emoji: "🎵", desc: "Pop Christmas anthems, carols & festive lyrics", formats: ["mc", "board"] },
  { id: "truefalse", label: "True or False: Holiday Hoaxes", emoji: "🤔", desc: "Fast 50/50 Fact or Elf Fiction questions", formats: ["mc"] },
  { id: "kids", label: "Kids & Family Friendly", emoji: "🦌", desc: "Easy, cheerful questions for all ages", formats: ["mc"] },
  { id: "party", label: "Adults & Office Party", emoji: "🥂", desc: "Festive drinks, ugly sweaters & funny holiday habits", formats: ["mc", "top"] },
  { id: "emoji_movies", label: "Emoji Christmas Movies", emoji: "🍿", desc: "Guess the Christmas movie from the emojis", formats: ["buzzer"] },
  { id: "emoji_songs", label: "Emoji Holiday Songs", emoji: "🎶", desc: "Decode famous Christmas songs from emojis", formats: ["buzzer"] },
  { id: "riddles", label: "Santa's Riddles & Brainteasers", emoji: "🎁", desc: "Clever holiday riddles — buzz in when you solve it!", formats: ["buzzer", "board"] },
  { id: "lyrics", label: "Finish the Christmas Lyric", emoji: "🎤", desc: "Belt out or say the missing next line of the song", formats: ["buzzer"] },
  { id: "whoami", label: "Who Am I? Holiday Characters", emoji: "⛄", desc: "Three clues about a famous holiday character", formats: ["buzzer"] },
  { id: "feud_family", label: "Family Christmas Feud", emoji: "👨‍👩‍👧‍👦", desc: "Hilarious survey questions about family holidays", formats: ["top"] },
];

type RawMc = { topic: string; q: string; right: string; wrongs: string[]; time?: number; note?: string };

const MC_BANK: RawMc[] = [
  // FUN & SILLY HOLIDAY FACTS
  {
    topic: "funny",
    q: "What did the US government issue to Santa Claus in 1927 to make sure his Christmas Eve flight was legal?",
    right: "An official pilot's license",
    wrongs: ["A diplomatic passport", "A reindeer parking permit", "A tax exemption form"],
    note: "Assistant Secretary of Commerce William P. MacCracken Jr. gave Santa an official airway chart and pilot's license!"
  },
  {
    topic: "funny",
    q: "In Catalonia (Spain), what does the traditional 'Tió de Nadal' (Christmas Log) do when children sing and tap it with sticks?",
    right: "It 'poops' out nougat and presents",
    wrongs: ["It bursts into colourful fireworks", "It predicts the New Year's weather", "It turns into a chocolate cake"],
    note: "Known affectionately as 'Caga Tió', the smiling wooden log wears a red hat and 'poops' treats under a blanket!"
  },
  {
    topic: "funny",
    q: "Why do people in Venezuela roller-skate to early morning Christmas mass in Caracas?",
    right: "It's a beloved city tradition where streets are closed to cars",
    wrongs: ["Shoes were banned in church in 1890", "To race the priest to the altar", "Because a roller-skating company sponsored Christmas"],
    note: "Kids even tie a string to their big toe and hang it out the window so skaters can tug it as they roll by!"
  },
  {
    topic: "funny",
    q: "Which fast-food chain is so popular for Christmas dinner in Japan that families reserve their buckets months in advance?",
    right: "KFC",
    wrongs: ["McDonald's", "Burger King", "Pizza Hut"],
    note: "The 'Kurisumasu ni wa Kentakkii!' campaign in 1974 turned fried chicken into Japan's #1 Christmas meal."
  },
  {
    topic: "funny",
    q: "Scientifically, why must all of Santa's reindeer actually be female?",
    right: "Male reindeer shed their antlers before Christmas",
    wrongs: ["Only female reindeer can swim in snow", "Male reindeer hibernate in December", "Female reindeer run twice as fast"],
    note: "Male reindeer drop their antlers in late autumn, while females keep theirs all winter!"
  },
  {
    topic: "funny",
    q: "What was the very first song ever broadcast from outer space in December 1965?",
    right: "Jingle Bells",
    wrongs: ["Silent Night", "White Christmas", "Rudolph the Red-Nosed Reindeer"],
    note: "Gemini 6 astronauts Wally Schirra and Tom Stafford pranked Mission Control before playing 'Jingle Bells' on a harmonica and bells!"
  },
  {
    topic: "funny",
    q: "In Iceland, what happens to anyone who doesn't receive at least one new piece of clothing before Christmas Eve?",
    right: "A giant Christmas Cat (Jólakötturinn) eats them",
    wrongs: ["They have to wash all the holiday dishes", "Elves hide their left shoes", "Their chimney gets plugged with snow"],
    note: "The Yule Cat folklore was used to motivate wool workers to finish spinning before the holidays!"
  },
  {
    topic: "funny",
    q: "In Norway, what household item do families hide on Christmas Eve so witches and evil spirits can't steal them for a joyride?",
    right: "Brooms",
    wrongs: ["Vacuum cleaners", "Snow shovels", "Teapots"],
    note: "To this day, many Norwegian homes tuck their brooms into the safest closet on December 24th!"
  },
  {
    topic: "funny",
    q: "Before electric lights were invented, how did people keep candle-lit Christmas trees from catching fire?",
    right: "They kept buckets of water and sand right next to the tree",
    wrongs: ["They soaked the tree in vinegar", "They only lit them outdoors", "They coated every needle in wax"],
    note: "Insurance companies in the late 1800s actually refused to cover house fires caused by Christmas trees!"
  },
  {
    topic: "funny",
    q: "What unusual ornament is hidden on Christmas trees in some families, giving an extra gift to the first child who spots it?",
    right: "A green glass pickle",
    wrongs: ["A golden potato", "A tiny rubber duck", "A silver spoon"],
    note: "The 'Weihnachtsgurke' (Christmas Pickle) is one of the quirky holiday traditions of the 19th century!"
  },
  {
    topic: "funny",
    q: "In Ukraine, finding which creature's web on the Christmas tree is considered a sign of good luck and prosperity?",
    right: "A spider's web",
    wrongs: ["A silkworm cocoon", "A robin's nest", "A bumblebee hive"],
    note: "Ukrainian trees are decorated with sparkling artificial spider webs called 'pavuchky'!"
  },
  {
    topic: "funny",
    q: "What Official Postal Code did Canada Post assign to Santa's workshop at the North Pole?",
    right: "H0H 0H0",
    wrongs: ["X0X 0X0", "S4N 7A1", "E1F 9Z9"],
    note: "Volunteers at Canada Post reply to over a million letters sent to H0H 0H0 every year!"
  },

  // CHRISTMAS MOVIES & TV
  {
    topic: "movies",
    q: "In Home Alone, what do Harry and Marv call their burglary duo?",
    right: "The Wet Bandits",
    wrongs: ["The Snow Bandits", "The Holiday Heisters", "The Chimney Creeps"],
    note: "In Home Alone 2, Marv insists on renaming them 'The Sticky Bandits'!"
  },
  {
    topic: "movies",
    q: "In Elf, what is the first rule of 'The Code of The Elves'?",
    right: "Treat every day like Christmas",
    wrongs: ["Never eat yellow snow", "Always put maple syrup on pasta", "Sing loud for all to hear"],
    note: "Rule #2: There's room for everyone on the Nice List. Rule #3: The best way to spread Christmas cheer is singing loud for all to hear!"
  },
  {
    topic: "movies",
    q: "In National Lampoon's Christmas Vacation, what does Clark Griswold receive instead of his Christmas bonus cheque?",
    right: "A one-year membership to the Jelly of the Month Club",
    wrongs: ["A frozen turkey voucher", "A monogrammed stapler", "A box of fruitcake"],
    note: "Cousin Eddie famously calls it 'the gift that keeps on giving the whole year'!"
  },
  {
    topic: "movies",
    q: "In How the Grinch Stole Christmas, what is the name of the Grinch's loyal dog?",
    right: "Max",
    wrongs: ["Buster", "Barnaby", "Rex"],
    note: "Poor Max has to pull the entire overloaded sleigh with a single antler tied to his head!"
  },
  {
    topic: "movies",
    q: "In The Polar Express, what single word does the conductor punch into the boy's golden ticket at the end?",
    right: "BELIEVE",
    wrongs: ["MAGIC", "CHRISTMAS", "WONDER"],
    note: "Each passenger gets a word representing the lesson they needed most."
  },
  {
    topic: "movies",
    q: "In Die Hard (yes, it's set on Christmas Eve!), what is the name of the Los Angeles skyscraper where the party takes place?",
    right: "Nakatomi Plaza",
    wrongs: ["Gruber Tower", "Century Plaza", "Pacific Heights Tower"],
    note: "The real building is Fox Plaza in Century City, Los Angeles."
  },
  {
    topic: "movies",
    q: "In A Christmas Story, what gift does Ralphie desperately want for Christmas?",
    right: "A Red Ryder BB gun",
    wrongs: ["A Lionel electric train set", "A Schwinn bicycle", "A Decoder Ring"],
    note: "'You'll shoot your eye out, kid!'"
  },
  {
    topic: "movies",
    q: "In Love Actually, which song does aging rocker Billy Mack turn into a Christmas #1 hit?",
    right: "Christmas Is All Around",
    wrongs: ["Love Is Under the Tree", "Rockin' Through the Snow", "Mistletoe & Wine"],
    note: "He accidentally keeps singing the original word 'Love' before correcting it to 'Christmas'!"
  },
  {
    topic: "movies",
    q: "In The Nightmare Before Christmas, what is Jack Skellington's official title?",
    right: "The Pumpkin King",
    wrongs: ["The Skeleton Mayor", "Lord of Halloween", "The Ghost of Bone"],
    note: "When he discovers Christmas Town, he calls Santa Claus 'Sandy Claws'!"
  },
  {
    topic: "movies",
    q: "In The Holiday, Cameron Diaz and Kate Winslet swap homes between Los Angeles and which country?",
    right: "England (Surrey)",
    wrongs: ["Scotland", "Ireland", "France"],
    note: "Rosehill Cottage in Surrey is one of the cosiest Christmas movie settings ever filmed."
  },
  {
    topic: "movies",
    q: "In Jingle All the Way, what is the name of the ultra-rare action figure Arnold Schwarzenegger hunts for on Christmas Eve?",
    right: "Turbo Man",
    wrongs: ["Mega Ranger", "Robo Hero", "Power Max"],
    note: "Nobody wants Turbo Man's sidekick, Booster!"
  },
  {
    topic: "movies",
    q: "In The Santa Clause (1994), how does Scott Calvin (Tim Allen) accidentally become the new Santa?",
    right: "He puts on Santa's suit after Santa falls off his roof",
    wrongs: ["He wins a North Pole raffle", "He signs a contract hidden in a toy box", "He wishes on a shooting star"],
    note: "The fine print on the card reads: 'In putting on the suit and entering the sleigh, the wearer waives any and all rights to any previous identity...'"
  },

  // HOLIDAY HITS & CAROLS
  {
    topic: "music",
    q: "Which Christmas song holds the Guinness World Record as the best-selling physical single of all time?",
    right: "White Christmas — Bing Crosby",
    wrongs: ["All I Want for Christmas Is You — Mariah Carey", "Last Christmas — Wham!", "Silent Night — Elvis Presley"],
    note: "Bing Crosby's 'White Christmas' has sold an estimated 50 million physical copies worldwide!"
  },
  {
    topic: "music",
    q: "In 'The Twelve Days of Christmas', how many total gifts are given if you add up every single day of the song?",
    right: "364 gifts",
    wrongs: ["78 gifts", "144 gifts", "365 gifts"],
    note: "One gift for every day of the year except Christmas Day itself!"
  },
  {
    topic: "music",
    q: "Which holiday song was originally written in 1857 to celebrate Thanksgiving, not Christmas?",
    right: "Jingle Bells",
    wrongs: ["Deck the Halls", "Frosty the Snowman", "Winter Wonderland"],
    note: "James Lord Pierpont titled it 'One Horse Open Sleigh' for a Thanksgiving church program!"
  },
  {
    topic: "music",
    q: "In 'Rockin' Around the Christmas Tree', what kind of pie is mentioned right before 'and some pumpkin pie'?",
    right: "Actually, only pumpkin pie is mentioned!",
    wrongs: ["Apple pie", "Mince pie", "Pecan pie"],
    note: "The lyric is simply: 'Later we'll have some pumpkin pie, and we'll do some caroling!'"
  },
  {
    topic: "music",
    q: "How old was Brenda Lee when she recorded the classic 'Rockin' Around the Christmas Tree' in 1958?",
    right: "13 years old",
    wrongs: ["21 years old", "28 years old", "34 years old"],
    note: "Despite her mature rockabilly voice, she was only 13!"
  },
  {
    topic: "music",
    q: "In 'Santa Baby', what luxury car (and colour!) does the singer ask Santa to leave under the tree?",
    right: "A '54 convertible, too — light blue",
    wrongs: ["A red Cadillac coupe", "A pink Corvette", "A silver Rolls-Royce"],
    note: "Along with a yacht, a sable fur, and the deed to a platinum mine!"
  },
  {
    topic: "music",
    q: "Which reindeer is NEVER mentioned in the song 'Rudolph the Red-Nosed Reindeer', even though he's in 'Frosty the Snowman'?",
    right: "None — all 8 original reindeer are named at the very start!",
    wrongs: ["Blitzen", "Donner", "Comet"],
    note: "'You know Dasher and Dancer and Prancer and Vixen, Comet and Cupid and Donner and Blitzen...'"
  },
  {
    topic: "music",
    q: "In 'Winter Wonderland', who do the singers pretend the snowman in the meadow is before asking if he'll marry them?",
    right: "Parson Brown",
    wrongs: ["Mayor Frost", "Doctor Snow", "Uncle Jack"],
    note: "Later in the song they build a circus clown snowman and knock him down!"
  },

  // TRUE OR FALSE (2 OPTIONS)
  {
    topic: "truefalse",
    q: "TRUE or FALSE: The image of Santa Claus wearing a red suit was invented by Coca-Cola in the 1930s.",
    right: "FALSE — Santa was drawn in red suits decades before Coca-Cola's ads!",
    wrongs: ["TRUE — Santa always wore green until Coca-Cola changed it in 1931"],
    time: 15,
    note: "Thomas Nast and White Rock Beverages depicted red-suited Santa long before Haddon Sundblom's 1931 Coke ads."
  },
  {
    topic: "truefalse",
    q: "TRUE or FALSE: 'Jingle Bells' never actually uses the word 'Christmas' anywhere in its lyrics.",
    right: "TRUE — the word 'Christmas' doesn't appear once!",
    wrongs: ["FALSE — it says 'Merry Christmas' in the second verse"],
    time: 15,
    note: "Check the lyrics — it's all about dashing through the snow in a one-horse open sleigh!"
  },
  {
    topic: "truefalse",
    q: "TRUE or FALSE: Real reindeer eyeballs change colour from gold in the summer to deep blue in the winter.",
    right: "TRUE — it helps them see in the dark Arctic winter!",
    wrongs: ["FALSE — reindeer eyes stay brown all year round"],
    time: 15,
    note: "Their tapetum lucidum shifts wavelength in winter to capture up to 1,000 times more light!"
  },
  {
    topic: "truefalse",
    q: "TRUE or FALSE: Celebrating Christmas was once illegal in Boston, Massachusetts, with a 5-shilling fine.",
    right: "TRUE — the Puritans banned Christmas from 1659 to 1681!",
    wrongs: ["FALSE — Boston hosted America's very first Christmas parade in 1650"],
    time: 15,
    note: "Puritans considered Christmas rowdy and unbiblical, banning it for 22 years!"
  },
  {
    topic: "truefalse",
    q: "TRUE or FALSE: Artificial Christmas trees were originally invented by a company that made toilet brushes.",
    right: "TRUE — the Addis Brush Company used the exact same bristles!",
    wrongs: ["FALSE — they were invented by an umbrella factory in Paris"],
    time: 15,
    note: "In the 1930s, Addis dyed their toilet-brush bristles green and attached them to wire branches!"
  },
  {
    topic: "truefalse",
    q: "TRUE or FALSE: Mistletoe berries are a delicious, sweet snack used to make traditional Christmas jam.",
    right: "FALSE — mistletoe berries are toxic to humans!",
    wrongs: ["TRUE — mistletoe jam is a Victorian delicacy"],
    time: 15,
    note: "Definitely keep mistletoe above your head and off your plate!"
  },

  // KIDS & FAMILY FRIENDLY
  {
    topic: "kids",
    q: "What brings Frosty the Snowman to life?",
    right: "An old silk hat",
    wrongs: ["A magic carrot nose", "A pair of red mittens", "A sprinkle of reindeer dust"],
    time: 20,
    note: "There must have been some magic in that old silk hat they found!"
  },
  {
    topic: "kids",
    q: "What colour is the Grinch?",
    right: "Green",
    wrongs: ["Blue", "Purple", "Red"],
    time: 15,
    note: "And his heart was two sizes too small!"
  },
  {
    topic: "kids",
    q: "What crunchy orange vegetable do people usually use for a snowman's nose?",
    right: "A carrot",
    wrongs: ["A sweet potato", "An orange pepper", "A tangerine"],
    time: 15,
    note: "Just watch out so the rabbits and reindeer don't snack on it!"
  },
  {
    topic: "kids",
    q: "Why wasn't Rudolph allowed to play in any reindeer games at first?",
    right: "Because of his shiny red nose",
    wrongs: ["Because he couldn't fly yet", "Because his antlers were crooked", "Because he slept in late"],
    time: 15,
    note: "Until one foggy Christmas Eve when Santa needed him to guide the sleigh!"
  },
  {
    topic: "kids",
    q: "What do children hang by the fireplace hoping Santa will fill them with small treats?",
    right: "Stockings",
    wrongs: ["Winter boots", "Pillowcases", "Woolly hats"],
    time: 15
  },
  {
    topic: "kids",
    q: "Which cheerful helper builds toys in Santa's workshop at the North Pole?",
    right: "Elves",
    wrongs: ["Penguins", "Polar bears", "Gnomes"],
    time: 15
  },

  // ADULTS & OFFICE PARTY
  {
    topic: "party",
    q: "What spirit is traditionally poured over a British Christmas pudding and set on fire at the table?",
    right: "Brandy",
    wrongs: ["Gin", "Tequila", "Vodka"],
    time: 20,
    note: "Warming the brandy in a ladle first makes the blue flames dance across the pudding!"
  },
  {
    topic: "party",
    q: "According to holiday surveys, what is the #1 most re-gifted Christmas item of all time?",
    right: "Scented candles & bath sets",
    wrongs: ["Novelty socks", "Cookbooks", "Keychains"],
    time: 20,
    note: "Followed closely by boxes of assorted chocolates and bottles of wine!"
  },
  {
    topic: "party",
    q: "What does 'Mulled Wine' (Glühwein) always include besides red wine and sweetener?",
    right: "Warming spices like cinnamon, cloves and citrus",
    wrongs: ["Whipped cream and marshmallows", "Espresso and mint leaves", "Sparkling apple cider and lime"],
    time: 20
  },
  {
    topic: "party",
    q: "In a Secret Santa gift exchange, what is a 'White Elephant' (or Yankee Swap) twist?",
    right: "Players can steal a gift someone else has already unwrapped",
    wrongs: ["Every gift must be wrapped in white paper", "Everyone has to guess who bought their gift", "You can only buy gifts that start with the letter W"],
    time: 20,
    note: "Named after the King of Siam supposedly gifting rare white elephants that were expensive to keep!"
  },
  {
    topic: "party",
    q: "Which country consumes the most Champagne per capita during the Christmas and New Year holidays?",
    right: "France",
    wrongs: ["United States", "Italy", "Australia"],
    time: 20
  },
  {
    topic: "party",
    q: "What is the peak day of the year for couples to break up before Christmas, nicknamed 'Red Tuesday'?",
    right: "Two weeks before Christmas (around December 11th)",
    wrongs: ["December 23rd", "Boxing Day", "December 1st"],
    time: 20,
    note: "Social media data revealed a huge annual spike two weeks before December 25th — right before gift-buying!"
  }
];

type RawBuzzer = { topic: string; q: string; a: string; hint?: string; big?: boolean; points?: number };

const BUZZER_BANK: RawBuzzer[] = [
  // EMOJI CHRISTMAS MOVIES
  { topic: "emoji_movies", q: "🏠 😱 👦 🪤  burglars", a: "Home Alone", hint: "1990 comedy", big: true, points: 100 },
  { topic: "emoji_movies", q: "🧝‍♂️ 🍝 🍁 🏙️ 🎅", a: "Elf", hint: "Will Ferrell classic", big: true, points: 100 },
  { topic: "emoji_movies", q: "💚 👹 🐕 🎄 🏔️", a: "How the Grinch Stole Christmas", hint: "Dr. Seuss story", big: true, points: 100 },
  { topic: "emoji_movies", q: "🚂 🎫 🔔 ❄️ 🎅", a: "The Polar Express", hint: "All aboard!", big: true, points: 100 },
  { topic: "emoji_movies", q: "💀 🎃 ➡️ 🎄 🎅", a: "The Nightmare Before Christmas", hint: "Tim Burton stop-motion", big: true, points: 100 },
  { topic: "emoji_movies", q: "🏢 🦶 🔫 🎄 🚓", a: "Die Hard", hint: "Yippee-ki-yay!", big: true, points: 100 },
  { topic: "emoji_movies", q: "⛄ 🎩 🪄 ☀️ 🏃", a: "Frosty the Snowman", hint: "Animated television special", big: true, points: 100 },
  { topic: "emoji_movies", q: "🦌 🔴 💡 🌫️ 🛷", a: "Rudolph the Red-Nosed Reindeer", hint: "1964 stop-motion classic", big: true, points: 100 },
  { topic: "emoji_movies", q: "👓 👦 🔫 👅 💈", a: "A Christmas Story", hint: "Triple-dog-dare!", big: true, points: 100 },
  { topic: "emoji_movies", q: "🇬🇧 🇺🇸 🏡 🔄 ❤️", a: "The Holiday", hint: "House-swap rom-com", big: true, points: 100 },

  // EMOJI HOLIDAY SONGS
  { topic: "emoji_songs", q: "🔔 🔔 🪨 🎸", a: "Jingle Bell Rock", hint: "1957 Bobby Helms hit", big: true, points: 100 },
  { topic: "emoji_songs", q: "🤫 🌙 ⭐ 😴", a: "Silent Night", hint: "Traditional carol", big: true, points: 100 },
  { topic: "emoji_songs", q: "💔 🎁 ⏮️ 🎄", a: "Last Christmas", hint: "Wham! (1984)", big: true, points: 100 },
  { topic: "emoji_songs", q: "💃 🕺 🔄 🎄", a: "Rockin' Around the Christmas Tree", hint: "Brenda Lee", big: true, points: 100 },
  { topic: "emoji_songs", q: "👀 👩 💋 🎅", a: "I Saw Mommy Kissing Santa Claus", hint: "Underneath the mistletoe last night", big: true, points: 100 },
  { topic: "emoji_songs", q: "👵 💥 🦌 🎄", a: "Grandma Got Run Over by a Reindeer", hint: "Walking home from our house Christmas Eve", big: true, points: 100 },
  { topic: "emoji_songs", q: "❄️ ☃️ 🚶‍♂️ 🌲", a: "Winter Wonderland", hint: "Sleigh bells ring, are you listening?", big: true, points: 100 },
  { topic: "emoji_songs", q: "🎅 👶 🏎️ 💍", a: "Santa Baby", hint: "Slip a sable under the tree for me", big: true, points: 100 },

  // SANTA'S RIDDLES & BRAINTEASERS
  {
    topic: "riddles",
    q: "I drop from the sky and I'm much prettier than rain, yet no two pieces of me will ever look the same. What am I?",
    a: "A snowflake",
    hint: "Winter weather",
    points: 100
  },
  {
    topic: "riddles",
    q: "You can catch me easily in December, especially without a scarf, but you can never throw me. What am I?",
    a: "A cold!",
    hint: "Achoo!",
    points: 100
  },
  {
    topic: "riddles",
    q: "I wear a green coat all year round, even in the snow, and people bring me inside to dress me in gold and lights. What am I?",
    a: "A Christmas tree (evergreen/fir)",
    hint: "In the living room",
    points: 100
  },
  {
    topic: "riddles",
    q: "I have a carrot for a nose, two eyes made out of coal, and I disappear every spring. What am I?",
    a: "A snowman",
    hint: "Built in the yard",
    points: 100
  },
  {
    topic: "riddles",
    q: "If Santa's 8 reindeer each eat 2 carrots before takeoff, and Rudolph eats 3, how many carrots did Santa eat?",
    a: "Zero! (Santa eats cookies, not carrots!)",
    hint: "Listen carefully to the question",
    points: 150
  },
  {
    topic: "riddles",
    q: "What travels all around the world on a single night without ever leaving the corner of an envelope?",
    a: "A Christmas postage stamp",
    hint: "Found on holiday cards",
    points: 150
  },
  {
    topic: "riddles",
    q: "I'm shaped like a shepherd's hook, striped red and white, and get smaller the more you enjoy me. What am I?",
    a: "A candy cane",
    hint: "Peppermint treat",
    points: 100
  },

  // FINISH THE CHRISTMAS LYRIC
  {
    topic: "lyrics",
    q: "\"Chestnuts roasting on an open fire...\"",
    a: "\"Jack Frost nipping at your nose!\"",
    hint: "The Christmas Song (Nat King Cole)",
    points: 100
  },
  {
    topic: "lyrics",
    q: "\"He sees you when you're sleeping, he knows when you're awake...\"",
    a: "\"He knows if you've been bad or good, so be good for goodness sake!\"",
    hint: "Santa Claus Is Comin' to Town",
    points: 100
  },
  {
    topic: "lyrics",
    q: "\"I don't want a lot for Christmas, there is just one thing I need...\"",
    a: "\"I don't care about the presents underneath the Christmas tree!\"",
    hint: "Mariah Carey",
    points: 100
  },
  {
    topic: "lyrics",
    q: "\"Oh the weather outside is frightful, but the fire is so delightful...\"",
    a: "\"And since we've no place to go, let it snow, let it snow, let it snow!\"",
    hint: "Let It Snow!",
    points: 100
  },
  {
    topic: "lyrics",
    q: "\"On the fifth day of Christmas, my true love gave to me...\"",
    a: "\"Five golden rings!\"",
    hint: "The Twelve Days of Christmas",
    points: 100
  },
  {
    topic: "lyrics",
    q: "\"Then one foggy Christmas Eve, Santa came to say...\"",
    a: "\"Rudolph with your nose so bright, won't you guide my sleigh tonight?\"",
    hint: "Rudolph the Red-Nosed Reindeer",
    points: 100
  },

  // WHO AM I? HOLIDAY CHARACTERS
  {
    topic: "whoami",
    q: "1. I was raised at the North Pole by Papa Elf.\n2. I put maple syrup on my spaghetti.\n3. My dad works in the Empire State Building.",
    a: "Buddy the Elf",
    hint: "Played by Will Ferrell",
    points: 100
  },
  {
    topic: "whoami",
    q: "1. I am a miserable, stingy Victorian businessman.\n2. My late partner was Jacob Marley.\n3. Three ghosts visit me on Christmas Eve.",
    a: "Ebenezer Scrooge",
    hint: "A Christmas Carol",
    points: 100
  },
  {
    topic: "whoami",
    q: "1. My family accidentally flew to Paris without me.\n2. I defended my house with paint cans and toy cars.\n3. I love eating lovely cheese pizza.",
    a: "Kevin McCallister",
    hint: "Home Alone",
    points: 100
  },
  {
    topic: "whoami",
    q: "1. I am made of sweet spiced dough.\n2. I have gumdrop buttons.\n3. In Shrek, I scream 'Not the gumdrop buttons!'",
    a: "The Gingerbread Man (Gingy)",
    hint: "Run, run, as fast as you can!",
    points: 100
  }
];

const BOARD_CATEGORY_BANK: Array<{ topic: string; cat: BoardCategory }> = [
  {
    topic: "movies",
    cat: {
      name: "Holiday Blockbusters",
      questions: [
        { value: 100, q: "In Home Alone 2, which city does Kevin accidentally fly to?", a: "New York City" },
        { value: 200, q: "Which actor played 6 different roles in the 2004 animated film The Polar Express?", a: "Tom Hanks" },
        { value: 300, q: "In TheGrinch (2000), who played the live-action Grinch under heavy green prosthetics?", a: "Jim Carrey" },
        { value: 400, q: "In Elf, what toy breaks Buddy's heart every time it pops out of a box during testing?", a: "A Jack-in-the-Box" },
        { value: 500, q: "In It's a Wonderful Life, what is the name of George Bailey's guardian angel?", a: "Clarence (Odbody)" }
      ]
    }
  },
  {
    topic: "music",
    cat: {
      name: "Jingle Jukebox",
      questions: [
        { value: 100, q: "Who sings the 1994 mega-hit 'All I Want for Christmas Is You'?", a: "Mariah Carey" },
        { value: 200, q: "In 'Frosty the Snowman', what were Frosty's two eyes made out of?", a: "Coal" },
        { value: 300, q: "Which Canadian crooner is famous for emerging every November with his 'Christmas' album?", a: "Michael Bublé" },
        { value: 400, q: "Which 1984 charity supergroup recorded 'Do They Know It's Christmas?'?", a: "Band Aid" },
        { value: 500, q: "Which classic Christmas ballet features the 'Dance of the Sugar Plum Fairy'?", a: "The Nutcracker (by Tchaikovsky)" }
      ]
    }
  },
  {
    topic: "riddles",
    cat: {
      name: "North Pole Riddles",
      questions: [
        { value: 100, q: "What has needles by the thousands but cannot sew a single stitch?", a: "A Christmas pine/fir tree" },
        { value: 200, q: "What comes down silently from the sky, never gets hurt, and disappears when the sun comes out?", a: "Snow" },
        { value: 300, q: "What kind of ball doesn't bounce at all?", a: "A snowball!" },
        { value: 400, q: "Which of Santa's reindeer has the worst manners?", a: "Rude-olph!" },
        { value: 500, q: "If an electric train is travelling south from the North Pole at 60 mph, which way does the smoke blow?", a: "Nowhere — it's an electric train!" }
      ]
    }
  },
  {
    topic: "mix",
    cat: {
      name: "Weird Christmas Facts",
      questions: [
        { value: 100, q: "Which red-and-white striped sweet was shaped like a 'J' for Jesus or a shepherd's staff?", a: "A candy cane" },
        { value: 200, q: "In the Southern Hemisphere (like Australia), what season does Christmas fall in?", a: "Summer" },
        { value: 300, q: "Which famous scientist was born on December 25, 1642 (Old Style calendar)?", a: "Sir Isaac Newton" },
        { value: 400, q: "Which US state was the very first to declare Christmas an official holiday in 1836?", a: "Alabama" },
        { value: 500, q: "Which tall landmark did the people of France gift to the US on Christmas Day 1884 (before assembly)?", a: "The Statue of Liberty" }
      ]
    }
  },
  {
    topic: "mix",
    cat: {
      name: "90s & 2000s Toy Craze",
      questions: [
        { value: 100, q: "Which red furry Sesame Street doll caused Christmas store stampedes in 1996 when it laughed?", a: "Tickle Me Elmo" },
        { value: 200, q: "Which owl-like robotic creature spoke 'Furbish' under millions of Christmas trees in 1998?", a: "Furby" },
        { value: 300, q: "Which tiny digital keychain pet needed constant feeding during Christmas break in 1997?", a: "Tamagotchi" },
        { value: 400, q: "Which bean-filled plush animals did people collect in the 90s thinking they'd be worth millions?", a: "Beanie Babies" },
        { value: 500, q: "Which motion-controlled Nintendo console was nearly impossible to find at Christmas 2006?", a: "Nintendo Wii" }
      ]
    }
  },
  {
    topic: "mix",
    cat: {
      name: "Festive Drinks & Treats",
      questions: [
        { value: 100, q: "What hot chocolate topping is white, fluffy, and melts into foam?", a: "Marshmallows" },
        { value: 200, q: "What German spiced wine is served steaming hot at Christmas markets?", a: "Glühwein (Mulled wine)" },
        { value: 300, q: "Which French Christmas cake is rolled and frosted to look like a wooden log?", a: "Bûche de Noël (Yule Log)" },
        { value: 400, q: "What tiny green vegetable on the Christmas dinner plate do people either love or hate?", a: "Brussels sprouts" },
        { value: 500, q: "Which Mexican flower, bright red and green, is the official plant of Christmas?", a: "Poinsettia" }
      ]
    }
  }
];

const TOP_ROUNDS_BANK: Array<{ topic: string; round: TopRound }> = [
  {
    topic: "feud_family",
    round: {
      q: "Name something people pretend to be excited about unwrapping at Christmas",
      answers: [
        { text: "Socks / Underwear", points: 36 },
        { text: "An Ugly Sweater", points: 24 },
        { text: "Bath / Soap Set", points: 16 },
        { text: "Fruitcake", points: 11 },
        { text: "A Self-Help / Diet Book", points: 8 },
        { text: "Deodorant / Aftershave", points: 5 }
      ]
    }
  },
  {
    topic: "feud_family",
    round: {
      q: "Name something that always causes a family argument on Christmas Day",
      answers: [
        { text: "Board Games / Monopoly", points: 32 },
        { text: "Politics at the Dinner Table", points: 25 },
        { text: "What to Watch on TV", points: 17 },
        { text: "Who Does the Dishes", points: 12 },
        { text: "Putting Up the Tree / Lights", points: 8 },
        { text: "When to Open Presents", points: 6 }
      ]
    }
  },
  {
    topic: "feud_family",
    round: {
      q: "Name a reason Santa might get stuck in the chimney",
      answers: [
        { text: "Ate Too Many Cookies", points: 44 },
        { text: "Chimney Is Too Narrow", points: 23 },
        { text: "His Bag of Toys Is Too Big", points: 15 },
        { text: "Someone Lit the Fireplace", points: 10 },
        { text: "His Coat Got Snagged", points: 8 }
      ]
    }
  },
  {
    topic: "feud_family",
    round: {
      q: "Name something a pet dog or cat ruins at Christmas",
      answers: [
        { text: "The Christmas Tree / Ornaments", points: 42 },
        { text: "Wrapping Paper / Ribbons", points: 22 },
        { text: "The Turkey / Christmas Dinner", points: 16 },
        { text: "Cookies Left for Santa", points: 11 },
        { text: "Presents Under the Tree", points: 9 }
      ]
    }
  },
  {
    topic: "party",
    round: {
      q: "Name a last-minute Christmas gift someone buys at a gas station or pharmacy",
      answers: [
        { text: "Gift Card / Lottery Scratchers", points: 38 },
        { text: "Box of Chocolates / Candy", points: 26 },
        { text: "Bottle of Wine / Beer", points: 16 },
        { text: "Flowers", points: 11 },
        { text: "Car Air Freshener / Mug", points: 9 }
      ]
    }
  },
  {
    topic: "party",
    round: {
      q: "Name an excuse people use to leave the office Christmas party early",
      answers: [
        { text: "Babysitter / Kids at Home", points: 34 },
        { text: "Have to Feed the Dog / Pet", points: 23 },
        { text: "Not Feeling Well / Headache", points: 18 },
        { text: "Early Morning Tomorrow", points: 14 },
        { text: "Another Family Party", points: 11 }
      ]
    }
  },
  {
    topic: "feud_family",
    round: {
      q: "Name something you always run out of on Christmas Eve",
      answers: [
        { text: "Scotch Tape", points: 40 },
        { text: "Wrapping Paper", points: 28 },
        { text: "AA / AAA Batteries", points: 17 },
        { text: "Patience / Energy", points: 9 },
        { text: "Wine / Eggnog", points: 6 }
      ]
    }
  },
  {
    topic: "feud_family",
    round: {
      q: "Name a job at the North Pole that nobody wants",
      answers: [
        { text: "Cleaning Reindeer Stables", points: 45 },
        { text: "Checking the Naughty List", points: 20 },
        { text: "Untangling Christmas Lights", points: 15 },
        { text: "Washing Santa's Sooty Suit", points: 12 },
        { text: "Shovelling Snow", points: 8 }
      ]
    }
  }
];

function shuffle<T>(arr: T[]): T[] {
  const c = arr.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

export function generateMcQuestions(topic: string, count: number, existingQuestions: string[] = []): McQuestion[] {
  const seen = new Set(existingQuestions.map((q) => q.trim().toLowerCase()));
  const pool = topic === "mix" ? MC_BANK : MC_BANK.filter((x) => x.topic === topic);
  const fresh = pool.filter((x) => !seen.has(x.q.trim().toLowerCase()));
  const source = fresh.length >= count ? fresh : [...fresh, ...pool.filter((x) => seen.has(x.q.trim().toLowerCase()))];
  return shuffle(source).slice(0, count).map((raw) => {
    const opts = shuffle([raw.right, ...raw.wrongs]);
    return {
      q: raw.q,
      options: opts,
      correct: opts.indexOf(raw.right),
      time: raw.time || 20,
      note: raw.note || ""
    };
  });
}

export function generateBuzzerQuestions(topic: string, count: number, existingQuestions: string[] = []): BuzzerQuestion[] {
  const seen = new Set(existingQuestions.map((q) => q.trim().toLowerCase()));
  const pool = topic === "mix" ? BUZZER_BANK : BUZZER_BANK.filter((x) => x.topic === topic);
  const fresh = pool.filter((x) => !seen.has(x.q.trim().toLowerCase()));
  const source = fresh.length >= count ? fresh : [...fresh, ...pool.filter((x) => seen.has(x.q.trim().toLowerCase()))];
  return shuffle(source).slice(0, count).map((raw) => ({
    q: raw.q,
    a: raw.a,
    hint: raw.hint || "",
    big: !!raw.big,
    points: raw.points ?? 100
  }));
}

export function generateBoardCategories(topic: string, count: number, existingNames: string[] = []): BoardCategory[] {
  const seen = new Set(existingNames.map((n) => n.trim().toLowerCase()));
  const pool = topic === "mix" ? BOARD_CATEGORY_BANK : BOARD_CATEGORY_BANK.filter((x) => x.topic === topic || x.topic === "mix");
  const fresh = pool.filter((x) => !seen.has(x.cat.name.trim().toLowerCase()));
  const source = fresh.length >= count ? fresh : [...fresh, ...BOARD_CATEGORY_BANK];
  return shuffle(source).slice(0, count).map((x) => structuredClone(x.cat));
}

export function generateTopRounds(topic: string, count: number, existingQuestions: string[] = []): TopRound[] {
  const seen = new Set(existingQuestions.map((q) => q.trim().toLowerCase()));
  const pool = topic === "mix" ? TOP_ROUNDS_BANK : TOP_ROUNDS_BANK.filter((x) => x.topic === topic || x.topic === "feud_family");
  const fresh = pool.filter((x) => !seen.has(x.round.q.trim().toLowerCase()));
  const source = fresh.length >= count ? fresh : [...fresh, ...TOP_ROUNDS_BANK];
  return shuffle(source).slice(0, count).map((x) => structuredClone(x.round));
}

export function generateFullGameData(format: Format, topic: string, count: number): GameData {
  if (format === "mc") {
    return { questions: generateMcQuestions(topic, count) };
  }
  if (format === "buzzer") {
    return { questions: generateBuzzerQuestions(topic, count) };
  }
  if (format === "board") {
    return {
      categories: generateBoardCategories(topic, Math.min(5, Math.max(3, count))),
      final: {
        q: "According to the classic poem 'Twas the Night Before Christmas, what were the children's visions dancing in their heads?",
        a: "Sugar-plums"
      }
    };
  }
  return { rounds: generateTopRounds(topic, Math.min(8, Math.max(3, count))) };
}
