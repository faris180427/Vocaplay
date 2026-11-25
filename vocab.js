/* ==============================================================
   VOCAPLAY LEXICAL CORPUS (80 CURATED CEFR A1–C1 ENTRIES)
   ============================================================== */
const BASE_VOCAB_DATA = [
  // ================= CEFR A1 (16 Words) =================
  {
    id: 'a1_01', word: 'apple', cefr: 'A1', category: 'Food', emoji: '🍎',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈæp.əl/', meaning: 'Apel',
    definition: 'A round fruit with red, yellow, or green skin and crisp white flesh.',
    distractors: ['e', 'u', 'k'], synonym: 'pome fruit', antonym: 'meat',
    sentence: ['He', 'eats', 'a fresh apple', 'every morning'],
    sentenceIndo: 'Dia memakan apel segar setiap pagi.'
  },
  {
    id: 'a1_02', word: 'elephant', cefr: 'A1', category: 'Animals', emoji: '🐘',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈel.ə.fənt/', meaning: 'Gajah',
    definition: 'A very large plant-eating mammal with a long trunk and tusks.',
    distractors: ['b', 'r', 'k'], synonym: 'pachyderm', antonym: 'mouse',
    sentence: ['The big elephant', 'walks slowly', 'in the wild forest'],
    sentenceIndo: 'Gajah besar itu berjalan perlahan di hutan rimba.'
  },
  {
    id: 'a1_03', word: 'guitar', cefr: 'A1', category: 'Objects', emoji: '🎸',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ɡɪˈtɑːr/', meaning: 'Gitar',
    definition: 'A musical instrument with six strings played with fingers or a pick.',
    distractors: ['e', 'o', 'd'], synonym: 'lute', antonym: 'drum',
    sentence: ['She plays', 'the acoustic guitar', 'beautifully tonight'],
    sentenceIndo: 'Dia memainkan gitar akustik dengan indah malam ini.'
  },
  {
    id: 'a1_04', word: 'book', cefr: 'A1', category: 'Objects', emoji: '📖',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    phonetic: '/bʊk/', meaning: 'Buku',
    definition: 'A set of printed pages fastened together inside a cover.',
    distractors: ['a', 't', 'p'], synonym: 'volume', antonym: 'screen',
    sentence: ['I read', 'an interesting book', 'before sleeping'],
    sentenceIndo: 'Saya membaca buku yang menarik sebelum tidur.'
  },
  {
    id: 'a1_05', word: 'water', cefr: 'A1', category: 'Food', emoji: '💧',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈwɔː.tər/', meaning: 'Air',
    definition: 'A clear, colorless liquid essential for all living things.',
    distractors: ['s', 'm', 'n'], synonym: 'liquid', antonym: 'fire',
    sentence: ['Drink pure water', 'to keep', 'your body healthy'],
    sentenceIndo: 'Minumlah air murni untuk menjaga tubuhmu tetap sehat.'
  },
  {
    id: 'a1_06', word: 'banana', cefr: 'A1', category: 'Food', emoji: '🍌',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/bəˈnæn.ə/', meaning: 'Pisang',
    definition: 'A long curved fruit with yellow skin and soft sweet flesh.',
    distractors: ['o', 'e', 't'], synonym: 'plantain', antonym: 'lemon',
    sentence: ['Monkeys like', 'to peel and eat', 'sweet bananas'],
    sentenceIndo: 'Monyet suka mengupas dan memakan pisang manis.'
  },
  {
    id: 'a1_07', word: 'cat', cefr: 'A1', category: 'Animals', emoji: '🐱',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
    phonetic: '/kæt/', meaning: 'Kucing',
    definition: 'A small furry domestic mammal with whiskers and sharp claws.',
    distractors: ['b', 'o', 'r'], synonym: 'feline', antonym: 'dog',
    sentence: ['The white cat', 'sleeps quietly', 'on the warm sofa'],
    sentenceIndo: 'Kucing putih itu tidur dengan tenang di sofa hangat.'
  },
  {
    id: 'a1_08', word: 'dog', cefr: 'A1', category: 'Animals', emoji: '🐶',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&auto=format&fit=crop&q=80',
    phonetic: '/dɒɡ/', meaning: 'Anjing',
    definition: 'A loyal domestic mammal often kept as a pet or guard animal.',
    distractors: ['c', 'u', 'p'], synonym: 'canine', antonym: 'cat',
    sentence: ['My friendly dog', 'runs happily', 'across the green park'],
    sentenceIndo: 'Anjingku yang ramah berlari gembira melintasi taman hijau.'
  },
  {
    id: 'a1_09', word: 'house', cefr: 'A1', category: 'Objects', emoji: '🏠',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop&q=80',
    phonetic: '/haʊs/', meaning: 'Rumah',
    definition: 'A building designed for people and families to live in.',
    distractors: ['m', 'a', 't'], synonym: 'dwelling', antonym: 'street',
    sentence: ['Our cozy house', 'has a garden', 'full of flowers'],
    sentenceIndo: 'Rumah nyaman kami memiliki taman yang penuh bunga.'
  },
  {
    id: 'a1_10', word: 'coffee', cefr: 'A1', category: 'Food', emoji: '☕',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈkɒf.i/', meaning: 'Kopi',
    definition: 'A hot dark drink made from roasted and ground coffee beans.',
    distractors: ['a', 'u', 'm'], synonym: 'espresso', antonym: 'milk',
    sentence: ['She drinks', 'hot black coffee', 'every morning'],
    sentenceIndo: 'Dia minum kopi hitam panas setiap pagi.'
  },
  {
    id: 'a1_11', word: 'sun', cefr: 'A1', category: 'Nature', emoji: '☀️',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80',
    phonetic: '/sʌn/', meaning: 'Matahari',
    definition: 'The bright star at the center of our solar system providing light and heat.',
    distractors: ['m', 'o', 't'], synonym: 'star', antonym: 'moon',
    sentence: ['The bright sun', 'rises early', 'in the eastern sky'],
    sentenceIndo: 'Matahari cerah terbit lebih awal di langit timur.'
  },
  {
    id: 'a1_12', word: 'tree', cefr: 'A1', category: 'Nature', emoji: '🌳',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80',
    phonetic: '/triː/', meaning: 'Pohon',
    definition: 'A tall woody plant with a trunk, branches, and green leaves.',
    distractors: ['a', 'b', 'o'], synonym: 'oak', antonym: 'rock',
    sentence: ['A tall tree', 'gives cool shade', 'during hot afternoons'],
    sentenceIndo: 'Sebuah pohon tinggi memberi keteduhan sejuk saat siang panas.'
  },
  {
    id: 'a1_13', word: 'bread', cefr: 'A1', category: 'Food', emoji: '🍞',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    phonetic: '/bred/', meaning: 'Roti',
    definition: 'A baked food made from flour, water, and yeast.',
    distractors: ['i', 'k', 's'], synonym: 'loaf', antonym: 'soup',
    sentence: ['We buy', 'freshly baked bread', 'from the bakery'],
    sentenceIndo: 'Kami membeli roti yang baru dipanggang dari toko roti.'
  },
  {
    id: 'a1_14', word: 'chair', cefr: 'A1', category: 'Objects', emoji: '🪑',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&auto=format&fit=crop&q=80',
    phonetic: '/tʃeər/', meaning: 'Kursi',
    definition: 'A piece of furniture with a back and four legs for one person to sit on.',
    distractors: ['o', 'm', 's'], synonym: 'seat', antonym: 'floor',
    sentence: ['Please sit down', 'on the wooden chair', 'near the desk'],
    sentenceIndo: 'Silakan duduk di kursi kayu dekat meja.'
  },
  {
    id: 'a1_15', word: 'flower', cefr: 'A1', category: 'Nature', emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈflaʊ.ər/', meaning: 'Bunga',
    definition: 'The colorful blossom of a plant that produces seeds.',
    distractors: ['t', 'a', 'k'], synonym: 'blossom', antonym: 'thorn',
    sentence: ['Every spring flower', 'blooms brightly', 'in the garden'],
    sentenceIndo: 'Setiap bunga musim semi mekar cerah di taman.'
  },
  {
    id: 'a1_16', word: 'fish', cefr: 'A1', category: 'Animals', emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&auto=format&fit=crop&q=80',
    phonetic: '/fɪʃ/', meaning: 'Ikan',
    definition: 'A cold-blooded aquatic animal with gills and fins that lives in water.',
    distractors: ['a', 't', 'm'], synonym: 'trout', antonym: 'bird',
    sentence: ['Small colorful fish', 'swim together', 'in the clear river'],
    sentenceIndo: 'Ikan kecil berwarna-warni berenang bersama di sungai jernih.'
  },

  // ================= CEFR A2 (16 Words) =================
  {
    id: 'a2_01', word: 'umbrella', cefr: 'A2', category: 'Objects', emoji: '☂️',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ʌmˈbrel.ə/', meaning: 'Payung',
    definition: 'A folding canopy on a frame used for protection against rain.',
    distractors: ['o', 'i', 'p'], synonym: 'parasol', antonym: 'sunshine',
    sentence: ['Bring an umbrella', 'because it looks', 'like heavy rain'],
    sentenceIndo: 'Bawalah payung karena cuaca tampak akan hujan lebat.'
  },
  {
    id: 'a2_02', word: 'dolphin', cefr: 'A2', category: 'Animals', emoji: '🐬',
    image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈdɒl.fɪn/', meaning: 'Lumba-lumba',
    definition: 'An intelligent marine mammal with a curved beak and dorsal fin.',
    distractors: ['k', 'e', 's'], synonym: 'cetacean', antonym: 'shark',
    sentence: ['A friendly dolphin', 'jumped high', 'above the ocean waves'],
    sentenceIndo: 'Seekor lumba-lumba yang ramah melompat tinggi di atas ombak lautan.'
  },
  {
    id: 'a2_03', word: 'airplane', cefr: 'A2', category: 'Travel', emoji: '✈️',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈeə.pleɪn/', meaning: 'Pesawat',
    definition: 'A powered flying vehicle with fixed wings.',
    distractors: ['m', 'u', 'b'], synonym: 'aircraft', antonym: 'submarine',
    sentence: ['The passenger airplane', 'lands safely', 'at the airport'],
    sentenceIndo: 'Pesawat penumpang itu mendarat dengan selamat di bandara.'
  },
  {
    id: 'a2_04', word: 'backpack', cefr: 'A2', category: 'Travel', emoji: '🎒',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈbæk.pæk/', meaning: 'Ransel',
    definition: 'A bag with shoulder straps carried on the back.',
    distractors: ['t', 's', 'e'], synonym: 'knapsack', antonym: 'suitcase',
    sentence: ['Pack your backpack', 'before we start', 'the morning journey'],
    sentenceIndo: 'Kemaslah ranselmu sebelum kita memulai perjalanan pagi.'
  },
  {
    id: 'a2_05', word: 'mountain', cefr: 'A2', category: 'Nature', emoji: '⛰️',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈmaʊn.tɪn/', meaning: 'Gunung',
    definition: 'A large natural elevation of the earth surface rising steeply.',
    distractors: ['e', 'k', 'r'], synonym: 'peak', antonym: 'valley',
    sentence: ['Hikers climbed', 'the snowy mountain', 'before sunset'],
    sentenceIndo: 'Para pendaki memanjat gunung bersalju sebelum matahari terbenam.'
  },
  {
    id: 'a2_06', word: 'camera', cefr: 'A2', category: 'Objects', emoji: '📷',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈkæm.ər.ə/', meaning: 'Kamera',
    definition: 'A device for capturing photographs or recording moving images.',
    distractors: ['t', 'i', 'o'], synonym: 'lens', antonym: 'canvas',
    sentence: ['He used', 'a digital camera', 'to photograph wildlife'],
    sentenceIndo: 'Dia menggunakan kamera digital untuk memotret satwa liar.'
  },
  {
    id: 'a2_07', word: 'bicycle', cefr: 'A2', category: 'Travel', emoji: '🚲',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈbaɪ.sɪ.kəl/', meaning: 'Sepeda',
    definition: 'A two-wheeled vehicle powered by pedals turned by the rider.',
    distractors: ['a', 'm', 't'], synonym: 'cycle', antonym: 'truck',
    sentence: ['I ride', 'my blue bicycle', 'to school every day'],
    sentenceIndo: 'Saya mengendarai sepeda biru saya ke sekolah setiap hari.'
  },
  {
    id: 'a2_08', word: 'library', cefr: 'A2', category: 'Objects', emoji: '📚',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈlaɪ.brər.i/', meaning: 'Perpustakaan',
    definition: 'A building or room containing collections of books for reading and study.',
    distractors: ['e', 't', 's'], synonym: 'archive', antonym: 'stadium',
    sentence: ['Students study quietly', 'inside the city library', 'every afternoon'],
    sentenceIndo: 'Para siswa belajar dengan tenang di dalam perpustakaan kota setiap sore.'
  },
  {
    id: 'a2_09', word: 'kitchen', cefr: 'A2', category: 'Food', emoji: '🍳',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈkɪtʃ.ən/', meaning: 'Dapur',
    definition: 'A room equipped for preparing and cooking meals.',
    distractors: ['a', 'o', 'm'], synonym: 'galley', antonym: 'bedroom',
    sentence: ['Warm soup smells', 'delicious inside', 'our family kitchen'],
    sentenceIndo: 'Sup hangat tercium lezat di dalam dapur keluarga kami.'
  },
  {
    id: 'a2_10', word: 'train', cefr: 'A2', category: 'Travel', emoji: '🚆',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&auto=format&fit=crop&q=80',
    phonetic: '/treɪn/', meaning: 'Kereta Api',
    definition: 'A series of connected railway carriages pulled along tracks.',
    distractors: ['e', 'o', 'b'], synonym: 'locomotive', antonym: 'canoe',
    sentence: ['The express train', 'arrives punctually', 'at the central station'],
    sentenceIndo: 'Kereta ekspres tiba tepat waktu di stasiun pusat.'
  },
  {
    id: 'a2_11', word: 'penguin', cefr: 'A2', category: 'Animals', emoji: '🐧',
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈpeŋ.ɡwɪn/', meaning: 'Penguin',
    definition: 'A flightless black-and-white seabird adapted for swimming in cold waters.',
    distractors: ['a', 'o', 't'], synonym: 'seabird', antonym: 'eagle',
    sentence: ['The emperor penguin', 'dives swiftly', 'into icy water'],
    sentenceIndo: 'Penguin kaisar menyelam dengan cepat ke dalam air es.'
  },
  {
    id: 'a2_12', word: 'river', cefr: 'A2', category: 'Nature', emoji: '🏞️',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈrɪv.ər/', meaning: 'Sungai',
    definition: 'A large natural stream of water flowing toward the sea or a lake.',
    distractors: ['a', 't', 'm'], synonym: 'stream', antonym: 'desert',
    sentence: ['Clear water flows', 'down the wide river', 'toward the ocean'],
    sentenceIndo: 'Air jernih mengalir menyusuri sungai lebar menuju lautan.'
  },
  {
    id: 'a2_13', word: 'clock', cefr: 'A2', category: 'Objects', emoji: '⏰',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=80',
    phonetic: '/klɒk/', meaning: 'Jam',
    definition: 'An instrument that measures and displays the current time.',
    distractors: ['a', 'e', 't'], synonym: 'timepiece', antonym: 'eternity',
    sentence: ['The wall clock', 'struck twelve', 'at midnight'],
    sentenceIndo: 'Jam dinding itu berdentang dua belas kali saat tengah malam.'
  },
  {
    id: 'a2_14', word: 'orange', cefr: 'A2', category: 'Food', emoji: '🍊',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈɒr.ɪndʒ/', meaning: 'Jeruk',
    definition: 'A round juicy citrus fruit with tough bright reddish-yellow rind.',
    distractors: ['u', 'k', 'm'], synonym: 'citrus', antonym: 'pepper',
    sentence: ['Fresh orange juice', 'provides vitamin C', 'for breakfast'],
    sentenceIndo: 'Jus jeruk segar menyediakan vitamin C untuk sarapan.'
  },
  {
    id: 'a2_15', word: 'bridge', cefr: 'A2', category: 'Travel', emoji: '🌉',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&auto=format&fit=crop&q=80',
    phonetic: '/brɪdʒ/', meaning: 'Jembatan',
    definition: 'A structure built to cross over a river, road, or valley.',
    distractors: ['a', 'o', 't'], synonym: 'viaduct', antonym: 'tunnel',
    sentence: ['Cars cross', 'the suspension bridge', 'into the city'],
    sentenceIndo: 'Mobil-mobil melintasi jembatan gantung menuju kota.'
  },
  {
    id: 'a2_16', word: 'turtle', cefr: 'A2', category: 'Animals', emoji: '🐢',
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈtɜː.təl/', meaning: 'Penyu / Kura-kura',
    definition: 'A slow-moving reptile enclosed in a protective bony shell.',
    distractors: ['a', 'o', 'm'], synonym: 'tortoise', antonym: 'cheetah',
    sentence: ['A sea turtle', 'glides gracefully', 'through coral reefs'],
    sentenceIndo: 'Seekor penyu laut meluncur anggun melewati terumbu karang.'
  },

  // ================= CEFR B1 (16 Words) =================
  {
    id: 'b1_01', word: 'telescope', cefr: 'B1', category: 'Tech', emoji: '🔭',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈtel.ɪ.skəʊp/', meaning: 'Teleskop',
    definition: 'An optical instrument designed to observe distant celestial objects.',
    distractors: ['a', 'y', 'u'], synonym: 'spyglass', antonym: 'microscope',
    sentence: ['Through the telescope', 'we observed', 'the craters of the moon'],
    sentenceIndo: 'Melalui teleskop, kami mengamati kawah-kawah bulan.'
  },
  {
    id: 'b1_02', word: 'avocado', cefr: 'B1', category: 'Food', emoji: '🥑',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌæv.əˈkɑː.dəʊ/', meaning: 'Alpukat',
    definition: 'A pear-shaped fruit with rough dark skin and creamy green flesh.',
    distractors: ['i', 's', 'r'], synonym: 'alligator pear', antonym: 'citrus',
    sentence: ['Avocado contains', 'healthy fats', 'suitable for daily diet'],
    sentenceIndo: 'Alpukat mengandung lemak sehat yang cocok untuk menu diet harian.'
  },
  {
    id: 'b1_03', word: 'butterfly', cefr: 'B1', category: 'Animals', emoji: '🦋',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈbʌt.ə.flaɪ/', meaning: 'Kupu-kupu',
    definition: 'An insect with four broad wings typically brightly colored.',
    distractors: ['d', 'p', 'k'], synonym: 'lepidopteran', antonym: 'caterpillar',
    sentence: ['The colorful butterfly', 'flutters around', 'the blooming roses'],
    sentenceIndo: 'Kupu-kupu aneka warna itu melayang di sekitar mawar yang mekar.'
  },
  {
    id: 'b1_04', word: 'computer', cefr: 'B1', category: 'Tech', emoji: '💻',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80',
    phonetic: '/kəmˈpjuː.tər/', meaning: 'Komputer',
    definition: 'An electronic device for storing and processing data.',
    distractors: ['a', 'k', 'l'], synonym: 'workstation', antonym: 'abacus',
    sentence: ['Modern computers', 'process complex data', 'in fractions of a second'],
    sentenceIndo: 'Komputer modern memproses data rumit dalam sepersekian detik.'
  },
  {
    id: 'b1_05', word: 'volcano', cefr: 'B1', category: 'Nature', emoji: '🌋',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop&q=80',
    phonetic: '/vɒlˈkeɪ.nəʊ/', meaning: 'Gunung Berapi',
    definition: 'A mountain with a crater through which lava and gas erupt.',
    distractors: ['e', 'i', 't'], synonym: 'caldera', antonym: 'glacier',
    sentence: ['The dormant volcano', 'attracts geologists', 'from across the world'],
    sentenceIndo: 'Gunung berapi yang tidak aktif itu menarik ahli geologi dari seluruh dunia.'
  },
  {
    id: 'b1_06', word: 'compass', cefr: 'B1', category: 'Travel', emoji: '🧭',
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈkʌm.pəs/', meaning: 'Kompas',
    definition: 'A navigational instrument with a magnetized pointer showing north.',
    distractors: ['e', 't', 'r'], synonym: 'navigator', antonym: 'anchor',
    sentence: ['Explorers rely', 'on a reliable compass', 'when crossing dense forests'],
    sentenceIndo: 'Penjelajah mengandalkan kompas yang akurat saat melintasi hutan lebat.'
  },
  {
    id: 'b1_07', word: 'microscope', cefr: 'B1', category: 'Tech', emoji: '🔬',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈmaɪ.krə.skəʊp/', meaning: 'Mikroskop',
    definition: 'An optical instrument used for viewing tiny cells and microorganisms.',
    distractors: ['a', 'u', 'd'], synonym: 'magnifier', antonym: 'telescope',
    sentence: ['Biologists examine', 'living plant cells', 'under a microscope'],
    sentenceIndo: 'Ahli biologi memeriksa sel tumbuhan hidup di bawah mikroskop.'
  },
  {
    id: 'b1_08', word: 'glacier', cefr: 'B1', category: 'Nature', emoji: '🧊',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈɡlæs.i.ər/', meaning: 'Gletser',
    definition: 'A slowly moving mass of dense ice formed over centuries.',
    distractors: ['o', 'u', 't'], synonym: 'iceberg', antonym: 'volcano',
    sentence: ['The ancient glacier', 'carved deep valleys', 'across the northern coast'],
    sentenceIndo: 'Gletser purba itu mengukir lembah dalam di sepanjang pantai utara.'
  },
  {
    id: 'b1_09', word: 'orchestra', cefr: 'B1', category: 'Objects', emoji: '🎻',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈɔː.kɪ.strə/', meaning: 'Orkestra',
    definition: 'A large instrumental ensemble playing classical music together.',
    distractors: ['u', 'i', 'p'], synonym: 'symphony', antonym: 'soloist',
    sentence: ['The symphony orchestra', 'performed brilliantly', 'at the concert hall'],
    sentenceIndo: 'Orkestra simfoni tampil gemilang di gedung konser.'
  },
  {
    id: 'b1_10', word: 'satellite', cefr: 'B1', category: 'Tech', emoji: '🛰️',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈsæt.əl.aɪt/', meaning: 'Satelit',
    definition: 'An artificial object placed in orbit around Earth to relay data.',
    distractors: ['o', 'u', 'm'], synonym: 'orbiter', antonym: 'submarine',
    sentence: ['Weather satellites', 'track tropical storms', 'from high orbit'],
    sentenceIndo: 'Satelit cuaca melacak badai tropis dari orbit tinggi.'
  },
  {
    id: 'b1_11', word: 'chameleon', cefr: 'B1', category: 'Animals', emoji: '🦎',
    image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=400&auto=format&fit=crop&q=80',
    phonetic: '/kəˈmiː.li.ən/', meaning: 'Bunglon',
    definition: 'A small slow-moving lizard able to change skin color.',
    distractors: ['u', 'k', 's'], synonym: 'lizard', antonym: 'mammoth',
    sentence: ['The green chameleon', 'changes its color', 'to match tree bark'],
    sentenceIndo: 'Bunglon hijau itu mengubah warnanya agar menyerupai kulit pohon.'
  },
  {
    id: 'b1_12', word: 'espresso', cefr: 'B1', category: 'Food', emoji: '☕',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop&q=80',
    phonetic: '/esˈpres.əʊ/', meaning: 'Espresso',
    definition: 'Strong concentrated coffee brewed by forcing hot water through fine grounds.',
    distractors: ['a', 'u', 't'], synonym: 'roast', antonym: 'juice',
    sentence: ['Baristas prepare', 'a double espresso', 'with rich golden crema'],
    sentenceIndo: 'Para barista menyiapkan espresso ganda dengan krema keemasan yang kaya.'
  },
  {
    id: 'b1_13', word: 'passport', cefr: 'B1', category: 'Travel', emoji: '🛂',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈpɑːs.pɔːt/', meaning: 'Paspor',
    definition: 'An official government document certifying identity for international travel.',
    distractors: ['e', 'i', 'k'], synonym: 'credential', antonym: 'ticket',
    sentence: ['Keep your passport', 'ready before entering', 'international customs'],
    sentenceIndo: 'Siapkan paspor Anda sebelum memasuki bea cukai internasional.'
  },
  {
    id: 'b1_14', word: 'journal', cefr: 'B1', category: 'Objects', emoji: '📓',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈdʒɜː.nəl/', meaning: 'Jurnal',
    definition: 'A daily record of personal thoughts, events, or scholarly research.',
    distractors: ['e', 'i', 'k'], synonym: 'chronicle', antonym: 'poster',
    sentence: ['She writes', 'in her travel journal', 'every evening'],
    sentenceIndo: 'Dia menulis di jurnal perjalanannya setiap malam.'
  },
  {
    id: 'b1_15', word: 'kangaroo', cefr: 'B1', category: 'Animals', emoji: '🦘',
    image: 'https://images.unsplash.com/photo-1528499908559-b8e4e8b89b8e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌkæŋ.ɡərˈuː/', meaning: 'Kanguru',
    definition: 'A large Australian marsupial with powerful hind legs for leaping.',
    distractors: ['e', 'i', 'm'], synonym: 'marsupial', antonym: 'snail',
    sentence: ['The wild kangaroo', 'leaped effortlessly', 'across the dry outback'],
    sentenceIndo: 'Kanguru liar itu melompat ringan melintasi padang pedalaman.'
  },
  {
    id: 'b1_16', word: 'lantern', cefr: 'B1', category: 'Objects', emoji: '🏮',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈlæn.tən/', meaning: 'Lentera',
    definition: 'A portable lamp enclosed in a protective glass or paper frame.',
    distractors: ['o', 'u', 'm'], synonym: 'beacon', antonym: 'shadow',
    sentence: ['Campers hung', 'a glowing lantern', 'outside their tent'],
    sentenceIndo: 'Para berkemah menggantung lentera menyala di luar tenda mereka.'
  },

  // ================= CEFR B2 (16 Words) =================
  {
    id: 'b2_01', word: 'pragmatic', cefr: 'B2', category: 'Academic', emoji: '🧭',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    phonetic: '/præɡˈmæt.ɪk/', meaning: 'Pragmatis',
    definition: 'Dealing with things sensibly and realistically based on practical conditions.',
    distractors: ['e', 'u', 'l'], synonym: 'practical', antonym: 'idealistic',
    sentence: ['We need to adopt', 'a pragmatic approach', 'to solve this problem'],
    sentenceIndo: 'Kita perlu mengadopsi pendekatan pragmatis untuk menyelesaikan masalah ini.'
  },
  {
    id: 'b2_02', word: 'resilient', cefr: 'B2', category: 'Academic', emoji: '🛡️',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
    phonetic: '/rɪˈzɪl.jənt/', meaning: 'Tangguh / Ulet',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    distractors: ['u', 'k', 'd'], synonym: 'tough', antonym: 'fragile',
    sentence: ['Resilient communities', 'recover promptly', 'after unexpected disasters'],
    sentenceIndo: 'Komunitas yang tangguh pulih dengan cepat setelah bencana tak terduga.'
  },
  {
    id: 'b2_03', word: 'ambiguous', cefr: 'B2', category: 'Academic', emoji: '🎭',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    phonetic: '/æmˈbɪɡ.ju.əs/', meaning: 'Ambigu / Bermakna ganda',
    definition: 'Open to more than one interpretation; having a double meaning.',
    distractors: ['k', 't', 'p'], synonym: 'equivocal', antonym: 'explicit',
    sentence: ['His statement was', 'intentionally ambiguous', 'to avoid controversy'],
    sentenceIndo: 'Pernyataannya sengaja dibuat ambigu untuk menghindari kontroversi.'
  },
  {
    id: 'b2_04', word: 'lucid', cefr: 'B2', category: 'Academic', emoji: '💡',
    image: 'https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈluː.sɪd/', meaning: 'Jelas / Gamblang',
    definition: 'Expressed clearly; easy to comprehend and logically coherent.',
    distractors: ['m', 'k', 'p'], synonym: 'transparent', antonym: 'obscure',
    sentence: ['The professor gave', 'a remarkably lucid explanation', 'of quantum physics'],
    sentenceIndo: 'Profesor itu memberikan penjelasan yang sangat gamblang mengenai fisika kuantum.'
  },
  {
    id: 'b2_05', word: 'catalyst', cefr: 'B2', category: 'Tech', emoji: '⚗️',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈkæt.əl.ɪst/', meaning: 'Katalisator / Pemicu',
    definition: 'A substance or event that speeds up a reaction or major change.',
    distractors: ['e', 'o', 'm'], synonym: 'stimulus', antonym: 'deterrent',
    sentence: ['Clean energy became', 'a powerful catalyst', 'for industrial reform'],
    sentenceIndo: 'Energi bersih menjadi katalisator kuat bagi reformasi industri.'
  },
  {
    id: 'b2_06', word: 'eloquent', cefr: 'B2', category: 'Academic', emoji: '🎙️',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈel.ə.kwənt/', meaning: 'Fasih / Memukau',
    definition: 'Fluent, persuasive, and expressive in speaking or writing.',
    distractors: ['a', 'i', 'k'], synonym: 'articulate', antonym: 'inarticulate',
    sentence: ['Her eloquent speech', 'inspired thousands', 'of young researchers'],
    sentenceIndo: 'Pidatonya yang fasih menginspirasi ribuan peneliti muda.'
  },
  {
    id: 'b2_07', word: 'meticulous', cefr: 'B2', category: 'Academic', emoji: '🔍',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    phonetic: '/məˈtɪk.jə.ləs/', meaning: 'Sangat teliti',
    definition: 'Showing great attention to detail; very careful and precise.',
    distractors: ['a', 'k', 'p'], synonym: 'scrupulous', antonym: 'careless',
    sentence: ['Architects maintain', 'meticulous records', 'of every measurement'],
    sentenceIndo: 'Para arsitek menyimpan catatan yang sangat teliti untuk setiap ukuran.'
  },
  {
    id: 'b2_08', word: 'obsolete', cefr: 'B2', category: 'Tech', emoji: '📼',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌɒb.səlˈiːt/', meaning: 'Usang / Ketinggalan zaman',
    definition: 'No longer produced or used; out of date.',
    distractors: ['a', 'u', 'm'], synonym: 'outdated', antonym: 'modern',
    sentence: ['Floppy disks became', 'completely obsolete', 'with cloud storage'],
    sentenceIndo: 'Disket menjadi benar-benar usang sejak hadirnya penyimpanan awan.'
  },
  {
    id: 'b2_09', word: 'volatile', cefr: 'B2', category: 'Nature', emoji: '⚡',
    image: 'https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈvɒl.ə.taɪl/', meaning: 'Tidak stabil / Mudah berubah',
    definition: 'Liable to change rapidly and unpredictably, especially for the worse.',
    distractors: ['u', 'k', 'm'], synonym: 'unstable', antonym: 'steady',
    sentence: ['Financial markets remained', 'highly volatile', 'throughout the quarter'],
    sentenceIndo: 'Pasar keuangan tetap sangat tidak stabil sepanjang kuartal tersebut.'
  },
  {
    id: 'b2_10', word: 'hypothesis', cefr: 'B2', category: 'Academic', emoji: '🧪',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&auto=format&fit=crop&q=80',
    phonetic: '/haɪˈpɒθ.ə.sɪs/', meaning: 'Hipotesis / Dugaan ilmiah',
    definition: 'A proposed explanation made on limited evidence as a starting point.',
    distractors: ['a', 'u', 'k'], synonym: 'theory', antonym: 'certainty',
    sentence: ['Experiments tested', 'their bold hypothesis', 'across three trials'],
    sentenceIndo: 'Eksperimen menguji hipotesis berani mereka melalui tiga uji coba.'
  },
  {
    id: 'b2_11', word: 'synthesize', cefr: 'B2', category: 'Tech', emoji: '🧬',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈsɪn.θə.saɪz/', meaning: 'Mensintesis / Memadukan',
    definition: 'To combine distinct elements into a coherent whole.',
    distractors: ['a', 'o', 'k'], synonym: 'integrate', antonym: 'separate',
    sentence: ['Scholars synthesize', 'diverse findings', 'into unified frameworks'],
    sentenceIndo: 'Para akademisi memadukan beragam temuan ke dalam kerangka kerja terpadu.'
  },
  {
    id: 'b2_12', word: 'mitigate', cefr: 'B2', category: 'Nature', emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/', meaning: 'Meredakan / Mengurangi dampak',
    definition: 'To make something less severe, harmful, or painful.',
    distractors: ['o', 'u', 'k'], synonym: 'alleviate', antonym: 'worsen',
    sentence: ['Coastal mangroves help', 'mitigate severe', 'storm flooding'],
    sentenceIndo: 'Hutan bakau pesisir membantu meredakan banjir badai yang parah.'
  },
  {
    id: 'b2_13', word: 'benevolent', cefr: 'B2', category: 'Academic', emoji: '🤝',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&auto=format&fit=crop&q=80',
    phonetic: '/bəˈnev.əl.ənt/', meaning: 'Dermawan / Baik hati',
    definition: 'Well-meaning, kindly, and motivated by generosity.',
    distractors: ['a', 'i', 'k'], synonym: 'charitable', antonym: 'hostile',
    sentence: ['The benevolent foundation', 'funded scholarships', 'for rural students'],
    sentenceIndo: 'Yayasan dermawan itu mendanai beasiswa bagi siswa pedesaan.'
  },
  {
    id: 'b2_14', word: 'algorithm', cefr: 'B2', category: 'Tech', emoji: '⚙️',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈæl.ɡə.rɪ.ðəm/', meaning: 'Algoritma',
    definition: 'A finite sequence of step-by-step rules used to solve a computation.',
    distractors: ['e', 'u', 'k'], synonym: 'procedure', antonym: 'guesswork',
    sentence: ['Search engines run', 'an efficient algorithm', 'to rank results'],
    sentenceIndo: 'Mesin pencari menjalankan algoritma efisien untuk mengurutkan hasil.'
  },
  {
    id: 'b2_15', word: 'expedition', cefr: 'B2', category: 'Travel', emoji: '🗺️',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌek.spəˈdɪʃ.ən/', meaning: 'Ekspedisi',
    definition: 'An organized journey undertaken for exploration or scientific research.',
    distractors: ['a', 'u', 'm'], synonym: 'voyage', antonym: 'retreat',
    sentence: ['The polar expedition', 'mapped uncharted', 'ice shelves'],
    sentenceIndo: 'Ekspedisi kutub itu memetakan lapisan es yang belum terjamah.'
  },
  {
    id: 'b2_16', word: 'equilibrium', cefr: 'B2', category: 'Nature', emoji: '⚖️',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌiː.kwɪˈlɪb.ri.əm/', meaning: 'Keseimbangan',
    definition: 'A state in which opposing forces or influences are balanced.',
    distractors: ['a', 'o', 't'], synonym: 'balance', antonym: 'imbalance',
    sentence: ['Forest ecosystems depend', 'on a delicate', 'natural equilibrium'],
    sentenceIndo: 'Ekosistem hutan bergantung pada keseimbangan alam yang rapuh.'
  },

  // ================= CEFR C1 (16 Words) =================
  {
    id: 'c1_01', word: 'ubiquitous', cefr: 'C1', category: 'Academic', emoji: '🌐',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    phonetic: '/juːˈbɪk.wɪ.təs/', meaning: 'Ada di mana-mana',
    definition: 'Present, appearing, or found everywhere simultaneously.',
    distractors: ['e', 'k', 'm', 'p'], synonym: 'omnipresent', antonym: 'scarce',
    sentence: ['Smartphones have become', 'ubiquitous tools', 'in modern society'],
    sentenceIndo: 'Ponsel pintar telah menjadi alat yang ada di mana-mana dalam masyarakat modern.'
  },
  {
    id: 'c1_02', word: 'serendipity', cefr: 'C1', category: 'Academic', emoji: '✨',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/', meaning: 'Keberuntungan tak terduga',
    definition: 'The occurrence of events by chance in a happy or beneficial way.',
    distractors: ['u', 'w', 'k', 'm'], synonym: 'fluke', antonym: 'misfortune',
    sentence: ['Scientific discoveries', 'often emerge from', 'pure serendipity'],
    sentenceIndo: 'Penemuan ilmiah kerap muncul dari keberuntungan yang tak terduga.'
  },
  {
    id: 'c1_03', word: 'ephemeral', cefr: 'C1', category: 'Nature', emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ɪˈfem.ər.əl/', meaning: 'Fana / Singkat',
    definition: 'Lasting for a very short time; transitory and fleeting.',
    distractors: ['u', 'k', 'o', 'x'], synonym: 'fleeting', antonym: 'permanent',
    sentence: ['The cherry blossoms', 'possess an ephemeral beauty', 'lasting only days'],
    sentenceIndo: 'Bunga sakura memiliki keindahan yang fana, hanya bertahan beberapa hari.'
  },
  {
    id: 'c1_04', word: 'paradigm', cefr: 'C1', category: 'Academic', emoji: '🧠',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈpær.ə.daɪm/', meaning: 'Paradigma / Kerangka berpikir',
    definition: 'A typical example or overarching model of how something works.',
    distractors: ['u', 'k', 's', 't'], synonym: 'archetype', antonym: 'anomaly',
    sentence: ['The new theory', 'shifted the scientific paradigm', 'towards holistic ecology'],
    sentenceIndo: 'Teori baru tersebut menggeser paradigma ilmiah menuju ekologi holistik.'
  },
  {
    id: 'c1_05', word: 'quintessential', cefr: 'C1', category: 'Academic', emoji: '👑',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌkwɪn.tɪˈsen.ʃəl/', meaning: 'Paling representatif / Klasik',
    definition: 'Representing the most perfect or typical example of a quality or class.',
    distractors: ['o', 'm', 'k', 'p'], synonym: 'exemplary', antonym: 'atypical',
    sentence: ['Kyoto remains', 'the quintessential city', 'of traditional architecture'],
    sentenceIndo: 'Kyoto tetap menjadi kota paling representatif untuk arsitektur tradisional.'
  },
  {
    id: 'c1_06', word: 'dichotomy', cefr: 'C1', category: 'Academic', emoji: '🌗',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    phonetic: '/daɪˈkɒt.ə.mi/', meaning: 'Dikotomi / Pertentangan dua sisi',
    definition: 'A sharp division or contrast between two completely opposite things.',
    distractors: ['a', 'u', 'e', 'p'], synonym: 'polarity', antonym: 'unity',
    sentence: ['Critics questioned', 'the strict dichotomy', 'between art and science'],
    sentenceIndo: 'Para kritikus mempertanyakan dikotomi ketat antara seni dan sains.'
  },
  {
    id: 'c1_07', word: 'esoteric', cefr: 'C1', category: 'Academic', emoji: '📜',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌes.əˈter.ɪk/', meaning: 'Esoterik / Khusus kalangan tertentu',
    definition: 'Intended for or likely to be understood by only a small specialized group.',
    distractors: ['a', 'u', 'm', 'k'], synonym: 'arcane', antonym: 'mainstream',
    sentence: ['The manuscript contains', 'esoteric terminology', 'for advanced linguists'],
    sentenceIndo: 'Naskah itu memuat terminologi khusus bagi ahli bahasa tingkat lanjut.'
  },
  {
    id: 'c1_08', word: 'exacerbate', cefr: 'C1', category: 'Academic', emoji: '🔥',
    image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ɪɡˈzæs.ə.beɪt/', meaning: 'Memperburuk',
    definition: 'To make a problem, bad situation, or negative feeling worse.',
    distractors: ['i', 'o', 'k', 'm'], synonym: 'aggravate', antonym: 'alleviate',
    sentence: ['Deforestation can', 'rapidly exacerbate', 'regional drought cycles'],
    sentenceIndo: 'Penggundulan hutan dapat dengan cepat memperburuk siklus kekeringan regional.'
  },
  {
    id: 'c1_09', word: 'magnanimous', cefr: 'C1', category: 'Academic', emoji: '🕊️',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&auto=format&fit=crop&q=80',
    phonetic: '/mæɡˈnæn.ɪ.məs/', meaning: 'Berjiwa besar / Pemurah',
    definition: 'Generous or forgiving, especially toward a rival or less powerful person.',
    distractors: ['e', 'o', 'k', 't'], synonym: 'chivalrous', antonym: 'petty',
    sentence: ['She made', 'a magnanimous gesture', 'after winning the debate'],
    sentenceIndo: 'Dia menunjukkan sikap berjiwa besar setelah memenangkan debat.'
  },
  {
    id: 'c1_10', word: 'cacophony', cefr: 'C1', category: 'Objects', emoji: '🔊',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    phonetic: '/kəˈkɒf.ə.ni/', meaning: 'Hiruk-pikuk sumbang',
    definition: 'A harsh, discordant mixture of clashing sounds.',
    distractors: ['e', 'u', 't', 's'], synonym: 'discord', antonym: 'harmony',
    sentence: ['Rush hour traffic', 'created a loud cacophony', 'beneath the window'],
    sentenceIndo: 'Lalu lintas jam sibuk menciptakan hiruk-pikuk sumbang di bawah jendela.'
  },
  {
    id: 'c1_11', word: 'circumspect', cefr: 'C1', category: 'Academic', emoji: '🦉',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˈsɜː.kəm.spekt/', meaning: 'Sangat berhati-hati',
    definition: 'Wary and unwilling to take unnecessary risks.',
    distractors: ['a', 'o', 'l', 'k'], synonym: 'prudent', antonym: 'reckless',
    sentence: ['Diplomats remained', 'circumspect regarding', 'the fragile truce'],
    sentenceIndo: 'Para diplomat tetap sangat berhati-hati menanggapi gencatan senjata yang rapuh.'
  },
  {
    id: 'c1_12', word: 'pernicious', cefr: 'C1', category: 'Nature', emoji: '☠️',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    phonetic: '/pəˈnɪʃ.əs/', meaning: 'Merusak secara diam-diam',
    definition: 'Having a harmful effect, especially in a gradual or subtle way.',
    distractors: ['a', 'k', 'm', 't'], synonym: 'detrimental', antonym: 'beneficial',
    sentence: ['Microplastics exert', 'a pernicious influence', 'on marine food chains'],
    sentenceIndo: 'Mikroplastik memberikan pengaruh merusak pada rantai makanan laut.'
  },
  {
    id: 'c1_13', word: 'juxtapose', cefr: 'C1', category: 'Academic', emoji: '🖼️',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌdʒʌk.stəˈpəʊz/', meaning: 'Menjajar-bandingkan',
    definition: 'To place close together for contrasting effect.',
    distractors: ['i', 'm', 'k', 'r'], synonym: 'contrast', antonym: 'isolate',
    sentence: ['The exhibition chose', 'to juxtapose ancient pottery', 'with digital art'],
    sentenceIndo: 'Pameran tersebut memilih menjajarkan tembikar kuno dengan seni digital.'
  },
  {
    id: 'c1_14', word: 'ineffable', cefr: 'C1', category: 'Nature', emoji: '🌌',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ɪnˈef.ə.bəl/', meaning: 'Tak terlukiskan kata-kata',
    definition: 'Too great, sacred, or extreme to be expressed in words.',
    distractors: ['o', 'u', 'k', 'm'], synonym: 'indescribable', antonym: 'expressible',
    sentence: ['Northern lights inspire', 'an ineffable sense', 'of cosmic wonder'],
    sentenceIndo: 'Aurora utara membangkitkan rasa takjub kosmis yang tak terlukiskan kata.'
  },
  {
    id: 'c1_15', word: 'algorithmic', cefr: 'C1', category: 'Tech', emoji: '🤖',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    phonetic: '/ˌæl.ɡəˈrɪð.mɪk/', meaning: 'Bersifat algoritmik',
    definition: 'Relating to or using step-by-step computational rules.',
    distractors: ['e', 'u', 'k', 'p'], synonym: 'computational', antonym: 'intuitive',
    sentence: ['Modern cryptography uses', 'algorithmic verification', 'to protect data'],
    sentenceIndo: 'Kriptografi modern menggunakan verifikasi algoritmik untuk melindungi data.'
  },
  {
    id: 'c1_16', word: 'itinerary', cefr: 'C1', category: 'Travel', emoji: '🧭',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=80',
    phonetic: '/aɪˈtɪn.ər.ər.i/', meaning: 'Rencana perjalanan terperinci',
    definition: 'A planned route or detailed schedule of a journey.',
    distractors: ['o', 'u', 'k', 'm'], synonym: 'schedule', antonym: 'wandering',
    sentence: ['Review the', 'comprehensive itinerary', 'prior to departure'],
    sentenceIndo: 'Tinjau rencana perjalanan terperinci sebelum keberangkatan.'
  }
];

