const PROFILES = [
  // id 2–41 : realistic Indian student / young-professional profiles
  { id: 2,  name: 'Priya Sharma',    age: 22, city: 'Delhi',      bio: 'Coffee addict, budding designer, and avid reader.',           interests: ['design','coffee','books'] },
  { id: 3,  name: 'Rohan Mehta',     age: 24, city: 'Mumbai',     bio: 'Software engineer by day, guitarist by night.',               interests: ['music','coding','travel'] },
  { id: 4,  name: 'Ananya Iyer',     age: 21, city: 'Bengaluru',  bio: 'Passionate about AI and baking sourdough on weekends.',       interests: ['AI','baking','yoga'] },
  { id: 5,  name: 'Karan Kapoor',    age: 25, city: 'Pune',       bio: 'Cyclist, craft-beer enthusiast, MBA student.',                interests: ['cycling','beer','finance'] },
  { id: 6,  name: 'Sneha Nair',      age: 23, city: 'Chandigarh', bio: 'Medical student who unwinds with Bollywood dance.',           interests: ['dance','medicine','movies'] },
  { id: 7,  name: 'Arjun Verma',     age: 26, city: 'Delhi',      bio: 'Startup founder, mindful meditator, chai lover.',             interests: ['startups','meditation','chai'] },
  { id: 8,  name: 'Diya Pillai',     age: 22, city: 'Bengaluru',  bio: 'UX researcher obsessed with accessible design and cats.',     interests: ['UX','cats','accessibility'] },
  { id: 9,  name: 'Vikram Singh',    age: 27, city: 'Mumbai',     bio: 'Finance analyst, weekend trekker, photography hobbyist.',     interests: ['trekking','photography','finance'] },
  { id: 10, name: 'Isha Gupta',      age: 20, city: 'Pune',       bio: 'First-year CS student, hackathon junkie, dog mom.',           interests: ['coding','hackathons','dogs'] },
  { id: 11, name: 'Nikhil Joshi',    age: 24, city: 'Delhi',      bio: 'Data scientist, cricket fanatic, home-cook extraordinaire.',  interests: ['cricket','data','cooking'] },
  { id: 12, name: 'Meera Bose',      age: 23, city: 'Chandigarh', bio: 'Fashion blogger turned sustainable stylist.',                 interests: ['fashion','sustainability','blogging'] },
  { id: 13, name: 'Siddharth Rao',   age: 25, city: 'Bengaluru',  bio: 'DevOps engineer, open-source contributor, rock climber.',    interests: ['climbing','open-source','DevOps'] },
  { id: 14, name: 'Pooja Desai',     age: 21, city: 'Mumbai',     bio: 'Journalism student, street-food explorer, watercolour artist.', interests: ['journalism','art','food'] },
  { id: 15, name: 'Aakash Tiwari',   age: 26, city: 'Delhi',      bio: 'Civil engineer passionate about smart cities and cycling.',   interests: ['cycling','smart-cities','fitness'] },
  { id: 16, name: 'Ritika Malhotra', age: 22, city: 'Pune',       bio: 'Psychology grad, mental-health advocate, podcast host.',     interests: ['psychology','podcasting','wellness'] },
  { id: 17, name: 'Yash Kulkarni',   age: 24, city: 'Bengaluru',  bio: 'Product manager, board-game enthusiast, chai aficionado.',   interests: ['product','board-games','chai'] },
  { id: 18, name: 'Zara Khan',       age: 23, city: 'Mumbai',     bio: 'Architecture student, travel sketcher, Sufi music fan.',     interests: ['architecture','travel','music'] },
  { id: 19, name: 'Rajan Patel',     age: 27, city: 'Chandigarh', bio: 'Entrepreneur, fitness coach, early riser.',                  interests: ['fitness','entrepreneurship','wellness'] },
  { id: 20, name: 'Kavya Reddy',     age: 20, city: 'Delhi',      bio: 'Political science student and passionate debater.',           interests: ['politics','debate','reading'] },
  { id: 21, name: 'Harsh Agarwal',   age: 25, city: 'Pune',       bio: 'ML researcher, sci-fi reader, amateur astronomer.',          interests: ['ML','astronomy','sci-fi'] },
  { id: 22, name: 'Nandini Choudhary', age: 22, city: 'Bengaluru', bio: 'Biotech student, Carnatic musician, plant parent.',        interests: ['music','biotech','plants'] },
  { id: 23, name: 'Tushar Bhatt',    age: 24, city: 'Mumbai',     bio: 'Content creator, sneakerhead, basketball player.',           interests: ['content','sneakers','basketball'] },
  { id: 24, name: 'Swati Pandey',    age: 21, city: 'Delhi',      bio: 'Commerce student, Zumba instructor, café hopper.',           interests: ['dance','fitness','coffee'] },
  { id: 25, name: 'Rahul Soni',      age: 26, city: 'Chandigarh', bio: 'Electrical engineer, Arduino tinkerer, table-tennis champ.', interests: ['electronics','tennis','tinkering'] },
  { id: 26, name: 'Ankita Jain',     age: 23, city: 'Bengaluru',  bio: 'HR professional, dog rescuer, minimalist.',                  interests: ['dogs','HR','minimalism'] },
  { id: 27, name: 'Sahil Khanna',    age: 25, city: 'Mumbai',     bio: 'Chartered accountant and weekend marathon runner.',          interests: ['running','finance','travel'] },
  { id: 28, name: 'Deepika Nanda',   age: 22, city: 'Pune',       bio: 'Graphic designer, manga reader, boba tea lover.',            interests: ['design','manga','tea'] },
  { id: 29, name: 'Gaurav Mishra',   age: 27, city: 'Delhi',      bio: 'IAS aspirant, history buff, classical Hindustani vocalist.', interests: ['history','music','UPSC'] },
  { id: 30, name: 'Puja Srivastava', age: 20, city: 'Chandigarh', bio: 'BBA student, event planner, street-photography enthusiast.', interests: ['photography','events','travel'] },
  { id: 31, name: 'Kabir Dutt',      age: 24, city: 'Bengaluru',  bio: 'Full-stack developer, gamer, esports commentator.',          interests: ['gaming','coding','esports'] },
  { id: 32, name: 'Trisha Roy',      age: 23, city: 'Mumbai',     bio: 'Theatre actor, creative writing enthusiast, chai person.',   interests: ['theatre','writing','chai'] },
  { id: 33, name: 'Mohit Sharma',    age: 26, city: 'Pune',       bio: 'Mechanical engineer turned product designer.',               interests: ['design','engineering','3D-printing'] },
  { id: 34, name: 'Lavanya Krishnamurthy', age: 21, city: 'Delhi', bio: 'Classical dancer, law student, nature lover.',             interests: ['dance','law','nature'] },
  { id: 35, name: 'Abhishek Pandey', age: 25, city: 'Chandigarh', bio: 'Journalist, food critic, travel vlogger.',                  interests: ['journalism','food','vlogging'] },
  { id: 36, name: 'Preethi Menon',   age: 22, city: 'Bengaluru',  bio: 'Robotics researcher, Rubik\'s cube speedsolver, hiker.',    interests: ['robotics','hiking','puzzles'] },
  { id: 37, name: 'Dhruv Kapoor',    age: 24, city: 'Mumbai',     bio: 'Investment banker, squash player, bibliophile.',             interests: ['finance','squash','books'] },
  { id: 38, name: 'Simran Sethi',    age: 23, city: 'Pune',       bio: 'Nutritionist, home baker, mindfulness coach.',               interests: ['nutrition','baking','mindfulness'] },
  { id: 39, name: 'Varun Chopra',    age: 27, city: 'Delhi',      bio: 'Cybersecurity analyst, ethical hacker, chess player.',       interests: ['cybersecurity','chess','coding'] },
  { id: 40, name: 'Ishaan Trivedi',  age: 20, city: 'Chandigarh', bio: 'First-year engineering student, football lover, memer.',    interests: ['football','memes','gaming'] },
  { id: 41, name: 'Rhea D\'Souza',   age: 24, city: 'Bengaluru',  bio: 'Marketing manager, salsa dancer, dog mom.',                 interests: ['marketing','dance','dogs'] },
];

