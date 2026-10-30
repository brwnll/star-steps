// Hand-written content for the Reading and Science subjects, grades 1-3.
// Everything here is plain data so it can be read and checked by a person; questions.js turns it into questions.
// g = grade, l = level (1 easy, 2 harder). In each item the first listed answer is the right one.
(function (root) {
  // ---------- Reading: short passages with one question ----------
  // { g, l, text, q, a, wrong: [3 wrong answers] }
  const PASSAGES = [
    // Grade 1, level 1: two sentences, the answer is right there in the text.
    { g: 1, l: 1, text: 'Sam has a red ball. He kicks it to his dog.', q: 'What color is the ball?', a: 'red', wrong: ['blue', 'green', 'yellow'] },
    { g: 1, l: 1, text: 'Mia sees a bird in the tree. The bird sings a song.', q: 'Where is the bird?', a: 'in the tree', wrong: ['on the ground', 'in the pond', 'in a box'] },
    { g: 1, l: 1, text: 'It is hot today. Ben eats a cold ice pop.', q: 'What does Ben eat?', a: 'an ice pop', wrong: ['an apple', 'a hot dog', 'soup'] },
    { g: 1, l: 1, text: 'The cat naps on the mat. The sun is warm.', q: 'What does the cat do?', a: 'naps', wrong: ['runs', 'eats', 'jumps'] },
    { g: 1, l: 1, text: 'Zoe has two pets. She has a fish and a frog.', q: 'How many pets does Zoe have?', a: 'two', wrong: ['one', 'three', 'four'] },
    { g: 1, l: 1, text: 'Dad bakes a cake. It is for Leo\'s birthday.', q: 'Who is the cake for?', a: 'Leo', wrong: ['Dad', 'Mom', 'Zoe'] },
    { g: 1, l: 1, text: 'Ava puts on her boots. She jumps in a puddle.', q: 'What does Ava jump in?', a: 'a puddle', wrong: ['a pool', 'a pile of leaves', 'the sea'] },
    { g: 1, l: 1, text: 'The bus is big and yellow. Kai rides it to school.', q: 'Where does Kai go on the bus?', a: 'to school', wrong: ['to the park', 'to the zoo', 'home'] },
    { g: 1, l: 1, text: 'Nia has a blue hat. She wears it in the snow.', q: 'When does Nia wear her hat?', a: 'in the snow', wrong: ['in the bath', 'at bedtime', 'in the pool'] },
    { g: 1, l: 1, text: 'Eli sees three ducks. They swim in the pond.', q: 'How many ducks does Eli see?', a: 'three', wrong: ['two', 'four', 'five'] },
    // Grade 1, level 2: three sentences, a little thinking.
    { g: 1, l: 2, text: 'Nia lost her hat. She looked under the bed. There it was!', q: 'Where was the hat?', a: 'under the bed', wrong: ['in the car', 'on her head', 'at school'] },
    { g: 1, l: 2, text: 'Eli planted a seed. He gave it water every day. Soon a green sprout came up.', q: 'Why did the sprout grow?', a: 'Eli gave it water', wrong: ['Eli sang to it', 'it was cold', 'Eli hid it'] },
    { g: 1, l: 2, text: 'The sky got dark. Rain began to fall. Mia ran inside.', q: 'Why did Mia run inside?', a: 'it started to rain', wrong: ['she was hungry', 'she saw a dog', 'it was bedtime'] },
    { g: 1, l: 2, text: 'Ben has a new puppy. The puppy chews his shoe. Ben laughs.', q: 'How does Ben feel?', a: 'happy', wrong: ['sad', 'scared', 'angry'] },
    { g: 1, l: 2, text: 'Ruby wakes up early. She eats toast. Then she walks to the bus stop.', q: 'What does Ruby do first?', a: 'wakes up', wrong: ['eats toast', 'walks to the bus stop', 'rides the bus'] },
    { g: 1, l: 2, text: 'Leo\'s kite went up, up, up. Then the wind stopped. The kite came down.', q: 'Why did the kite come down?', a: 'the wind stopped', wrong: ['the string broke', 'Leo let go', 'it rained'] },
    { g: 1, l: 2, text: 'Zoe shares her crackers with Sam. Sam says thank you. They eat together.', q: 'What does Zoe share?', a: 'crackers', wrong: ['grapes', 'a toy', 'a book'] },
    { g: 1, l: 2, text: 'Max cannot find his cat. He hears a meow. The cat is in the closet.', q: 'How does Max find the cat?', a: 'he hears a meow', wrong: ['he sees a tail', 'Mom tells him', 'the cat runs out'] },
    { g: 1, l: 2, text: 'Ava drops her ice cream. It falls on the ground. Her lip starts to shake.', q: 'How does Ava feel?', a: 'sad', wrong: ['happy', 'excited', 'proud'] },
    { g: 1, l: 2, text: 'Kai cannot reach the book. He gets a stool. Now he can reach it.', q: 'How does Kai reach the book?', a: 'he stands on a stool', wrong: ['he jumps', 'Dad lifts him', 'he gets a ladder'] },
    // Grade 2, level 1
    { g: 2, l: 1, text: 'Penguins are birds, but they cannot fly. They use their wings to swim. They live where it is very cold.', q: 'What do penguins use their wings for?', a: 'swimming', wrong: ['flying', 'digging', 'singing'] },
    { g: 2, l: 1, text: 'Ava and Leo built a snowman. They used a carrot for its nose. They gave it a hat. Then the sun came out and it began to melt.', q: 'What did they use for the nose?', a: 'a carrot', wrong: ['a rock', 'a button', 'a stick'] },
    { g: 2, l: 1, text: 'Sam wanted to ride his bike, but the tire was flat. His sister helped him pump it up. Then they rode to the park.', q: 'What was wrong with the bike?', a: 'the tire was flat', wrong: ['the chain broke', 'the seat was gone', 'it was too small'] },
    { g: 2, l: 1, text: 'Bees fly from flower to flower. They collect sweet nectar. Back at the hive, they turn it into honey.', q: 'What do bees make?', a: 'honey', wrong: ['milk', 'jam', 'bread'] },
    { g: 2, l: 1, text: 'Kai\'s class has a pet turtle named Tank. Tank eats lettuce. He likes to sit under his warm lamp.', q: 'What does Tank eat?', a: 'lettuce', wrong: ['pizza', 'cookies', 'cereal'] },
    { g: 2, l: 1, text: 'The library is quiet. Nia picks a book about dragons. She sits in a big soft chair and reads until Mom says it is time to go.', q: 'What is Nia\'s book about?', a: 'dragons', wrong: ['cats', 'trucks', 'the sea'] },
    { g: 2, l: 1, text: 'A tadpole hatches from an egg in a pond. It grows legs. Its tail gets shorter. At last it is a frog.', q: 'What does a tadpole become?', a: 'a frog', wrong: ['a fish', 'a bird', 'a snake'] },
    { g: 2, l: 1, text: 'Ben lost a tooth at lunch. He put it in a bag. That night he put the bag under his pillow.', q: 'Where did Ben put the tooth at night?', a: 'under his pillow', wrong: ['in his desk', 'in the trash', 'in his pocket'] },
    { g: 2, l: 1, text: 'Ruby\'s grandma lives on a farm. Every morning Ruby helps feed the chickens. Her favorite hen is named Pepper.', q: 'What does Ruby do every morning?', a: 'feeds the chickens', wrong: ['milks the cows', 'rides a horse', 'picks apples'] },
    { g: 2, l: 1, text: 'Zoe found a shell on the beach. It was pink and white. When she held it to her ear, she heard a sound like the sea.', q: 'What colors was the shell?', a: 'pink and white', wrong: ['blue and green', 'black and gray', 'red and gold'] },
    // Grade 2, level 2: reading between the lines, word meanings.
    { g: 2, l: 2, text: 'Mia tiptoed down the hall. She did not want to wake the baby. She found a cookie and crept back to her room.', q: 'Why did Mia tiptoe?', a: 'so she would not wake the baby', wrong: ['her feet hurt', 'she was playing a game', 'the floor was wet'] },
    { g: 2, l: 2, text: 'The old dog moved slowly. Climbing the stairs took a long time. Ruby waited for him at the top and patted his head.', q: 'What does this story show about Ruby?', a: 'she is kind', wrong: ['she is in a hurry', 'she is scared', 'she is sleepy'] },
    { g: 2, l: 2, text: 'Eli grabbed his umbrella and boots before school. When he got outside, he grinned. He was right!', q: 'What was the weather like?', a: 'rainy', wrong: ['sunny', 'snowy', 'windy'] },
    { g: 2, l: 2, text: 'The crowd cheered as Zoe crossed the finish line. She was exhausted, but she held up her ribbon with a huge smile.', q: 'What does "exhausted" mean?', a: 'very tired', wrong: ['very hungry', 'very angry', 'very cold'] },
    { g: 2, l: 2, text: 'Our town has a farmers market every Saturday. People sell corn, peaches, and honey. Dad always buys too many peaches.', q: 'When is the market?', a: 'on Saturdays', wrong: ['every day', 'on Mondays', 'at night'] },
    { g: 2, l: 2, text: 'Owls hunt at night. Their big eyes see well in the dark. Their soft feathers make no sound when they fly.', q: 'What is this passage mostly about?', a: 'how owls hunt at night', wrong: ['where owls build nests', 'what owls eat for breakfast', 'why owls are cute'] },
    { g: 2, l: 2, text: 'Leo\'s lemonade stand was empty all morning. Then he made a big sign and put it by the road. Soon a line of cars stopped.', q: 'Why did people stop?', a: 'they saw the sign', wrong: ['it was raining', 'Leo yelled', 'the road was closed'] },
    { g: 2, l: 2, text: 'Nia watered the plant every day, but its leaves turned yellow. Mom moved it to a sunny window. In a week it was green again.', q: 'What did the plant need?', a: 'more sun', wrong: ['more water', 'a bigger pot', 'less light'] },
    { g: 2, l: 2, text: 'Sam looked at the clock again and again. He tapped his foot. At last the bell rang and he raced out to the bus.', q: 'How did Sam feel while waiting?', a: 'impatient', wrong: ['sleepy', 'calm', 'sick'] },
    { g: 2, l: 2, text: 'The puppy was timid at first. It hid under the couch. After a few days it followed Ava everywhere.', q: 'What does "timid" mean?', a: 'shy', wrong: ['loud', 'hungry', 'strong'] },
    // Grade 3, level 1
    { g: 3, l: 1, text: 'The Sahara is the largest hot desert in the world. Days can be very hot, but nights get surprisingly cold. Camels can go days without water, which makes them perfect for desert travel.', q: 'Why are camels good for desert travel?', a: 'they can go days without water', wrong: ['they run very fast', 'they like the cold', 'they eat sand'] },
    { g: 3, l: 1, text: 'Maya wanted to learn to skateboard. The first day she fell six times. She kept practicing after school. By the end of the month, she could ride all the way down the street.', q: 'How did Maya learn to skateboard?', a: 'by practicing every day', wrong: ['by watching videos', 'by reading a book', 'by asking a coach'] },
    { g: 3, l: 1, text: 'A volcano is a mountain with an opening at the top. Melted rock called lava can pour out. When lava cools, it turns into hard black rock.', q: 'What is lava?', a: 'melted rock', wrong: ['cold water', 'black sand', 'hot air'] },
    { g: 3, l: 1, text: 'Jaden\'s family planted a garden. They grew tomatoes, beans, and pumpkins. The pumpkins took the longest to grow, but they were the biggest by far.', q: 'Which plant grew the biggest?', a: 'pumpkins', wrong: ['tomatoes', 'beans', 'corn'] },
    { g: 3, l: 1, text: 'Honeybees talk by dancing. A bee that finds flowers does a "waggle dance" in the hive. The dance tells the other bees which way to fly and how far.', q: 'What does the waggle dance tell other bees?', a: 'where the flowers are', wrong: ['when to sleep', 'who the queen is', 'how to make honey'] },
    { g: 3, l: 1, text: 'Priya forgot her lunch at home. Her friend Omar gave her half of his sandwich. The next day, Priya brought cookies to share with Omar.', q: 'Why did Priya bring cookies?', a: 'to thank Omar', wrong: ['it was her birthday', 'she did not like them', 'the teacher asked her to'] },
    { g: 3, l: 1, text: 'The Great Wall of China is thousands of miles long. It was built long ago to keep out enemies. Today, people from all over the world visit it.', q: 'Why was the wall built?', a: 'to keep out enemies', wrong: ['for people to visit', 'to hold back water', 'to use as a road'] },
    { g: 3, l: 1, text: 'Sea turtles lay their eggs on the beach at night. They dig a hole in the sand and cover the eggs. Weeks later, the babies hatch and crawl to the sea.', q: 'Where do sea turtles lay their eggs?', a: 'on the beach', wrong: ['in the water', 'in a tree', 'under a rock'] },
    { g: 3, l: 1, text: 'Marcus built a birdhouse with his uncle. They measured each board twice before cutting. When they hung it in the oak tree, a wren moved in the very next day.', q: 'Where did they hang the birdhouse?', a: 'in the oak tree', wrong: ['on the porch', 'by the garage', 'on a pole'] },
    { g: 3, l: 1, text: 'Dolphins are not fish. They are mammals, so they breathe air through a blowhole on top of their heads. They must swim to the surface to take a breath.', q: 'How do dolphins breathe?', a: 'through a blowhole', wrong: ['through gills', 'through their mouths underwater', 'they do not breathe'] },
    // Grade 3, level 2: main ideas, word meanings, feelings and reasons.
    { g: 3, l: 2, text: 'Diego stared at the empty page. The story was due tomorrow and he had no ideas. Then his cat knocked over a glass of water, and Diego smiled. He began to write about a clumsy cat.', q: 'What gave Diego his idea?', a: 'his cat', wrong: ['his teacher', 'a book', 'his brother'] },
    { g: 3, l: 2, text: 'The forest was silent after the storm. Branches lay everywhere. A small fawn stepped out, sniffed the air, and nibbled a leaf as if nothing had happened.', q: 'What does "silent" mean?', a: 'quiet', wrong: ['dark', 'wet', 'scary'] },
    { g: 3, l: 2, text: 'Ants are tiny, but they are strong. An ant can carry something fifty times its own weight. That is like a person lifting a car!', q: 'Why does the author mention a person lifting a car?', a: 'to show how strong ants are', wrong: ['to say people are weak', 'to explain how cars work', 'to tell a joke about ants'] },
    { g: 3, l: 2, text: 'Nobody wanted to be partners with the new kid, Theo. Lena remembered her first day at a new school. She walked over and asked Theo to work with her.', q: 'Why did Lena ask Theo to be her partner?', a: 'she remembered feeling new too', wrong: ['the teacher made her', 'Theo was her cousin', 'she had no other choice'] },
    { g: 3, l: 2, text: 'Mount Everest is the tallest mountain on Earth. The air near the top has very little oxygen, so climbers carry tanks of it. Even so, reaching the top can take weeks.', q: 'Why do climbers carry oxygen tanks?', a: 'the air near the top has little oxygen', wrong: ['to stay warm', 'to cook food', 'to signal for help'] },
    { g: 3, l: 2, text: 'Grandpa\'s hands were rough and wrinkled. He had fixed boats for forty years. "Every scar is a story," he said, and he told me three of them before dinner.', q: 'What did Grandpa do for a living?', a: 'fixed boats', wrong: ['taught school', 'drove a truck', 'baked bread'] },
    { g: 3, l: 2, text: 'The recycling club collected bottles for a month. They turned them in and earned enough money for new library books. The principal said it was the best club project ever.', q: 'What is the main idea?', a: 'the club helped the school by recycling', wrong: ['bottles are heavy', 'the principal likes books', 'clubs meet after school'] },
    { g: 3, l: 2, text: 'Rosa trained for the spelling bee for weeks. In the final round she missed "necessary". She was disappointed, but she shook the winner\'s hand and said, "Next year!"', q: 'What does Rosa\'s last line show about her?', a: 'she will not give up', wrong: ['she is angry', 'she is a bad speller', 'she wants to quit'] },
    { g: 3, l: 2, text: 'The lighthouse keeper climbed the stairs every evening to light the lamp. Ships far out at sea used its beam to steer clear of the rocks. In fifty years, he never missed a night.', q: 'What does the passage suggest about the keeper?', a: 'he was dependable', wrong: ['he was afraid of the dark', 'he disliked ships', 'he was often late'] },
    { g: 3, l: 2, text: 'Hummingbirds are the only birds that can fly backward. Their wings beat about fifty times each second. To get enough energy, they drink nectar from hundreds of flowers a day.', q: 'Why do hummingbirds visit so many flowers?', a: 'they need a lot of energy', wrong: ['they are lost', 'they like the colors', 'to build nests'] },
  ];

  // ---------- Reading: putting events in order ----------
  // { g, steps: [...] } in the right order, 3 or 4 steps.
  const SEQUENCES = [
    { g: 1, steps: ['wake up', 'eat breakfast', 'go to school'] },
    { g: 1, steps: ['plant the seed', 'water it', 'a flower grows'] },
    { g: 1, steps: ['crack the egg', 'cook it', 'eat it'] },
    { g: 1, steps: ['put on socks', 'put on shoes', 'tie the laces'] },
    { g: 1, steps: ['fill the tub', 'take a bath', 'dry off'] },
    { g: 2, steps: ['mix the batter', 'bake the cake', 'eat a slice'] },
    { g: 2, steps: ['the caterpillar eats leaves', 'it makes a chrysalis', 'it becomes a butterfly'] },
    { g: 2, steps: ['pack a bag', 'ride to the beach', 'build a sandcastle'] },
    { g: 2, steps: ['get a library card', 'pick out a book', 'read it at home'] },
    { g: 2, steps: ['buy the seeds', 'dig a hole', 'plant them', 'wait for sprouts'] },
    { g: 3, steps: ['the bird gathers sticks', 'it builds a nest', 'it lays eggs', 'the chicks hatch'] },
    { g: 3, steps: ['snow falls', 'the kids build a snowman', 'the sun comes out', 'the snowman melts'] },
    { g: 3, steps: ['write a story', 'fix the mistakes', 'read it to the class'] },
    { g: 3, steps: ['plant seeds in spring', 'water them all summer', 'pick pumpkins in fall'] },
    { g: 3, steps: ['the sun warms the sea', 'water rises as vapor', 'clouds form', 'rain falls'] },
  ];

  // ---------- Science: sorting data ----------
  // Animal groups. Grade 1 uses only mammal/bird/fish/insect with easy animals.
  const ANIMALS = {
    dog: ['🐶', 'mammal', 1], cat: ['🐱', 'mammal', 1], cow: ['🐮', 'mammal', 1], horse: ['🐴', 'mammal', 1], elephant: ['🐘', 'mammal', 1],
    whale: ['🐳', 'mammal', 2], bat: ['🦇', 'mammal', 3], dolphin: ['🐬', 'mammal', 2],
    eagle: ['🦅', 'bird', 1], penguin: ['🐧', 'bird', 2], owl: ['🦉', 'bird', 1], duck: ['🦆', 'bird', 1], chicken: ['🐔', 'bird', 1],
    shark: ['🦈', 'fish', 1], goldfish: ['🐟', 'fish', 1], clownfish: ['🐠', 'fish', 1],
    snake: ['🐍', 'reptile', 2], lizard: ['🦎', 'reptile', 2], turtle: ['🐢', 'reptile', 2], crocodile: ['🐊', 'reptile', 2],
    frog: ['🐸', 'amphibian', 2],
    butterfly: ['🦋', 'insect', 1], bee: ['🐝', 'insect', 1], ant: ['🐜', 'insect', 1], ladybug: ['🐞', 'insect', 1], beetle: ['🪲', 'insect', 1],
  };
  const GROUPS = { 1: ['mammal', 'bird', 'fish', 'insect'], 2: ['mammal', 'bird', 'fish', 'insect', 'reptile', 'amphibian'], 3: ['mammal', 'bird', 'fish', 'insect', 'reptile', 'amphibian'] };

  const LIVING = { living: [['tree', '🌳'], ['dog', '🐶'], ['flower', '🌸'], ['mushroom', '🍄'], ['fish', '🐟'], ['girl', '👧'], ['grass', '🌱'], ['bird', '🐦'], ['frog', '🐸'], ['cactus', '🌵']],
    'non-living': [['rock', '🪨'], ['car', '🚗'], ['chair', '🪑'], ['ball', '⚽'], ['book', '📚'], ['spoon', '🥄'], ['robot', '🤖'], ['bike', '🚲'], ['hat', '🎩'], ['clock', '🕐']] };

  const MATTER = { solid: [['ice cube', '🧊'], ['rock', '🪨'], ['apple', '🍎'], ['spoon', '🥄'], ['book', '📚'], ['brick', '🧱'], ['pencil', '✏️']],
    liquid: [['milk', '🥛'], ['juice', '🧃'], ['honey', '🍯'], ['rain', '🌧️'], ['hot tea', '🍵'], ['ocean water', '🌊']],
    gas: [['steam', '♨️'], ['the air in a balloon', '🎈'], ['the air we breathe', '💨'], ['smoke', '🌫️']] };

  const SENSES = { sight: ['👀', ['see a rainbow', 'read a sign', 'watch a bird fly']], hearing: ['👂', ['hear a bell ring', 'listen to music', 'hear a dog bark']],
    smell: ['👃', ['smell flowers', 'smell cookies baking', 'smell the rain']], taste: ['👅', ['taste a lemon', 'taste ice cream', 'taste salty chips']],
    touch: ['✋', ['feel a soft blanket', 'feel cold snow', 'feel a bumpy rock']] };

  const HABITATS = { ocean: ['🌊', [['shark', '🦈'], ['whale', '🐳'], ['octopus', '🐙'], ['crab', '🦀']]],
    desert: ['🏜️', [['camel', '🐪'], ['scorpion', '🦂'], ['rattlesnake', '🐍'], ['lizard', '🦎']]],
    forest: ['🌲', [['deer', '🦌'], ['squirrel', '🐿️'], ['bear', '🐻'], ['owl', '🦉']]],
    'icy polar lands': ['❄️', [['polar bear', '🐻‍❄️'], ['seal', '🦭']]],
    pond: ['🏞️', [['frog', '🐸'], ['duck', '🦆'], ['dragonfly', '🪰'], ['beaver', '🦫']]],
    farm: ['🚜', [['cow', '🐮'], ['pig', '🐷'], ['chicken', '🐔'], ['sheep', '🐑']]],
    rainforest: ['🌴', [['monkey', '🐒'], ['parrot', '🦜'], ['sloth', '🦥'], ['jaguar', '🐆']]] };

  const LIFECYCLES = { frog: ['🐸', ['egg', 'tadpole', 'froglet', 'frog']], butterfly: ['🦋', ['egg', 'caterpillar', 'chrysalis', 'butterfly']],
    plant: ['🌻', ['seed', 'sprout', 'plant', 'flower']], chicken: ['🐔', ['egg', 'chick', 'hen']] };

  const PLANT_PARTS = { roots: ['take in water from the soil', 'hold the plant in the ground'], stem: ['holds the plant up', 'carries water up to the leaves'],
    leaves: ['make food from sunlight'], flower: ['makes the seeds'], seed: ['grows into a new plant'] };

  // ---------- Science: facts ----------
  // { g, l, q, a, wrong: [3] }
  const FACTS = [
    // Grade 1, level 1
    { g: 1, l: 1, q: 'What do plants need to grow?', a: 'water and sunlight', wrong: ['candy and milk', 'rocks and sand', 'toys and books'] },
    { g: 1, l: 1, q: 'What do we call frozen water?', a: 'ice', wrong: ['steam', 'mud', 'sand'] },
    { g: 1, l: 1, q: 'Which season is the coldest?', a: 'winter', wrong: ['summer', 'spring', 'fall'] },
    { g: 1, l: 1, q: 'What is the big bright star that lights up the day?', a: 'the sun', wrong: ['the moon', 'a cloud', 'a lamp'] },
    { g: 1, l: 1, q: 'When do we see the stars?', a: 'at night', wrong: ['at lunch', 'in the morning', 'at noon'] },
    { g: 1, l: 1, q: 'How many legs does an insect have?', a: 'six', wrong: ['four', 'eight', 'two'] },
    { g: 1, l: 1, q: 'Which animal lays eggs?', a: 'chicken', wrong: ['dog', 'cow', 'cat'] },
    { g: 1, l: 1, q: 'What covers a bird\'s body?', a: 'feathers', wrong: ['fur', 'scales', 'shells'] },
    { g: 1, l: 1, q: 'What do you use to smell a flower?', a: 'your nose', wrong: ['your ears', 'your eyes', 'your feet'] },
    { g: 1, l: 1, q: 'Which is hot?', a: 'the sun', wrong: ['ice', 'snow', 'the moon'] },
    // Grade 1, level 2
    { g: 1, l: 2, q: 'What do we call a baby frog?', a: 'a tadpole', wrong: ['a puppy', 'a kitten', 'a chick'] },
    { g: 1, l: 2, q: 'What do fish use to breathe?', a: 'gills', wrong: ['lungs', 'noses', 'fins'] },
    { g: 1, l: 2, q: 'Which of these is a mammal?', a: 'dog', wrong: ['snake', 'goldfish', 'butterfly'] },
    { g: 1, l: 2, q: 'What do bees collect from flowers?', a: 'nectar', wrong: ['water', 'leaves', 'dirt'] },
    { g: 1, l: 2, q: 'What makes a shadow?', a: 'something blocking light', wrong: ['wind', 'rain', 'cold air'] },
    { g: 1, l: 2, q: 'What hard parts inside your body hold you up?', a: 'bones', wrong: ['skin', 'hair', 'blood'] },
    { g: 1, l: 2, q: 'What do we call animals that are awake at night?', a: 'nocturnal', wrong: ['sleepy', 'hungry', 'giant'] },
    { g: 1, l: 2, q: 'Which is a sign of spring?', a: 'flowers blooming', wrong: ['snow falling', 'leaves turning red', 'days getting shorter'] },
    { g: 1, l: 2, q: 'What does a magnet pull on?', a: 'things made of iron', wrong: ['things made of wood', 'things made of paper', 'things made of glass'] },
    { g: 1, l: 2, q: 'What does a pumpkin grow on?', a: 'a vine', wrong: ['a tree', 'a rock', 'a cloud'] },
    // Grade 2, level 1
    { g: 2, l: 1, q: 'What is at the center of our solar system?', a: 'the sun', wrong: ['Earth', 'the moon', 'Mars'] },
    { g: 2, l: 1, q: 'Which planet do we live on?', a: 'Earth', wrong: ['Mars', 'the sun', 'Jupiter'] },
    { g: 2, l: 1, q: 'What are the three states of matter?', a: 'solid, liquid, gas', wrong: ['hot, cold, warm', 'big, medium, small', 'red, blue, green'] },
    { g: 2, l: 1, q: 'What happens to water when it gets very cold?', a: 'it freezes', wrong: ['it boils', 'it disappears', 'it turns green'] },
    { g: 2, l: 1, q: 'What tool measures how hot or cold it is?', a: 'a thermometer', wrong: ['a ruler', 'a clock', 'a scale'] },
    { g: 2, l: 1, q: 'Which animal is a reptile?', a: 'lizard', wrong: ['frog', 'dog', 'eagle'] },
    { g: 2, l: 1, q: 'What do caterpillars turn into?', a: 'butterflies', wrong: ['bees', 'birds', 'frogs'] },
    { g: 2, l: 1, q: 'Which part of your body pumps blood?', a: 'the heart', wrong: ['the lungs', 'the stomach', 'the brain'] },
    { g: 2, l: 1, q: 'What force pulls things down toward the ground?', a: 'gravity', wrong: ['wind', 'light', 'sound'] },
    { g: 2, l: 1, q: 'What do we call water that rises into the air as a gas?', a: 'water vapor', wrong: ['ice', 'snow', 'mud'] },
    // Grade 2, level 2
    { g: 2, l: 2, q: 'What do we call an animal that eats only plants?', a: 'a herbivore', wrong: ['a carnivore', 'an omnivore', 'a predator'] },
    { g: 2, l: 2, q: 'What gas do people need to breathe?', a: 'oxygen', wrong: ['helium', 'smoke', 'steam'] },
    { g: 2, l: 2, q: 'Which of these can a magnet pick up?', a: 'a paper clip', wrong: ['a plastic cup', 'a leaf', 'a rubber band'] },
    { g: 2, l: 2, q: 'What are the four seasons?', a: 'winter, spring, summer, fall', wrong: ['day, night, dawn, dusk', 'rain, snow, sun, wind', 'north, south, east, west'] },
    { g: 2, l: 2, q: 'What is the outside layer of the Earth that we walk on called?', a: 'the crust', wrong: ['the core', 'the sky', 'the ocean'] },
    { g: 2, l: 2, q: 'Why can we see the moon at night?', a: 'it reflects the sun\'s light', wrong: ['it makes its own light', 'it is on fire', 'it is a giant lamp'] },
    { g: 2, l: 2, q: 'What do plants give off that helps us breathe?', a: 'oxygen', wrong: ['water', 'smoke', 'dust'] },
    { g: 2, l: 2, q: 'How many planets are in our solar system?', a: 'eight', wrong: ['three', 'twelve', 'one hundred'] },
    { g: 2, l: 2, q: 'What do we call a scientist who studies the weather?', a: 'a meteorologist', wrong: ['a dentist', 'an astronaut', 'a chef'] },
    { g: 2, l: 2, q: 'What happens to your shadow at noon, when the sun is high?', a: 'it gets short', wrong: ['it gets very long', 'it turns blue', 'it points at the sun'] },
    // Grade 3, level 1
    { g: 3, l: 1, q: 'What is a food chain?', a: 'how energy passes from one living thing to another', wrong: ['a chain made of food', 'the line at lunch', 'a kind of necklace'] },
    { g: 3, l: 1, q: 'Which simple machine is a ramp?', a: 'an inclined plane', wrong: ['a pulley', 'a wheel', 'a screw'] },
    { g: 3, l: 1, q: 'What force slows down a sliding object?', a: 'friction', wrong: ['gravity', 'magnetism', 'light'] },
    { g: 3, l: 1, q: 'What do we call animals with a backbone?', a: 'vertebrates', wrong: ['invertebrates', 'insects', 'herbivores'] },
    { g: 3, l: 1, q: 'Where does a plant make its food?', a: 'in its leaves', wrong: ['in its roots', 'in the soil', 'in the flower'] },
    { g: 3, l: 1, q: 'What is the closest star to Earth?', a: 'the sun', wrong: ['the North Star', 'the moon', 'Mars'] },
    { g: 3, l: 1, q: 'What is sound made by?', a: 'vibrations', wrong: ['light', 'heat', 'smells'] },
    { g: 3, l: 1, q: 'Which is a renewable energy source?', a: 'sunlight', wrong: ['coal', 'oil', 'natural gas'] },
    { g: 3, l: 1, q: 'At what temperature does water boil?', a: '100 degrees Celsius', wrong: ['0 degrees Celsius', '50 degrees Celsius', '1,000 degrees Celsius'] },
    { g: 3, l: 1, q: 'What do we call the amount of space something takes up?', a: 'volume', wrong: ['weight', 'length', 'color'] },
    // Grade 3, level 2
    { g: 3, l: 2, q: 'What do fossils tell us about?', a: 'plants and animals from long ago', wrong: ['tomorrow\'s weather', 'how to cook', 'how to build houses'] },
    { g: 3, l: 2, q: 'What is the process plants use to make food from sunlight?', a: 'photosynthesis', wrong: ['digestion', 'evaporation', 'migration'] },
    { g: 3, l: 2, q: 'An animal that eats both plants and animals is called?', a: 'an omnivore', wrong: ['a herbivore', 'a carnivore', 'a producer'] },
    { g: 3, l: 2, q: 'Why do some birds fly south for the winter?', a: 'to find food and warmer weather', wrong: ['to get taller', 'to learn to swim', 'because they are lost'] },
    { g: 3, l: 2, q: 'Which is a physical change, not a chemical change?', a: 'ice melting', wrong: ['wood burning', 'a cake baking', 'iron rusting'] },
    { g: 3, l: 2, q: 'What holds the planets in orbit around the sun?', a: 'gravity', wrong: ['wind', 'magnets', 'light'] },
    { g: 3, l: 2, q: 'What do we call the path the Earth takes around the sun?', a: 'an orbit', wrong: ['a rotation', 'a season', 'a tide'] },
    { g: 3, l: 2, q: 'How long does Earth take to go all the way around the sun?', a: 'one year', wrong: ['one day', 'one month', 'one hour'] },
    { g: 3, l: 2, q: 'What causes day and night?', a: 'the Earth spinning', wrong: ['the sun moving around Earth', 'clouds covering the sun', 'the moon\'s light'] },
    { g: 3, l: 2, q: 'What is the Earth\'s natural satellite?', a: 'the moon', wrong: ['the sun', 'Mars', 'a cloud'] },
  ];

  // Names that take no 'a'/'an' in front (mass nouns and phrases).
  const NO_ARTICLE = ['milk', 'juice', 'honey', 'rain', 'hot tea', 'ocean water', 'steam', 'the air in a balloon', 'the air we breathe', 'smoke', 'grass'];

  const api = { NO_ARTICLE, PASSAGES, SEQUENCES, ANIMALS, GROUPS, LIVING, MATTER, SENSES, HABITATS, LIFECYCLES, PLANT_PARTS, FACTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Lessons = api;
})(this);
