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
    { g: 1, l: 1, text: 'Nia has a blue hat. She wears it in the snow.', q: 'Where does Nia wear her hat?', a: 'in the snow', wrong: ['in the bath', 'at bedtime', 'in the pool'] },
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
    { g: 2, l: 1, text: 'Zoe found a shell on the beach. It was pink and white. When she held it to her ear, she heard a sound like the sea.', q: 'What color was the shell?', a: 'pink and white', wrong: ['blue and green', 'black and gray', 'red and gold'] },
    // Grade 2, level 2: reading between the lines, word meanings.
    { g: 2, l: 2, text: 'Mia tiptoed down the hall. She did not want to wake the baby. She found a cookie and crept back to her room.', q: 'Why did Mia tiptoe?', a: 'so she would not wake the baby', wrong: ['her feet hurt', 'she was playing a game', 'the floor was wet'] },
    { g: 2, l: 2, text: 'The old dog moved slowly. Climbing the stairs took a long time. Ruby waited for him at the top and patted his head.', q: 'What does this story show about Ruby?', a: 'she is kind', wrong: ['she is in a hurry', 'she is scared', 'she is sleepy'] },
    { g: 2, l: 2, text: 'Eli grabbed his umbrella and boots before school. When he got outside, he grinned. He was right!', q: 'What was the weather like?', a: 'rainy', wrong: ['sunny', 'snowy', 'windy'] },
    { g: 2, l: 2, text: 'The crowd cheered as Zoe crossed the finish line. She was exhausted, but she held up her ribbon with a huge smile.', q: 'What does "exhausted" mean?', a: 'very tired', wrong: ['very hungry', 'very angry', 'very cold'] },
    { g: 2, l: 1, text: 'Our town has a farmers market every Saturday. People sell corn, peaches, and honey. Dad always buys too many peaches.', q: 'When is the market?', a: 'on Saturdays', wrong: ['every day', 'on Mondays', 'at night'] },
    { g: 2, l: 2, text: 'Owls hunt at night. Their big eyes see well in the dark. Their soft feathers make no sound when they fly.', q: 'What is this passage mostly about?', a: 'how owls hunt at night', wrong: ['where owls build nests', 'what owls eat for breakfast', 'why owls are cute'] },
    { g: 2, l: 2, text: 'Leo\'s lemonade stand was empty all morning. Then he made a big sign and put it by the road. Soon a line of cars stopped.', q: 'Why did people stop?', a: 'they saw the sign', wrong: ['it was raining', 'Leo yelled', 'the road was closed'] },
    { g: 2, l: 2, text: 'Nia watered the plant every day, but its leaves turned yellow. Mom moved it to a sunny window. In a week it was green again.', q: 'What did the plant need?', a: 'more sun', wrong: ['more water', 'a bigger pot', 'less light'] },
    { g: 2, l: 2, text: 'Sam looked at the clock again and again. He tapped his foot. At last the bell rang and he raced out to the bus.', q: 'How did Sam feel while waiting?', a: 'impatient', wrong: ['sleepy', 'calm', 'sick'] },
    { g: 2, l: 2, text: 'The puppy was timid at first. It hid under the couch. After a few days it followed Ava everywhere.', q: 'What does "timid" mean?', a: 'shy', wrong: ['loud', 'hungry', 'strong'] },
    // Grade 3, level 1
    { g: 3, l: 1, text: 'The Sahara is the largest hot desert in the world. Days can be very hot, but nights get surprisingly cold. Camels can go days without water, which makes them perfect for desert travel.', q: 'Why are camels good for desert travel?', a: 'they can go days without water', wrong: ['they run very fast', 'they like the cold', 'they eat sand'] },
    { g: 3, l: 2, text: 'Maya wanted to learn to skateboard. The first day she fell six times. She kept practicing after school. By the end of the month, she could ride all the way down the street.', q: 'How did Maya learn to skateboard?', a: 'by practicing every day', wrong: ['by watching videos', 'by reading a book', 'by asking a coach'] },
    { g: 3, l: 1, text: 'A volcano is a mountain with an opening at the top. Melted rock called lava can pour out. When lava cools, it turns into hard black rock.', q: 'What is lava?', a: 'melted rock', wrong: ['cold water', 'black sand', 'hot air'] },
    { g: 3, l: 1, text: 'Jaden\'s family planted a garden. They grew tomatoes, beans, and pumpkins. The pumpkins took the longest to grow, but they were the biggest by far.', q: 'Which plant grew the biggest?', a: 'pumpkins', wrong: ['tomatoes', 'beans', 'corn'] },
    { g: 3, l: 1, text: 'Honeybees talk by dancing. A bee that finds flowers does a "waggle dance" in the hive. The dance tells the other bees which way to fly and how far.', q: 'What does the waggle dance tell other bees?', a: 'where the flowers are', wrong: ['when to sleep', 'who the queen is', 'how to make honey'] },
    { g: 3, l: 2, text: 'Priya forgot her lunch at home. Her friend Omar gave her half of his sandwich. The next day, Priya brought cookies to share with Omar.', q: 'Why did Priya bring cookies?', a: 'to thank Omar', wrong: ['it was her birthday', 'she did not like them', 'the teacher asked her to'] },
    { g: 3, l: 1, text: 'The Great Wall of China is thousands of miles long. It was built long ago to keep out enemies. Today, people from all over the world visit it.', q: 'Why was the wall built?', a: 'to keep out enemies', wrong: ['for people to visit', 'to hold back water', 'to use as a road'] },
    { g: 3, l: 1, text: 'Sea turtles lay their eggs on the beach at night. They dig a hole in the sand and cover the eggs. Weeks later, the babies hatch and crawl to the sea.', q: 'Where do sea turtles lay their eggs?', a: 'on the beach', wrong: ['in the water', 'in a tree', 'under a rock'] },
    { g: 3, l: 1, text: 'Marcus built a birdhouse with his uncle. They measured each board twice before cutting. When they hung it in the oak tree, a wren moved in the very next day.', q: 'Where did they hang the birdhouse?', a: 'in the oak tree', wrong: ['on the porch', 'by the garage', 'on a pole'] },
    { g: 3, l: 1, text: 'Dolphins are not fish. They are mammals, so they breathe air through a blowhole on top of their heads. They must swim to the surface to take a breath.', q: 'How do dolphins breathe?', a: 'through a blowhole', wrong: ['through gills', 'through their mouths underwater', 'they do not breathe'] },
    // Grade 3, level 2: main ideas, word meanings, feelings and reasons.
    { g: 3, l: 2, text: 'Diego stared at the empty page. The story was due tomorrow and he had no ideas. Then his cat knocked over a glass of water, and Diego smiled. He began to write about a clumsy cat.', q: 'What gave Diego his idea?', a: 'his cat', wrong: ['his teacher', 'a book', 'his brother'] },
    { g: 3, l: 2, text: 'The forest was silent after the storm. Branches lay everywhere. A small fawn stepped out, sniffed the air, and nibbled a leaf as if nothing had happened.', q: 'What does "silent" mean?', a: 'quiet', wrong: ['dark', 'wet', 'scary'] },
    { g: 3, l: 2, text: 'Ants are tiny, but they are strong. An ant can carry something fifty times its own weight. That is like a person lifting a car!', q: 'Why does the author mention a person lifting a car?', a: 'to show how strong ants are', wrong: ['to say people are weak', 'to explain how cars work', 'to tell a joke about ants'] },
    { g: 3, l: 2, text: 'Nobody wanted to be partners with the new kid, Theo. Lena remembered her first day at a new school. She walked over and asked Theo to work with her.', q: 'Why did Lena ask Theo to be her partner?', a: 'she remembered feeling new too', wrong: ['the teacher made her', 'Theo was her cousin', 'she had no other choice'] },
    { g: 3, l: 1, text: 'Mount Everest is the tallest mountain on Earth. The air near the top has very little oxygen, so climbers carry tanks of it. Even so, reaching the top can take weeks.', q: 'Why do climbers carry oxygen tanks?', a: 'the air near the top has little oxygen', wrong: ['to stay warm', 'to cook food', 'to signal for help'] },
    { g: 3, l: 1, text: 'Grandpa\'s hands were rough and wrinkled. He had fixed boats for forty years. "Every scar is a story," he said, and he told me three of them before dinner.', q: 'What did Grandpa do for a living?', a: 'fixed boats', wrong: ['taught school', 'drove a truck', 'baked bread'] },
    { g: 3, l: 2, text: 'The recycling club collected bottles for a month. They turned them in and earned enough money for new library books. The principal said it was the best club project ever.', q: 'What is the main idea?', a: 'the club helped the school by recycling', wrong: ['bottles are heavy', 'the principal likes books', 'clubs meet after school'] },
    { g: 3, l: 2, text: 'Rosa trained for the spelling bee for weeks. In the final round she missed "necessary". She was disappointed, but she shook the winner\'s hand and said, "Next year!"', q: 'What does Rosa\'s last line show about her?', a: 'she will not give up', wrong: ['she is angry', 'she is a bad speller', 'she wants to quit'] },
    { g: 3, l: 2, text: 'The lighthouse keeper climbed the stairs every evening to light the lamp. Ships far out at sea used its beam to steer clear of the rocks. In fifty years, he never missed a night.', q: 'What does the passage suggest about the keeper?', a: 'he was dependable', wrong: ['he was afraid of the dark', 'he disliked ships', 'he was often late'] },
    { g: 3, l: 2, text: 'Hummingbirds are the only birds that can fly backward. Their wings beat about fifty times each second. To get enough energy, they drink nectar from hundreds of flowers a day.', q: 'Why do hummingbirds visit so many flowers?', a: 'they need a lot of energy', wrong: ['they are lost', 'they like the colors', 'to build nests'] },
    // ---- More grade 1, level 1 ----
    { g: 1, l: 1, text: 'Omar has a pet rabbit. Its name is Snow.', q: 'What is the rabbit\'s name?', a: 'Snow', wrong: ['Omar', 'Max', 'Fluff'] },
    { g: 1, l: 1, text: 'Lena likes to swim. She goes to the pool on Sunday.', q: 'When does Lena go to the pool?', a: 'on Sunday', wrong: ['on Monday', 'at night', 'in winter'] },
    { g: 1, l: 1, text: 'The frog sits on a log. It is green and wet.', q: 'Where is the frog?', a: 'on a log', wrong: ['in a tree', 'on a rock', 'in a cup'] },
    { g: 1, l: 1, text: 'Theo got a new red bike. He rides it to the park.', q: 'What color is the bike?', a: 'red', wrong: ['blue', 'black', 'pink'] },
    { g: 1, l: 1, text: 'Rosa has a big dog. The dog likes to dig in the sand.', q: 'What does the dog like to do?', a: 'dig in the sand', wrong: ['swim', 'sleep', 'bark at cats'] },
    { g: 1, l: 1, text: 'Mom makes soup. It is hot, so Jaden blows on it.', q: 'Why does Jaden blow on the soup?', a: 'it is hot', wrong: ['it is cold', 'it is salty', 'it is funny'] },
    { g: 1, l: 1, text: 'The hen has five eggs. She sits on them to keep them warm.', q: 'How many eggs does the hen have?', a: 'five', wrong: ['two', 'three', 'ten'] },
    { g: 1, l: 1, text: 'Maya sees a bug on a leaf. The bug is red with black dots.', q: 'What color are the dots?', a: 'black', wrong: ['red', 'green', 'white'] },
    { g: 1, l: 1, text: 'Noah can hop on one foot. He hops ten times!', q: 'How many times does Noah hop?', a: 'ten', wrong: ['one', 'two', 'five'] },
    { g: 1, l: 1, text: 'It is snowing. Lily and Dad make a snowman.', q: 'What do Lily and Dad make?', a: 'a snowman', wrong: ['a cake', 'a kite', 'a fort'] },
    { g: 1, l: 1, text: 'The baby cries. Mom gives him his bottle. He stops crying.', q: 'What does Mom give the baby?', a: 'his bottle', wrong: ['a toy', 'a book', 'a hat'] },
    { g: 1, l: 1, text: 'Amir has a kite. The kite is yellow like the sun.', q: 'What is yellow?', a: 'the kite', wrong: ['the dog', 'the car', 'the hat'] },
    { g: 1, l: 1, text: 'Grace lost a tooth. She put it under her pillow.', q: 'Where did Grace put the tooth?', a: 'under her pillow', wrong: ['in a box', 'in the sink', 'in her bag'] },
    { g: 1, l: 1, text: 'The ducks swim in a line. The mom duck is in front.', q: 'Who is in front?', a: 'the mom duck', wrong: ['the baby duck', 'a fish', 'a frog'] },
    { g: 1, l: 1, text: 'Tomas has a blue cup. He fills it with milk.', q: 'What is in the cup?', a: 'milk', wrong: ['water', 'juice', 'soup'] },
    // ---- More grade 1, level 2 ----
    { g: 1, l: 2, text: 'Hana put on her coat and mittens. She opened the door. Her nose got cold right away.', q: 'What was it like outside?', a: 'cold', wrong: ['hot', 'rainy', 'dark'] },
    { g: 1, l: 2, text: 'The cat sat by the empty bowl. It meowed and meowed. Dad got the cat food.', q: 'What did the cat want?', a: 'food', wrong: ['a nap', 'to go out', 'a toy'] },
    { g: 1, l: 2, text: 'Diego built a tall tower of blocks. His baby sister crawled over. Crash!', q: 'What will Diego probably see next?', a: 'the blocks on the floor', wrong: ['a bigger tower', 'a new toy', 'his sister asleep'] },
    { g: 1, l: 2, text: 'Priya planted a sunflower seed. Every day she watered it. Now it is taller than she is!', q: 'What is this story mostly about?', a: 'Priya growing a sunflower', wrong: ['Priya taking a bath', 'a tall tree', 'a trip to the store'] },
    { g: 1, l: 2, text: '"Can I have the red crayon?" asked Omar. "Sure," said Lena. "Thank you!" said Omar.', q: 'Who gave Omar the crayon?', a: 'Lena', wrong: ['Omar', 'the teacher', 'Mom'] },
    { g: 1, l: 2, text: 'The puppy ran in the mud. Then it ran into the house. Mom said, "Bath time!"', q: 'Why did the puppy need a bath?', a: 'it was muddy', wrong: ['it was sleepy', 'it was hungry', 'it was cold'] },
    { g: 1, l: 2, text: 'Theo looked up. A big gray cloud covered the sun. He went to get his umbrella.', q: 'What does Theo think will happen?', a: 'it will rain', wrong: ['it will snow', 'the sun will get hotter', 'it will get windy'] },
    { g: 1, l: 2, text: 'Rosa dropped her toy boat in the pond. It floated away. A duck pushed it back to her!', q: 'How did Rosa probably feel when the duck pushed the boat back?', a: 'surprised and happy', wrong: ['angry', 'bored', 'sleepy'] },
    { g: 1, l: 2, text: 'Jaden could not sleep. The room was too dark. Mom turned on a night light.', q: 'What did the night light do for Jaden?', a: 'made the room less dark', wrong: ['made the room loud', 'woke him up', 'made him hungry'] },
    { g: 1, l: 2, text: 'Maya and Noah raced to the tree. Noah got there first. "Good race!" said Maya.', q: 'Who won the race?', a: 'Noah', wrong: ['Maya', 'both of them', 'nobody'] },
    { g: 1, l: 2, text: 'Lily picked all the apples she could reach. Dad lifted her up. Now she could reach the top ones.', q: 'Why did Dad lift Lily?', a: 'so she could reach the high apples', wrong: ['she was tired', 'she was scared', 'to put her in the car'] },
    { g: 1, l: 1, text: 'Amir\'s shoes were on the wrong feet. They felt funny. He switched them and smiled.', q: 'What did Amir do to fix his shoes?', a: 'switched them', wrong: ['took them off', 'got new shoes', 'tied them'] },
    { g: 1, l: 2, text: 'The bird made a nest. She laid three eggs in it. Soon she heard peep, peep, peep!', q: 'What made the peeping sound?', a: 'baby birds', wrong: ['the wind', 'a cat', 'a car'] },
    { g: 1, l: 2, text: 'Grace was hungry. She looked in the bag. Oh no, her lunch was at home!', q: 'How does Grace feel?', a: 'upset', wrong: ['happy', 'sleepy', 'proud'] },
    { g: 1, l: 2, text: 'Tomas wanted to see the stars. He waited until it got dark. Then he went outside and looked up.', q: 'Why did Tomas wait?', a: 'stars show when it is dark', wrong: ['he was tired', 'it was raining', 'Mom said no'] },
    // ---- More grade 2, level 1 ----
    { g: 2, l: 1, text: 'A rainbow has seven colors. You can see one when the sun shines through rain. The colors always come in the same order, starting with red.', q: 'How many colors are in a rainbow?', a: 'seven', wrong: ['three', 'five', 'ten'] },
    { g: 2, l: 1, text: 'Hana\'s class took a trip to the fire station. A firefighter showed them the truck. Hana got to try on a heavy helmet.', q: 'What did Hana try on?', a: 'a helmet', wrong: ['boots', 'a coat', 'gloves'] },
    { g: 2, l: 1, text: 'Astronauts wear special suits in space. The suits give them air to breathe. The suits also protect astronauts from the heat and cold of space.', q: 'What do space suits give astronauts?', a: 'air to breathe', wrong: ['food', 'water', 'music'] },
    { g: 2, l: 1, text: 'Diego helps bake bread on Sundays. First he mixes flour, water, and yeast. The dough rests for an hour, and then it goes in the hot oven.', q: 'How long does the dough rest?', a: 'an hour', wrong: ['a minute', 'all day', 'a week'] },
    { g: 2, l: 1, text: 'Soccer is played with a round ball. During play, only the goalie may touch the ball with their hands.', q: 'Who may touch the ball with their hands during play?', a: 'only the goalie', wrong: ['every player', 'the coach', 'nobody'] },
    { g: 2, l: 1, text: 'Priya got a library book about sharks. She learned that sharks have many rows of teeth. When a tooth falls out, a new one moves forward.', q: 'What happens when a shark loses a tooth?', a: 'a new one moves forward', wrong: ['it grows a fin', 'it stops eating', 'it goes to the dentist'] },
    { g: 2, l: 1, text: 'Omar\'s grandpa taught him to fish. They sat on the dock for an hour. Omar caught one small fish and let it go.', q: 'What did Omar do with the fish?', a: 'let it go', wrong: ['cooked it', 'took it home', 'gave it to Grandpa'] },
    { g: 2, l: 1, text: 'Crayons are made from wax. The wax is melted and mixed with color. Then it is poured into molds and cooled until it is hard.', q: 'What are crayons made from?', a: 'wax', wrong: ['wood', 'clay', 'paper'] },
    { g: 2, l: 1, text: 'Lena\'s town had a parade on the Fourth of July. There were drums, horses, and a giant balloon shaped like a dog. Lena waved a little flag.', q: 'What was the giant balloon shaped like?', a: 'a dog', wrong: ['a cat', 'a star', 'a car'] },
    { g: 2, l: 1, text: 'A spider is not an insect. Insects have six legs, but spiders have eight. Spiders also have no wings.', q: 'How many legs does a spider have?', a: 'eight', wrong: ['six', 'four', 'ten'] },
    { g: 2, l: 1, text: 'Theo built a car out of a shoebox. He used bottle caps for wheels. His car rolled all the way across the kitchen floor.', q: 'What did Theo use for wheels?', a: 'bottle caps', wrong: ['coins', 'cookies', 'buttons'] },
    { g: 2, l: 1, text: 'Rosa\'s family went camping. They slept in a tent and cooked over a fire. At night they heard an owl hooting.', q: 'Where did Rosa\'s family sleep?', a: 'in a tent', wrong: ['in a cabin', 'in the car', 'in a hotel'] },
    { g: 2, l: 1, text: 'The moon goes around the Earth. It takes about a month. That is why the moon looks a little different each night.', q: 'How long does the moon take to go around the Earth?', a: 'about a month', wrong: ['about a day', 'about a year', 'about an hour'] },
    { g: 2, l: 1, text: 'Jaden\'s baby brother took his first steps today. He wobbled and fell on the rug. Then he got up and tried again.', q: 'What did the baby do after he fell?', a: 'got up and tried again', wrong: ['cried', 'went to sleep', 'crawled away'] },
    { g: 2, l: 1, text: 'Maple syrup comes from trees. In early spring, people tap the trees and collect sap. The sap is boiled for hours until it is thick and sweet.', q: 'When do people collect sap?', a: 'in early spring', wrong: ['in summer', 'in the fall', 'at night'] },
    // ---- More grade 2, level 2 ----
    { g: 2, l: 2, text: 'Maya tugged at her shoelace. The knot only got tighter. She took a deep breath, loosened it bit by bit, and finally it came free.', q: 'What does this story show about Maya?', a: 'she does not give up', wrong: ['she is in a hurry', 'she likes new shoes', 'she is sleepy'] },
    { g: 2, l: 2, text: 'Noah glanced at the clock, then at the door, then at the clock again. His grandmother\'s plane had landed an hour ago.', q: 'How does Noah feel?', a: 'eager for Grandma to arrive', wrong: ['angry at Grandma', 'bored with clocks', 'afraid of planes'] },
    { g: 2, l: 2, text: 'The leaves crunched under Lily\'s boots. She zipped her jacket to her chin and watched her breath make little clouds.', q: 'What season is it?', a: 'fall', wrong: ['summer', 'spring', 'the rainy season'] },
    { g: 2, l: 2, text: 'Amir had never seen the ocean. When the car crested the hill, there it was, enormous and blue. Amir forgot to breathe.', q: 'What does "enormous" mean?', a: 'very big', wrong: ['very cold', 'very loud', 'very far'] },
    { g: 2, l: 2, text: 'The soccer game was tied. Grace passed the ball instead of shooting. Her teammate scored, and Grace cheered loudest of all.', q: 'What is Grace like?', a: 'a good teammate', wrong: ['a poor player', 'a show-off', 'a quiet person'] },
    { g: 2, l: 2, text: 'Tomas forgot to water the tomato plants for a week. When he finally checked, the leaves were droopy and brown at the edges.', q: 'Why were the leaves droopy?', a: 'the plants needed water', wrong: ['it was too cold', 'a bug ate them', 'they were ready to pick'] },
    { g: 2, l: 2, text: 'Hana packed her swimsuit, goggles, and a towel. She was so excited that she could barely sit still in the car.', q: 'Where is Hana probably going?', a: 'to the pool', wrong: ['to the library', 'to the dentist', 'to school'] },
    { g: 2, l: 2, text: 'A beaver\'s teeth never stop growing. Chewing wood wears them down. If a beaver stopped chewing, its teeth would grow too long to use.', q: 'Why must a beaver keep chewing?', a: 'to wear down its teeth', wrong: ['because it is hungry', 'to build muscles', 'because wood tastes good'] },
    { g: 2, l: 2, text: 'Diego peeked into the oven every two minutes. "A watched pot never boils," Grandma laughed. The cookies were not ready any faster.', q: 'What does Grandma mean?', a: 'waiting feels slow when you keep checking', wrong: ['cookies need a pot', 'the oven is broken', 'Diego should go outside'] },
    { g: 2, l: 2, text: 'Priya\'s little brother wanted to help carry the groceries. She handed him the bread and kept the heavy bags herself.', q: 'Why did Priya give him the bread?', a: 'it was light enough for him to carry', wrong: ['she did not like bread', 'he asked for a snack', 'the bags were empty'] },
    { g: 2, l: 2, text: 'The classroom was silent as Omar read his poem. When he finished, the room exploded with clapping. His ears turned pink.', q: 'How did the class feel about the poem?', a: 'they loved it', wrong: ['they were bored', 'they did not hear it', 'they were angry'] },
    { g: 2, l: 2, text: 'Lena stacked the cans at the food drive. Her arms ached, but every can meant a meal for someone. She reached for the next box.', q: 'Why does Lena keep working even though she is tired?', a: 'she knows the food helps people', wrong: ['the teacher is watching', 'she wants a prize', 'she likes cans'] },
    { g: 2, l: 2, text: 'The old bridge creaked and swayed. Theo stepped onto it slowly, holding the rope rail with both hands.', q: 'How is Theo feeling?', a: 'nervous', wrong: ['bored', 'sleepy', 'cheerful'] },
    { g: 2, l: 2, text: 'Rosa trained her dog to sit by giving it a treat each time. After a week, the dog sat as soon as she said the word.', q: 'What is the best title for this story?', a: 'Teaching a Dog to Sit', wrong: ['Rosa\'s Favorite Treats', 'A Week at the Beach', 'How to Buy a Dog'] },
    { g: 2, l: 2, text: 'Jaden\'s ice cream began to drip down the cone. He licked faster, but the sun was faster still. Soon his hand was sticky and the cone was empty.', q: 'Why did the ice cream melt?', a: 'it was hot in the sun', wrong: ['Jaden dropped it', 'it was old', 'the cone had a hole'] },
    // ---- More grade 3, level 1 ----
    { g: 3, l: 1, text: 'The Wright brothers built the first airplane that could really fly. In 1903, their plane stayed in the air for twelve seconds. Today, planes can fly for many hours without landing.', q: 'How long did the first flight last?', a: 'twelve seconds', wrong: ['twelve minutes', 'an hour', 'a whole day'] },
    { g: 3, l: 1, text: 'Hana wanted to earn money for a new bike. She walked the neighbors\' dogs every afternoon for two months. By June, she had saved enough and rode her bike home from the store.', q: 'How did Hana earn money?', a: 'by walking dogs', wrong: ['by washing cars', 'by babysitting', 'by selling lemonade'] },
    { g: 3, l: 1, text: 'Octopuses are clever animals. They can open jars, squeeze through tiny holes, and change color to hide. Some have even escaped from aquarium tanks.', q: 'Which is something an octopus can do?', a: 'change color to hide', wrong: ['fly short distances', 'live on land', 'bark like a dog'] },
    { g: 3, l: 1, text: 'Noah\'s science project was a model volcano. He mixed baking soda and vinegar inside it. Red foam bubbled over the top, and the judges gave him a blue ribbon.', q: 'What made the foam?', a: 'baking soda and vinegar', wrong: ['soap and water', 'salt and sugar', 'flour and milk'] },
    { g: 3, l: 1, text: 'Bread is made from wheat. Farmers harvest the wheat, and a mill grinds it into flour. Bakers mix the flour with water and yeast, let the dough rise, and bake it.', q: 'What does a mill do?', a: 'grinds wheat into flour', wrong: ['bakes the bread', 'plants the wheat', 'sells the bread'] },
    { g: 3, l: 1, text: 'Lily joined the chess club in September. At first she lost every game. She studied openings with her uncle, and by spring she won the club tournament.', q: 'When did Lily win the tournament?', a: 'in spring', wrong: ['in September', 'in winter', 'on the first day'] },
    { g: 3, l: 1, text: 'Earth has one moon, but Jupiter has dozens. Jupiter is the largest planet in our solar system. More than a thousand Earths could fit inside it.', q: 'Which planet is the largest?', a: 'Jupiter', wrong: ['Earth', 'Mars', 'the moon'] },
    { g: 3, l: 1, text: 'Amir and his dad built a raised garden bed from old boards. They filled it with soil and planted lettuce, carrots, and peas. The rabbits ate the lettuce first.', q: 'Who ate the lettuce?', a: 'rabbits', wrong: ['Amir', 'his dad', 'birds'] },
    { g: 3, l: 1, text: 'A compass needle always points north. Hikers use a compass with a map to find their way. Before compasses, sailors steered by the stars.', q: 'Which way does a compass needle point?', a: 'north', wrong: ['south', 'toward the sun', 'toward home'] },
    { g: 3, l: 1, text: 'Grace\'s class raised butterflies. They watched caterpillars eat, form chrysalises, and finally emerge with wet, folded wings. On Friday they released them in the garden.', q: 'What did the class do on Friday?', a: 'released the butterflies', wrong: ['caught more caterpillars', 'had a party', 'went on a hike'] },
    { g: 3, l: 1, text: 'Tomas plays goalie on his soccer team. In the last game he blocked nine shots. The team won two to one, and his coach called him the player of the game.', q: 'How many shots did Tomas block?', a: 'nine', wrong: ['two', 'one', 'twelve'] },
    { g: 3, l: 1, text: 'Thunder is the sound lightning makes. Light travels faster than sound, so you see the flash before you hear the boom. Counting the seconds between them tells you how far away the storm is.', q: 'Why do you see lightning before you hear thunder?', a: 'light travels faster than sound', wrong: ['thunder happens first', 'your ears are slow', 'lightning is quiet'] },
    { g: 3, l: 1, text: 'Maya\'s family adopted a cat from the shelter. The cat hid under the bed for three days. On the fourth day, it curled up on Maya\'s lap and purred.', q: 'How long did the cat hide?', a: 'three days', wrong: ['one day', 'a week', 'a month'] },
    { g: 3, l: 1, text: 'Recycling turns old things into new ones. Plastic bottles can become fleece jackets. Old newspapers can become cardboard boxes.', q: 'What can plastic bottles become?', a: 'fleece jackets', wrong: ['cardboard boxes', 'glass jars', 'new trees'] },
    { g: 3, l: 1, text: 'Diego ran the one-mile race at field day. He started too fast and had to slow down. He finished fourth, but he beat his own best time by a full minute.', q: 'What place did Diego finish?', a: 'fourth', wrong: ['first', 'second', 'last'] },
    // ---- More grade 3, level 2 ----
    { g: 3, l: 2, text: 'Priya\'s violin screeched on the high note. Her little brother covered his ears. Priya played it again, and again, until the note rang out clear and sweet.', q: 'What is the main idea?', a: 'practice makes the hard parts better', wrong: ['violins are loud', 'little brothers are annoying', 'high notes are impossible'] },
    { g: 3, l: 2, text: 'The campsite was deserted when Omar\'s family arrived. Pine needles carpeted the ground, and the only sound was a woodpecker tapping somewhere above.', q: 'What does "deserted" mean?', a: 'empty of people', wrong: ['hot and dry', 'full of sand', 'very noisy'] },
    { g: 3, l: 2, text: 'Lena noticed the new girl eating alone again. She picked up her tray, walked over, and asked about the dragon book the girl was reading. By Friday they were trading books.', q: 'Why did Lena mention the dragon book?', a: 'to start a friendly conversation', wrong: ['to borrow it', 'because she hates dragons', 'to show off'] },
    { g: 3, l: 2, text: 'The hikers reached the ridge as the sky turned orange. Below them, the valley filled with shadow. "Worth every step," Theo whispered.', q: 'What does Theo mean by "worth every step"?', a: 'the view made the hard hike worthwhile', wrong: ['the steps were counted', 'he wants to go back down', 'the hike was easy'] },
    { g: 3, l: 2, text: 'Camels have long eyelashes and can close their nostrils. These features keep out blowing sand. Their wide feet keep them from sinking into dunes.', q: 'What is this passage mostly about?', a: 'how camels are suited to the desert', wrong: ['why camels have long legs', 'how to ride a camel', 'where to find sand dunes'] },
    { g: 3, l: 2, text: 'Rosa\'s cake came out of the oven flat as a pancake. She checked the recipe and groaned. She had forgotten the baking powder.', q: 'Why was the cake flat?', a: 'she left out the baking powder', wrong: ['the oven was broken', 'she used too much sugar', 'she baked it too long'] },
    { g: 3, l: 2, text: 'Jaden\'s grandfather speaks three languages. "Each one," he says, "is a window into another world." Jaden has started learning Spanish from him on Saturdays.', q: 'What does Grandfather mean by "a window into another world"?', a: 'a language lets you understand other people and places', wrong: ['you can see through languages', 'languages are made of glass', 'every house needs windows'] },
    { g: 3, l: 2, text: 'The old oak had stood in the schoolyard for a hundred years. When the storm split it, the students collected its acorns and planted them along the fence.', q: 'Why did the students plant the acorns?', a: 'so new oaks could grow from the old one', wrong: ['to feed the squirrels', 'to clean the yard', 'because the teacher was angry'] },
    { g: 3, l: 2, text: 'Maya\'s robot kept turning left instead of right. She reread her code line by line. There it was: one tiny minus sign where a plus should be.', q: 'What caused the problem?', a: 'a small mistake in the code', wrong: ['a broken wheel', 'a dead battery', 'the floor was slippery'] },
    { g: 3, l: 2, text: 'Noah\'s hands shook as he stepped up to the microphone. He took a breath, found his mom\'s face in the crowd, and began. By the second verse, he was smiling.', q: 'How did Noah\'s feelings change?', a: 'from nervous to confident', wrong: ['from happy to sad', 'from bored to tired', 'from angry to calm'] },
    { g: 3, l: 2, text: 'Some birds, like crows, can use tools. A crow will bend a wire into a hook to pull food out of a tube. Scientists once thought only humans and apes could do this.', q: 'Why is the crow\'s trick surprising to scientists?', a: 'they thought only humans and apes used tools', wrong: ['crows do not eat', 'wires are rare', 'crows cannot see hooks'] },
    { g: 3, l: 2, text: 'The town pool closes on Labor Day. On the last afternoon, Lily swam until her fingers wrinkled. She climbed out slowly, looking back at the water.', q: 'How does Lily feel about summer ending?', a: 'sad to see it go', wrong: ['glad it is over', 'afraid of the water', 'too cold to care'] },
    { g: 3, l: 2, text: 'Amir forgot his lines in the school play. For a second the stage was silent. Then Grace, playing the queen, said, "Speak up, knight!" and Amir remembered everything.', q: 'What did Grace do for Amir?', a: 'gave him a hint in the play', wrong: ['laughed at him', 'took his part', 'told the teacher'] },
    { g: 3, l: 2, text: 'Tomas saved his allowance for a video game. At the store, he saw his sister gazing at a sketchbook she could not afford. He walked out with the sketchbook instead.', q: 'What does Tomas\'s choice tell you about him?', a: 'he is generous', wrong: ['he dislikes video games', 'he is forgetful', 'he is selfish'] },
    { g: 3, l: 2, text: 'Hana wrote to the mayor about the broken swings at the park. Three weeks later, a crew arrived with new chains and seats. Hana was the first one to swing.', q: 'What is the best title for this passage?', a: 'One Letter Fixed the Park', wrong: ['How Swings Are Made', 'The Mayor\'s Busy Day', 'Hana Learns to Swing'] },
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
    { g: 2, steps: ['go to the library', 'pick out a book', 'check it out', 'read it at home'] },
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
    gas: [['steam', '♨️'], ['the air in a balloon', '🎈'], ['the air we breathe', '💨'], ['the air inside a bubble', '🫧']] };

  const SENSES = { sight: ['👀', ['see a rainbow', 'read a sign', 'watch a bird fly']], hearing: ['👂', ['hear a bell ring', 'listen to music', 'hear a dog bark']],
    smell: ['👃', ['smell flowers', 'smell cookies baking', 'smell the rain']], taste: ['👅', ['taste a lemon', 'taste ice cream', 'taste salty chips']],
    touch: ['✋', ['feel a soft blanket', 'feel cold snow', 'feel a bumpy rock']] };

  // Each animal: [name, emoji, other habitats that would also be a fair answer]. Those are never offered as wrong choices.
  const HABITATS = { ocean: ['🌊', [['shark', '🦈'], ['whale', '🐳'], ['octopus', '🐙'], ['crab', '🦀']]],
    desert: ['🏜️', [['camel', '🐪'], ['scorpion', '🦂'], ['rattlesnake', '🐍'], ['lizard', '🦎']]],
    forest: ['🌲', [['deer', '🦌'], ['squirrel', '🐿️'], ['bear', '🐻'], ['raccoon', '🦝']]],
    'icy polar lands': ['❄️', [['polar bear', '🐻‍❄️', ['ocean']], ['seal', '🦭', ['ocean']], ['penguin', '🐧', ['ocean']]]],
    pond: ['🏞️', [['frog', '🐸'], ['duck', '🦆', ['farm']], ['turtle', '🐢'], ['beaver', '🦫']]],
    farm: ['🚜', [['cow', '🐮'], ['pig', '🐷'], ['chicken', '🐔'], ['sheep', '🐑']]],
    grassland: ['🌾', [['lion', '🦁'], ['zebra', '🦓'], ['giraffe', '🦒'], ['elephant', '🐘']]],
    rainforest: ['🌴', [['monkey', '🐒'], ['parrot', '🦜'], ['sloth', '🦥'], ['jaguar', '🐆']]] };
  // Habitats too alike to offer side by side.
  const HABITAT_ALIKE = { forest: ['rainforest'], rainforest: ['forest'] };

  const LIFECYCLES = { frog: ['🐸', ['egg', 'tadpole', 'froglet', 'frog']], butterfly: ['🦋', ['egg', 'caterpillar', 'chrysalis', 'butterfly']],
    plant: ['🌻', ['seed', 'sprout', 'leafy plant', 'flowering plant']], chicken: ['🐔', ['egg', 'chick', 'grown chicken']] };

  const PLANT_PARTS = { roots: ['takes in water from the soil', 'holds the plant in the ground'], stem: ['holds the plant up', 'carries water up to the leaves'],
    leaves: ['makes food from sunlight'], flower: ['makes the seeds'], seed: ['grows into a new plant'] };

  // Animal body parts: part -> [emoji, [jobs]]. Each job belongs to one part only.
  // Animal body parts: part -> [[job, emoji of the animal in the question], ...]. Each job belongs to one part only.
  const BODY_PARTS = {
    wings: [['does a bird use to fly', '🐦'], ['does a butterfly flap to fly', '🦋']], fins: [['does a fish use to swim', '🐟'], ['does a shark steer with', '🦈']],
    gills: [['does a fish breathe with underwater', '🐠']], fur: [['keeps a bear warm', '🐻'], ['keeps a rabbit warm in winter', '🐰']],
    shell: [['protects a turtle', '🐢'], ['does a snail hide inside', '🐌']], beak: [['does a bird use to pick up seeds', '🦜'], ['does a woodpecker tap trees with', '🐦']],
    trunk: [['does an elephant use to pick up food', '🐘'], ['does an elephant spray water with', '🐘']], claws: [['does a cat use to scratch', '🐱'], ['does an eagle hold on to a branch with', '🦅']],
    'long neck': [['does a giraffe use to reach high leaves', '🦒']], 'strong back legs': [['does a kangaroo use to hop', '🦘'], ['does a frog use to jump', '🐸']],
  };
  // What every living thing needs, and things that are nice but not needed.
  const NEEDS = { animals: ['food', 'water', 'air', 'a safe place to live'], plants: ['water', 'sunlight', 'air', 'soil'],
    wants: ['a toy', 'a TV', 'shoes', 'a phone', 'candy', 'a car', 'a hat', 'a book', 'a pillow', 'a bike'] };
  // Pushes and pulls.
  const FORCES = { push: [['kicking a ball', '⚽'], ['pressing a doorbell', '🔔'], ['rolling a shopping cart ahead of you', '🛒'], ['hitting a drum', '🥁'], ['closing a drawer', '🗄️'], ['giving a swing a shove', '🛝']],
    pull: [['opening a drawer', '🗄️'], ['a tug of war', '🪢'], ['walking a dog on a leash', '🐕'], ['dragging a sled up a hill', '🛷'], ['zipping up a jacket', '🧥'], ['reeling in a fish', '🎣']] };
  // Moon phases.
  const MOON = { 'new moon': '🌑', 'crescent moon': '🌙', 'half moon': '🌓', 'full moon': '🌕' };

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
    { g: 1, l: 1, q: 'Which one is cold?', a: 'ice', wrong: ['the sun', 'a campfire', 'hot soup'] },
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
    { g: 2, l: 2, q: 'What do we call an animal that eats only plants?', a: 'an herbivore', wrong: ['a carnivore', 'an omnivore', 'a predator'] },
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
    { g: 3, l: 1, q: 'What makes sound?', a: 'vibrations', wrong: ['light', 'heat', 'smells'] },
    { g: 3, l: 1, q: 'Which is a renewable energy source?', a: 'sunlight', wrong: ['coal', 'oil', 'natural gas'] },
    { g: 3, l: 1, q: 'At what temperature does water freeze?', a: '32 degrees Fahrenheit', wrong: ['0 degrees Fahrenheit', '100 degrees Fahrenheit', '212 degrees Fahrenheit'] },
    { g: 3, l: 1, q: 'What do we call the amount of space something takes up?', a: 'volume', wrong: ['weight', 'length', 'color'] },
    // Grade 3, level 2
    { g: 3, l: 2, q: 'What do fossils tell us about?', a: 'plants and animals from long ago', wrong: ['tomorrow\'s weather', 'how to cook', 'how to build houses'] },
    { g: 3, l: 2, q: 'What is the process plants use to make food from sunlight?', a: 'photosynthesis', wrong: ['digestion', 'evaporation', 'migration'] },
    { g: 3, l: 2, q: 'What do we call an animal that eats both plants and animals?', a: 'an omnivore', wrong: ['an herbivore', 'a carnivore', 'a producer'] },
    { g: 3, l: 2, q: 'Why do some birds fly south for the winter?', a: 'to find food and warmer weather', wrong: ['to get taller', 'to learn to swim', 'because they are lost'] },
    { g: 3, l: 2, q: 'Which is a physical change, not a chemical change?', a: 'ice melting', wrong: ['wood burning', 'a cake baking', 'iron rusting'] },
    { g: 3, l: 2, q: 'What holds the planets in orbit around the sun?', a: 'gravity', wrong: ['wind', 'magnets', 'light'] },
    { g: 3, l: 2, q: 'What do we call the path the Earth takes around the sun?', a: 'an orbit', wrong: ['a rotation', 'a season', 'a tide'] },
    { g: 3, l: 2, q: 'How long does Earth take to go all the way around the sun?', a: 'one year', wrong: ['one day', 'one month', 'one hour'] },
    { g: 3, l: 2, q: 'What causes day and night?', a: 'the Earth spinning', wrong: ['the sun moving around Earth', 'clouds covering the sun', 'the moon\'s light'] },
    { g: 3, l: 2, q: 'What is the Earth\'s natural satellite?', a: 'the moon', wrong: ['the sun', 'Mars', 'a cloud'] },
    // Weather and clouds
    { g: 1, l: 1, q: 'What are clouds made of?', a: 'tiny drops of water', wrong: ['cotton', 'smoke', 'feathers'] },
    { g: 1, l: 1, q: 'What do we call moving air?', a: 'wind', wrong: ['rain', 'fog', 'thunder'] },
    { g: 1, l: 2, q: 'What falls from clouds when it is very cold?', a: 'snow', wrong: ['sand', 'leaves', 'bubbles'] },
    { g: 2, l: 1, q: 'What do dark gray clouds usually mean?', a: 'rain is coming', wrong: ['it will be sunny', 'it is nighttime', 'the wind stopped'] },
    { g: 2, l: 2, q: 'What is fog?', a: 'a cloud near the ground', wrong: ['frozen rain', 'smoke from fires', 'dust in the air'] },
    { g: 3, l: 1, q: 'What tool tells which way the wind is blowing?', a: 'a wind vane', wrong: ['a thermometer', 'a ruler', 'a compass'] },
    { g: 3, l: 2, q: 'What is the water cycle?', a: 'water rising into the air, forming clouds, and falling as rain', wrong: ['water going down a drain', 'a bicycle that floats', 'the way rivers freeze'] },
    // Rocks and soil
    { g: 1, l: 2, q: 'What is soil mostly made of?', a: 'tiny bits of rock and dead plants', wrong: ['candy', 'plastic', 'ice'] },
    { g: 1, l: 1, q: 'Which is the hardest?', a: 'a rock', wrong: ['a sponge', 'a pillow', 'a leaf'] },
    { g: 2, l: 2, q: 'What is sand made of?', a: 'tiny pieces of rock and shell', wrong: ['sugar', 'salt', 'dried mud'] },
    { g: 3, l: 1, q: 'What slowly breaks big rocks into smaller pieces?', a: 'wind, water, and ice', wrong: ['loud music', 'moonlight', 'birds singing'] },
    { g: 3, l: 2, q: 'Which layer of soil is best for growing plants?', a: 'the dark top layer', wrong: ['the rocky bottom layer', 'pure sand', 'clay deep underground'] },
    // Healthy habits
    { g: 1, l: 1, q: 'How often should you brush your teeth?', a: 'every day', wrong: ['once a year', 'never', 'only on birthdays'] },
    { g: 1, l: 2, q: 'Why do we wash our hands?', a: 'to get rid of germs', wrong: ['to make them bigger', 'to keep them cold', 'to make them shiny'] },
    { g: 2, l: 1, q: 'Which food helps your bones grow strong?', a: 'milk', wrong: ['candy', 'soda', 'chips'] },
    { g: 2, l: 2, q: 'Why does your body need sleep?', a: 'to rest and grow', wrong: ['to get hungry', 'to make your hair curly', 'to practice dreams'] },
    { g: 3, l: 1, q: 'Why should you drink water when you exercise?', a: 'your body loses water when you sweat', wrong: ['water makes you faster', 'to wash your mouth', 'water gives you muscles'] },
    { g: 3, l: 2, q: 'What does your heart do when you run?', a: 'beats faster to send more blood to your muscles', wrong: ['stops for a while', 'gets smaller', 'beats slower'] },
  ];

  // Names that take no 'a'/'an' in front (mass nouns and phrases).
  const NO_ARTICLE = ['milk', 'juice', 'honey', 'rain', 'hot tea', 'ocean water', 'steam', 'the air in a balloon', 'the air we breathe', 'the air inside a bubble', 'grass'];

  const api = { NO_ARTICLE, HABITAT_ALIKE, BODY_PARTS, NEEDS, FORCES, MOON, PASSAGES, SEQUENCES, ANIMALS, GROUPS, LIVING, MATTER, SENSES, HABITATS, LIFECYCLES, PLANT_PARTS, FACTS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Lessons = api;
})(this);