// IDs of profiles that pre-liked user 1
const LIKED_USER1_IDS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

export function seedDatabase(db) {
  const count = db.prepare('SELECT COUNT(*) AS cnt FROM users').get().cnt;
  if (count > 0) return; // already seeded

  // Insert logged-in user (id = 1)
  db.prepare(`
    INSERT INTO users (id, name, age, photo_url, bio, city, interests, sort_key)
    VALUES (1, 'Adarsh', 24, 'https://picsum.photos/seed/coyuser1/600/800',
            'The person using this app.', 'Delhi', '["music","travel","tech"]', 0)
  `).run();

  // Insert 40 profiles
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, age, photo_url, bio, city, interests, sort_key)
    VALUES (@id, @name, @age, @photo_url, @bio, @city, @interests, @sort_key)
  `);

  for (const p of PROFILES) {
    insertUser.run({
      id: p.id,
      name: p.name,
      age: p.age,
      photo_url: `https://picsum.photos/seed/coyuser${p.id}/600/800`,
      bio: p.bio,
      city: p.city,
      interests: JSON.stringify(p.interests),
      sort_key: Math.random(),
    });
  }

  // Insert 10 pre-existing likes toward user 1
  const insertSwipe = db.prepare(`
    INSERT INTO swipes (swiper_id, target_id, direction)
    VALUES (@swiper_id, 1, 'like')
  `);

  for (const swiperId of LIKED_USER1_IDS) {
    insertSwipe.run({ swiper_id: swiperId });
  }
}