function getCombinedBaseVocab() {
  const extra = Array.isArray(window.EXTRA_VOCAB_4000) ? window.EXTRA_VOCAB_4000 : [];
  if (!extra.length) return [...BASE_VOCAB_DATA];
  const seen = new Set(BASE_VOCAB_DATA.map(w => w.word.toLowerCase()));
  const merged = [...BASE_VOCAB_DATA];
  for (const item of extra) {
    const key = (item.word || '').toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}

function getWordImage(item) {
  if (item && item.image) return item.image;
  return '';
}

const GENERIC_POS_EMOJIS = new Set(['📦', '⚡', '🎨', '🧭', '📝', '📘']);

function getSmartEmoji(item) {
  if (!item) return '📘';
  if (item.emoji && !GENERIC_POS_EMOJIS.has(item.emoji)) return item.emoji;

  const text = `${item.word || ''} ${item.definition || ''} ${item.category || ''}`.toLowerCase();
  const rules = [
    [/\b(dog|cat|bird|fish|animal|lion|tiger|bear|horse|cow|sheep|pig|monkey|elephant|wolf|fox|rabbit|snake|insect|bee|butterfly|wildlife|pet|mammal)\b/, '🐾'],
    [/\b(eat|food|fruit|apple|bread|meat|rice|cake|meal|cook|kitchen|restaurant|breakfast|lunch|dinner|drink|coffee|tea|milk|juice|sugar|salt|vegetable)\b/, '🍽️'],
    [/\b(water|ocean|sea|river|lake|rain|snow|ice|cloud|storm|wind|weather|sky|sun|moon|star|planet|earth|world|space)\b/, '🌍'],
    [/\b(tree|flower|plant|forest|garden|leaf|grass|mountain|hill|island|beach|desert|nature)\b/, '🌿'],
    [/\b(car|bus|train|plane|flight|airport|ship|boat|bike|bicycle|road|street|travel|trip|journey|hotel|map|ticket|drive|vehicle|traffic)\b/, '✈️'],
    [/\b(house|home|room|door|window|bed|chair|table|building|apartment|office|city|town|village)\b/, '🏠'],
    [/\b(book|read|write|school|study|student|teacher|class|exam|test|university|college|learn|education|knowledge|library|paper|pen)\b/, '📚'],
    [/\b(computer|phone|internet|software|data|digital|network|system|tech|technology|screen|email|online|code|machine|robot|electric)\b/, '💻'],
    [/\b(money|bank|pay|price|cost|buy|sell|shop|market|business|company|job|work|career|office|finance|tax|budget|profit|trade|economy)\b/, '💼'],
    [/\b(doctor|hospital|health|medicine|sick|ill|disease|pain|body|heart|hand|eye|head|blood|sleep|exercise|sport|run|swim)\b/, '🩺'],
    [/\b(music|song|sing|dance|art|paint|draw|film|movie|photo|camera|theatre|concert|guitar|piano|play)\b/, '🎭'],
    [/\b(happy|joy|love|smile|laugh|friend|family|mother|father|child|baby|person|people|human|heart|kind)\b/, '💛'],
    [/\b(sad|angry|fear|afraid|cry|war|fight|crime|danger|accident|problem|trouble|error|mistake)\b/, '⚠️'],
    [/\b(time|day|night|morning|evening|week|month|year|hour|minute|clock|watch|calendar|history|future|past)\b/, '⏰'],
    [/\b(speak|talk|say|tell|ask|answer|language|word|voice|sound|listen|hear|call|message|letter|news)\b/, '💬'],
    [/\b(law|legal|court|police|government|politics|president|king|queen|country|nation|vote|rule)\b/, '⚖️'],
    [/\b(science|research|theory|experiment|atom|energy|light|fire|heat|power|force|measure)\b/, '🔬']
  ];

  for (const [regex, emoji] of rules) {
    if (regex.test(text)) return emoji;
  }

  const catFallback = {
    Verbs: '⚡',
    Nouns: '📦',
    Adjectives: '✨',
    Adverbs: '🧭',
    Food: '🍽️',
    Animals: '🐾',
    Nature: '🌿',
    Travel: '✈️',
    Tech: '💻',
    Academic: '🎓',
    Objects: '🧩'
  };
  return catFallback[item.category] || item.emoji || '📘';
}

function getCategoryPalette(item) {
  const cat = (item && item.category) || '';
  const palettes = {
    Food:       ['#FFF7ED', '#FFEDD5', '#C2410C'],
    Animals:    ['#ECFDF5', '#D1FAE5', '#047857'],
    Nature:     ['#F0FDF4', '#DCFCE7', '#15803D'],
    Travel:     ['#EFF6FF', '#DBEAFE', '#1D4ED8'],
    Tech:       ['#ECFEFF', '#CFFAFE', '#0E7490'],
    Academic:   ['#F5F3FF', '#EDE9FE', '#6D28D9'],
    Objects:    ['#F8FAFC', '#E2E8F0', '#334155'],
    Verbs:      ['#F5F3FF', '#E0E7FF', '#4338CA'],
    Nouns:      ['#EFF6FF', '#E0F2FE', '#0369A1'],
    Adjectives: ['#FDF2F8', '#FCE7F3', '#BE185D'],
    Adverbs:    ['#F0FDFA', '#CCFBF1', '#0F766E']
  };
  return palettes[cat] || ['#EEF2FF', '#E0E7FF', '#3730A3'];
}

function getVectorIconPaths(category, fg) {
  const icons = {
    Verbs:      `<polygon points="165,54 136,100 158,100 152,132 184,84 161,84" fill="${fg}" fill-opacity="0.88"/>`,
    Nouns:      `<rect x="132" y="64" width="56" height="56" rx="12" fill="none" stroke="${fg}" stroke-width="5"/><path d="M132 84h56M160 64v56" stroke="${fg}" stroke-width="4" stroke-opacity="0.5"/>`,
    Adjectives: `<path d="M160 54l9 22 23 2-17 15 5 23-20-12-20 12 5-23-17-15 23-2z" fill="${fg}" fill-opacity="0.85"/>`,
    Adverbs:    `<circle cx="160" cy="92" r="30" fill="none" stroke="${fg}" stroke-width="5"/><polygon points="160,68 170,96 160,90 150,96" fill="${fg}"/>`,
    Food:       `<circle cx="160" cy="94" r="28" fill="none" stroke="${fg}" stroke-width="5"/><circle cx="160" cy="94" r="14" fill="${fg}" fill-opacity="0.25"/>`,
    Animals:    `<circle cx="160" cy="98" r="20" fill="${fg}" fill-opacity="0.82"/><circle cx="136" cy="74" r="8" fill="${fg}" fill-opacity="0.82"/><circle cx="184" cy="74" r="8" fill="${fg}" fill-opacity="0.82"/><circle cx="152" cy="64" r="7" fill="${fg}" fill-opacity="0.82"/><circle cx="168" cy="64" r="7" fill="${fg}" fill-opacity="0.82"/>`,
    Nature:     `<path d="M160 54c-22 14-28 42-14 60 6-14 14-24 14-24s8 10 14 24c14-18 8-46-14-60z" fill="${fg}" fill-opacity="0.85"/>`,
    Travel:     `<path d="M126 96l68-24-22 44-14-12-18 10z" fill="${fg}" fill-opacity="0.85"/>`,
    Tech:       `<rect x="128" y="64" width="64" height="44" rx="6" fill="none" stroke="${fg}" stroke-width="5"/><path d="M144 120h32" stroke="${fg}" stroke-width="5" stroke-linecap="round"/>`,
    Academic:   `<polygon points="160,58 198,78 160,98 122,78" fill="${fg}" fill-opacity="0.85"/><path d="M136 88v20c0 8 48 8 48 0V88" fill="none" stroke="${fg}" stroke-width="4"/>`,
    Objects:    `<circle cx="160" cy="92" r="26" fill="none" stroke="${fg}" stroke-width="5"/><rect x="148" y="80" width="24" height="24" rx="4" fill="${fg}" fill-opacity="0.35"/>`
  };
  return icons[category] || `<rect x="134" y="62" width="52" height="60" rx="8" fill="none" stroke="${fg}" stroke-width="5"/><line x1="146" y1="82" x2="174" y2="82" stroke="${fg}" stroke-width="4" stroke-linecap="round"/><line x1="146" y1="96" x2="174" y2="96" stroke="${fg}" stroke-width="4" stroke-linecap="round"/>`;
}

function buildEmojiFallbackDataUri(item, showLabel = false) {
  const [c1, c2, fg] = getCategoryPalette(item);
  const cat = (item && item.category) || 'General';
  const cefr = (item && item.cefr) || 'A1';
  const iconSvg = getVectorIconPaths(cat, fg);

  let subLabel = `${cat.toUpperCase()} • ${cefr}`;
  if (typeof showLabel === 'string' && showLabel.trim()) {
    subLabel = showLabel.trim().slice(0, 24);
  } else if (showLabel === true) {
    subLabel = (item && item.word) ? item.word.toUpperCase() : 'WORD';
  }
  const safeLabel = subLabel.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
    <rect width="320" height="220" rx="18" fill="url(#g)"/>
    <circle cx="275" cy="40" r="36" fill="${fg}" fill-opacity="0.08"/>
    <circle cx="42" cy="185" r="28" fill="${fg}" fill-opacity="0.07"/>
    <rect x="16" y="14" width="44" height="22" rx="8" fill="${fg}" fill-opacity="0.14"/>
    <text x="38" y="29" text-anchor="middle" font-family="monospace" font-weight="800" font-size="11" fill="${fg}">${cefr}</text>
    ${iconSvg}
    <text x="160" y="172" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="${fg}">${safeLabel}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function renderWordImgTag(item, extraClass = 'w-full h-full object-cover rounded-xl', showLabel = false) {
  const fallback = buildEmojiFallbackDataUri(item, showLabel);
  const src = getWordImage(item) || fallback;
  return `<img src="${src}" alt="vocab visual" loading="lazy" class="${extraClass}" onerror="this.onerror=null;this.src='${fallback}'">`;
}

const VOCAB_DECKS = [
  { id: 'common_1000', title: '1000 Common English Words', desc: 'Kosakata inti paling sering dipakai sehari-hari', color: 'from-cyan-500 to-blue-600', icon: 'book', tag: 'Core', cefr: 'A1-A2' },
  { id: 'conversational', title: 'Conversational English', desc: 'Kata kerja, ekspresi, dan percakapan harian', color: 'from-sky-500 to-indigo-600', icon: 'mic', tag: 'Speaking', cefr: 'A1-B1' },
  { id: 'ox_a1', title: '3000 Oxford Vocabulary A1', desc: 'Level pemula (Foundational) standar Oxford', color: 'from-sky-600 to-blue-700', icon: 'vocab', tag: 'CEFR A1', cefr: 'A1' },
  { id: 'ox_a2', title: '3000 Oxford Vocabulary A2', desc: 'Level dasar (Elementary) standar Oxford', color: 'from-emerald-600 to-teal-700', icon: 'vocab', tag: 'CEFR A2', cefr: 'A2' },
  { id: 'ox_b1', title: '3000 Oxford Vocabulary B1', desc: 'Level menengah (Intermediate) standar Oxford', color: 'from-teal-600 to-indigo-700', icon: 'vocab', tag: 'CEFR B1', cefr: 'B1' },
  { id: 'ox_b2', title: '5000 Oxford Vocabulary B2', desc: 'Level menengah atas (Upper-Intermediate)', color: 'from-indigo-600 to-purple-700', icon: 'vocab', tag: 'CEFR B2', cefr: 'B2' },
  { id: 'ox_c1', title: '5000 Oxford Vocabulary C1', desc: 'Level mahir (Advanced) & akademik', color: 'from-violet-600 to-purple-800', icon: 'crown', tag: 'CEFR C1', cefr: 'C1' },
  { id: 'business_career', title: 'Business & Professional English', desc: 'Komunikasi kantor, presentasi, dan karir', color: 'from-slate-700 to-slate-900', icon: 'target', tag: 'Career', cefr: 'B1-B2' },
  { id: 'academic_research', title: 'Academic & Formal English', desc: 'Kosakata formal, riset, dan analisis esai', color: 'from-purple-700 to-indigo-900', icon: 'landmark', tag: 'Academic', cefr: 'B2-C1' },
  { id: 'tech_science', title: 'Tech, Science & Innovation', desc: 'Istilah teknologi, komputasi, dan sains', color: 'from-blue-600 to-indigo-800', icon: 'zap', tag: 'STEM', cefr: 'B1-C1' },
  { id: 'daily_nature', title: 'Travel, Culture & Nature', desc: 'Perjalanan, budaya global, dan lingkungan', color: 'from-teal-600 to-emerald-800', icon: 'compass', tag: 'Global', cefr: 'A1-B2' },
  { id: 'all', title: 'All 4,080+ Words (Nonstop)', desc: 'Campuran seluruh korpus tanpa batas level', color: 'from-indigo-700 to-slate-900', icon: 'sparkles', tag: 'Full Mix', cefr: 'ALL' }
];

function getDeckVocab(deckId, allVocab, weakWords = []) {
  const list = allVocab || [];
  if (deckId === 'weak_vault') return weakWords.length ? weakWords : list.slice(0, 20);
  if (deckId === 'all') return list;
  if (deckId === 'ox_a1') return list.filter(w => w.cefr === 'A1');
  if (deckId === 'ox_a2') return list.filter(w => w.cefr === 'A2');
  if (deckId === 'ox_b1') return list.filter(w => w.cefr === 'B1');
  if (deckId === 'ox_b2') return list.filter(w => w.cefr === 'B2');
  if (deckId === 'ox_c1') return list.filter(w => w.cefr === 'C1');
  if (deckId === 'common_1000') return list.filter(w => w.cefr === 'A1' || w.cefr === 'A2').slice(0, 1000);
  if (deckId === 'conversational') return list.filter(w => ['A1', 'A2', 'B1'].includes(w.cefr) && ['Verbs', 'Expressions', 'Adjectives', 'Food', 'Travel'].includes(w.category));
  if (deckId === 'business_career') {
    const kw = /company|office|market|business|price|cost|contract|manage|report|pay|bank|service|travel|schedule|meeting|staff|product|customer|trade|tax|budget|client|profit|hotel|flight|project|order|finance|industry/i;
    const matched = list.filter(w => kw.test(w.word) || kw.test(w.definition));
    return matched.length >= 200 ? matched : list.filter(w => w.cefr === 'B1' || w.cefr === 'B2').slice(0, 600);
  }
  if (deckId === 'academic_research') {
    const matched = list.filter(w => (w.cefr === 'B2' || w.cefr === 'C1') && (w.category === 'Academic' || w.category === 'Adjectives' || w.category === 'Verbs' || w.category === 'Nouns'));
    return matched.slice(0, 900);
  }
  if (deckId === 'tech_science') {
    const kw = /tech|data|system|process|energy|science|research|method|device|network|electric|digital|measure|chemical|space|planet|earth|atom|cell|code|software|machine|theory/i;
    return list.filter(w => w.category === 'Tech' || kw.test(w.word) || kw.test(w.definition));
  }
  if (deckId === 'daily_nature') {
    const kw = /food|fruit|animal|bird|fish|tree|water|river|mountain|weather|rain|sun|trip|hotel|airport|cook|eat|drink|forest|ocean|garden|flower/i;
    return list.filter(w => ['Food', 'Animals', 'Nature', 'Travel'].includes(w.category) || kw.test(w.word) || kw.test(w.definition));
  }
  return list;
}
