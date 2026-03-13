BEGIN;

-- seed.sql
-- Cinematch Sample Data (20 Movies)
-- Must be run AFTER schema.sql
-- Database: PostgreSQL
-- Note: MovieID, GenreID, PersonID match real TMDb IDs

-- ─────────────────────────────────────────────
-- USERS
-- Plain text passwords for reference:
--   admin  → Admin1234!
--   Sheikh → Sheikh1234!
--   alice  → Alice1234!
--   bob    → Bob1234!
--   carol  → Carol1234!
-- ─────────────────────────────────────────────
INSERT INTO "User" (Username, Email, PasswordHash, JoinDate, PreferencesJSON) VALUES
('admin',  'admin@cinematch.com', '$2b$10$KIXBCDPBpbMiE.HSv7VdQOWvHCVFUKEL3sB1UQzBqhDSNMhPpMK3K', '2026-01-01', NULL),
('Sheikh', 'sheik@movie.ca',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  '2026-02-01', '{"favoriteGenres": ["Comedy", "Animation"]}'),
('alice',  'alice@example.com',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh1y',  '2026-02-10', '{"favoriteGenres": ["Sci-Fi", "Thriller"]}'),
('bob',    'bob@example.com',     '$2b$10$X4kv7j5ZcG3J1Y8kL2mNOuA9vQ1wP3rT6sH8dF0eB5nC7mK4iL9Ow', '2026-02-15', '{"favoriteGenres": ["Drama", "Action"]}'),
('carol',  'carol@example.com',   '$2b$10$Tz6R1p9sQmW4bK7yN2vXOeA3cL8dF5gH0jM1nB6kC9iE4oP7qS2Uy', '2026-02-20', '{"favoriteGenres": ["Romance", "Animation"]}');

-- ─────────────────────────────────────────────
-- GENRES (TMDb genre IDs)
-- ─────────────────────────────────────────────
INSERT INTO Genre (GenreID, GenreName) VALUES
(28,    'Action'),
(12,    'Adventure'),
(16,    'Animation'),
(35,    'Comedy'),
(80,    'Crime'),
(18,    'Drama'),
(14,    'Fantasy'),
(27,    'Horror'),
(9648,  'Mystery'),
(10749, 'Romance'),
(878,   'Science Fiction'),
(53,    'Thriller'),
(10752, 'War'),
(37,    'Western');

-- ─────────────────────────────────────────────
-- MOVIES (real TMDb IDs + PosterPath added)
-- ─────────────────────────────────────────────
INSERT INTO Movie (MovieID, Title, Synopsis, ReleaseDate, Runtime, PosterPath, AvgRating) VALUES
(808,    'Shrek',
         'A green ogre named Shrek embarks on a mission to retrieve a princess from a dragon-guarded castle, teaming up with a wisecracking donkey along the way.',
         '2001-05-18', 90,  '/posters/shrek.jpg',          7.8),

(27205,  'Inception',
         'A skilled thief who steals secrets through dream-sharing technology is given a chance to have his criminal record erased if he can plant an idea into a CEO''s mind.',
         '2010-07-16', 148, '/posters/inception.jpg',       8.3),

(603,    'The Matrix',
         'A computer hacker discovers the true nature of his reality and joins a rebellion against the machines controlling the world.',
         '1999-03-30', 136, '/posters/matrix.jpg',          8.2),

(13,     'Forrest Gump',
         'Through decades of American history, a kind-hearted man from Alabama finds himself at the center of pivotal moments, guided always by his love for Jenny.',
         '1994-07-06', 142, '/posters/forrestgump.jpg',     8.0),

(680,    'Pulp Fiction',
         'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption in Los Angeles.',
         '1994-10-14', 154, '/posters/pulpfiction.jpg',     8.4),

(274,    'The Silence of the Lambs',
         'A young FBI cadet must seek the help of an imprisoned cannibal killer to catch another serial killer known as Buffalo Bill.',
         '1991-02-14', 118, '/posters/silenceofthelambs.jpg', 8.1),

(238,    'The Godfather',
         'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.',
         '1972-03-24', 175, '/posters/godfather.jpg',       9.0),

(389,    '12 Angry Men',
         'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence in a murder trial.',
         '1957-04-10', 96,  '/posters/12angrymen.jpg',      9.0),

(19404,  'Dilwale Dulhania Le Jayenge',
         'When Raj meets Simran on a trip through Europe, they fall in love — but Simran''s father has already arranged her marriage to someone else.',
         '1995-10-20', 189, '/posters/ddlj.jpg',            8.0),

(769,    'GoodFellas',
         'The story of Henry Hill and his life in the mob, covering his rise to prominence and his eventual downfall.',
         '1990-09-19', 146, '/posters/goodfellas.jpg',      8.5),

(157336, 'Interstellar',
         'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival as Earth becomes uninhabitable.',
         '2014-11-05', 169, '/posters/interstellar.jpg',    8.4),

(11,     'Star Wars: A New Hope',
         'Luke Skywalker joins forces with a Jedi Knight, a roguish pilot, and two droids to save the galaxy from the Empire''s planet-destroying battle station.',
         '1977-05-25', 121, '/posters/starwars.jpg',        8.6),

(424,    'Schindler''s List',
         'In German-occupied Poland, businessman Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution.',
         '1993-12-15', 195, '/posters/schindlerslist.jpg',  8.6),

(122,    'The Lord of the Rings: The Return of the King',
         'Gandalf and Aragorn lead the World of Men against Sauron''s army to draw his gaze from Frodo and Sam as they approach Mount Doom.',
         '2003-12-17', 201, '/posters/lotr_rotk.jpg',       8.5),

(550,    'Fight Club',
         'An insomniac office worker and a soap salesman build a secret underground fight club that evolves into something much more sinister.',
         '1999-10-15', 139, '/posters/fightclub.jpg',       8.4),

(497,    'The Green Mile',
         'A death row corrections officer at a 1930s penitentiary is profoundly affected by one of his charges — a massive, gentle man with a mysterious gift.',
         '1999-12-10', 189, '/posters/greenmile.jpg',       8.4),

(598,    'City of God',
         'Two boys growing up in a violent neighborhood in Rio de Janeiro take different paths — one becomes a photographer, the other a drug dealer.',
         '2002-08-30', 130, '/posters/cityofgod.jpg',       8.1),

(372058, 'Your Name',
         'Two strangers find themselves linked in a bizarre way, swapping bodies while they sleep, and must find each other before a fateful event separates them forever.',
         '2016-08-26', 106, '/posters/yourname.jpg',        8.6),

(324857, 'Spider-Man: Into the Spider-Verse',
         'Teen Miles Morales becomes Spider-Man of his reality and must team up with five counterparts from other dimensions to stop a threat to all realities.',
         '2018-12-14', 117, '/posters/spiderverse.jpg',     8.4),

(78,     'Blade Runner',
         'A blade runner must pursue and terminate four replicants who have stolen a ship in space and returned to Earth to find their creator.',
         '1982-06-25', 117, '/posters/bladerunner.jpg',     7.9);

-- ─────────────────────────────────────────────
-- PERSONS (real TMDb person IDs)
-- ─────────────────────────────────────────────
INSERT INTO Person (PersonID, Name, ProfilePicture) VALUES
(12073,   'Mike Myers',           '/profiles/mikemyers.jpg'),
(5524,    'Andrew Adamson',       '/profiles/andrewadamson.jpg'),
(6193,    'Leonardo DiCaprio',    '/profiles/dicaprio.jpg'),
(525,     'Christopher Nolan',    '/profiles/nolan.jpg'),
(6384,    'Keanu Reeves',         '/profiles/reeves.jpg'),
(310,     'Jodie Foster',         '/profiles/foster.jpg'),
(31,      'Tom Hanks',            '/profiles/hanks.jpg'),
(138,     'Quentin Tarantino',    '/profiles/tarantino.jpg'),
(10660,   'John Travolta',        '/profiles/travolta.jpg'),
(1954,    'Marlon Brando',        '/profiles/brando.jpg'),
(3776,    'Francis Ford Coppola', '/profiles/coppola.jpg'),
(4375,    'Henry Fonda',          '/profiles/fonda.jpg'),
(10912,   'Shah Rukh Khan',       '/profiles/srk.jpg'),
(7835,    'Aditya Chopra',        '/profiles/chopra.jpg'),
(6041,    'Ray Liotta',           '/profiles/liotta.jpg'),
(1032,    'Martin Scorsese',      '/profiles/scorsese.jpg'),
(2037,    'Matthew McConaughey',  '/profiles/mcconaughey.jpg'),
(1334,    'Harrison Ford',        '/profiles/ford.jpg'),
(2,       'Mark Hamill',          '/profiles/hamill.jpg'),
(1893,    'George Lucas',         '/profiles/lucas.jpg'),
(4724,    'Liam Neeson',          '/profiles/neeson.jpg'),
(9195,    'Steven Spielberg',     '/profiles/spielberg.jpg'),
(1327,    'Viggo Mortensen',      '/profiles/mortensen.jpg'),
(7467,    'Peter Jackson',        '/profiles/pjackson.jpg'),
(819,     'Edward Norton',        '/profiles/norton.jpg'),
(287,     'Brad Pitt',            '/profiles/pitt.jpg'),
(380,     'David Fincher',        '/profiles/fincher.jpg'),
(14626,   'Alexandre Rodrigues',  '/profiles/rodrigues.jpg'),
(5656,    'Fernando Meirelles',   '/profiles/meirelles.jpg'),
(1367085, 'Ryunosuke Kamiki',     '/profiles/kamiki.jpg'),
(90634,   'Makoto Shinkai',       '/profiles/shinkai.jpg'),
(1190668, 'Shameik Moore',        '/profiles/moore.jpg'),
(1366512, 'Peter Ramsey',         '/profiles/ramsey.jpg'),
(11476,   'Ridley Scott',         '/profiles/rscott.jpg');

-- ─────────────────────────────────────────────
-- MOVIEGENRE
-- ─────────────────────────────────────────────
INSERT INTO MovieGenre (MovieID, GenreID) VALUES
(808,    35),    -- Shrek                → Comedy
(808,    16),    -- Shrek                → Animation
(808,    12),    -- Shrek                → Adventure
(27205,  878),   -- Inception            → Science Fiction
(27205,  53),    -- Inception            → Thriller
(27205,  28),    -- Inception            → Action
(603,    28),    -- The Matrix           → Action
(603,    878),   -- The Matrix           → Science Fiction
(13,     18),    -- Forrest Gump         → Drama
(13,     10749), -- Forrest Gump         → Romance
(680,    53),    -- Pulp Fiction         → Thriller
(680,    80),    -- Pulp Fiction         → Crime
(274,    53),    -- Silence of the Lambs → Thriller
(274,    18),    -- Silence of the Lambs → Drama
(238,    18),    -- The Godfather        → Drama
(238,    80),    -- The Godfather        → Crime
(389,    18),    -- 12 Angry Men         → Drama
(19404,  18),    -- DDLJ                 → Drama
(19404,  10749), -- DDLJ                 → Romance
(769,    18),    -- GoodFellas           → Drama
(769,    80),    -- GoodFellas           → Crime
(157336, 878),   -- Interstellar         → Science Fiction
(157336, 12),    -- Interstellar         → Adventure
(157336, 18),    -- Interstellar         → Drama
(11,     28),    -- Star Wars            → Action
(11,     12),    -- Star Wars            → Adventure
(11,     878),   -- Star Wars            → Science Fiction
(424,    18),    -- Schindler's List     → Drama
(424,    10752), -- Schindler's List     → War
(122,    28),    -- LOTR Return          → Action
(122,    12),    -- LOTR Return          → Adventure
(122,    14),    -- LOTR Return          → Fantasy
(550,    18),    -- Fight Club           → Drama
(550,    53),    -- Fight Club           → Thriller
(497,    18),    -- The Green Mile       → Drama
(497,    14),    -- The Green Mile       → Fantasy
(598,    18),    -- City of God          → Drama
(598,    80),    -- City of God          → Crime
(372058, 16),    -- Your Name            → Animation
(372058, 10749), -- Your Name            → Romance
(372058, 18),    -- Your Name            → Drama
(324857, 16),    -- Spider-Verse         → Animation
(324857, 28),    -- Spider-Verse         → Action
(324857, 12),    -- Spider-Verse         → Adventure
(78,     878),   -- Blade Runner         → Science Fiction
(78,     53);    -- Blade Runner         → Thriller

-- ─────────────────────────────────────────────
-- MOVIECREDITS
-- MovieCreditID is VARCHAR(50) — using a readable composite key
-- CAST rows require CharacterName (NOT NULL), Job must be NULL
-- CREW rows require Job (NOT NULL), CharacterName must be NULL
-- ─────────────────────────────────────────────
INSERT INTO MovieCredit (MovieCreditID, MovieID, PersonID, CreditType, CharacterName, Job) VALUES
('808-12073-cast',    808,    12073,   'CAST', 'Shrek',             NULL),
('808-5524-crew',     808,    5524,    'CREW', NULL,                'Director'),
('27205-6193-cast',   27205,  6193,    'CAST', 'Dom Cobb',          NULL),
('27205-525-crew',    27205,  525,     'CREW', NULL,                'Director'),
('603-6384-cast',     603,    6384,    'CAST', 'Neo',               NULL),
('274-310-cast',      274,    310,     'CAST', 'Clarice Starling',  NULL),
('13-31-cast',        13,     31,      'CAST', 'Forrest Gump',      NULL),
('680-10660-cast',    680,    10660,   'CAST', 'Vincent Vega',      NULL),
('680-138-crew',      680,    138,     'CREW', NULL,                'Director'),
('238-1954-cast',     238,    1954,    'CAST', 'Vito Corleone',     NULL),
('238-3776-crew',     238,    3776,    'CREW', NULL,                'Director'),
('389-4375-cast',     389,    4375,    'CAST', 'Juror #8',          NULL),
('19404-10912-cast',  19404,  10912,   'CAST', 'Raj',               NULL),
('19404-7835-crew',   19404,  7835,    'CREW', NULL,                'Director'),
('769-6041-cast',     769,    6041,    'CAST', 'Henry Hill',        NULL),
('769-1032-crew',     769,    1032,    'CREW', NULL,                'Director'),
('157336-2037-cast',  157336, 2037,    'CAST', 'Cooper',            NULL),
('157336-525-crew',   157336, 525,     'CREW', NULL,                'Director'),
('11-1334-cast',      11,     1334,    'CAST', 'Han Solo',          NULL),
('11-2-cast',         11,     2,       'CAST', 'Luke Skywalker',    NULL),
('11-1893-crew',      11,     1893,    'CREW', NULL,                'Director'),
('424-4724-cast',     424,    4724,    'CAST', 'Oskar Schindler',   NULL),
('424-9195-crew',     424,    9195,    'CREW', NULL,                'Director'),
('122-1327-cast',     122,    1327,    'CAST', 'Aragorn',           NULL),
('122-7467-crew',     122,    7467,    'CREW', NULL,                'Director'),
('550-819-cast',      550,    819,     'CAST', 'The Narrator',      NULL),
('550-287-cast',      550,    287,     'CAST', 'Tyler Durden',      NULL),
('550-380-crew',      550,    380,     'CREW', NULL,                'Director'),
('497-31-cast',       497,    31,      'CAST', 'Paul Edgecomb',     NULL),
('598-14626-cast',    598,    14626,   'CAST', 'Rocket',            NULL),
('598-5656-crew',     598,    5656,    'CREW', NULL,                'Director'),
('372058-1367085-cast', 372058, 1367085, 'CAST', 'Taki Tachibana', NULL),
('372058-90634-crew', 372058, 90634,   'CREW', NULL,                'Director'),
('324857-1190668-cast', 324857, 1190668, 'CAST', 'Miles Morales',  NULL),
('324857-1366512-crew', 324857, 1366512, 'CREW', NULL,             'Director'),
('78-1334-cast',      78,     1334,    'CAST', 'Rick Deckard',      NULL),
('78-11476-crew',     78,     11476,   'CREW', NULL,                'Director');

-- ─────────────────────────────────────────────
-- USERMOVIEINTERACTION
-- UserID: 1=admin, 2=Sheikh, 3=alice, 4=bob, 5=carol
-- ListStatus: WATCHED or WANT_TO_WATCH (no NONE in this schema)
-- DateWatched required if WATCHED, must be NULL if WANT_TO_WATCH
-- ─────────────────────────────────────────────
INSERT INTO UserMovieInteraction (UserID, MovieID, ListStatus, DateAdded, DateWatched) VALUES
-- Sheikh
(2, 808,    'WATCHED',       '2026-02-01', '2026-02-02'),
(2, 19404,  'WATCHED',       '2026-02-06', '2026-02-07'),
(2, 324857, 'WATCHED',       '2026-02-08', '2026-02-09'),
(2, 27205,  'WANT_TO_WATCH', '2026-02-05', NULL),
(2, 372058, 'WANT_TO_WATCH', '2026-02-10', NULL),
-- alice
(3, 603,    'WATCHED',       '2026-02-10', '2026-02-11'),
(3, 27205,  'WATCHED',       '2026-02-12', '2026-02-13'),
(3, 157336, 'WATCHED',       '2026-02-14', '2026-02-15'),
(3, 550,    'WATCHED',       '2026-02-16', '2026-02-17'),
(3, 78,     'WANT_TO_WATCH', '2026-02-18', NULL),
(3, 11,     'WANT_TO_WATCH', '2026-02-19', NULL),
-- bob
(4, 13,     'WATCHED',       '2026-02-15', '2026-02-16'),
(4, 274,    'WATCHED',       '2026-02-17', '2026-02-18'),
(4, 238,    'WATCHED',       '2026-02-19', '2026-02-20'),
(4, 769,    'WATCHED',       '2026-02-21', '2026-02-22'),
(4, 680,    'WANT_TO_WATCH', '2026-02-23', NULL),
(4, 389,    'WANT_TO_WATCH', '2026-02-24', NULL),
-- carol
(5, 372058, 'WATCHED',       '2026-02-20', '2026-02-21'),
(5, 808,    'WATCHED',       '2026-02-22', '2026-02-23'),
(5, 324857, 'WATCHED',       '2026-02-24', '2026-02-25'),
(5, 122,    'WANT_TO_WATCH', '2026-02-26', NULL),
(5, 497,    'WANT_TO_WATCH', '2026-02-27', NULL);

-- ─────────────────────────────────────────────
-- REVIEWS
-- Review now links to InteractionID (not UserID/MovieID directly)
-- Only WATCHED interactions can have a review
-- InteractionIDs are SERIAL so they follow insertion order above:
--   Sheikh  WATCHED: 808=1, 19404=2, 324857=3
--   alice   WATCHED: 603=6, 27205=7, 157336=8, 550=9
--   bob     WATCHED: 13=12, 274=13, 238=14, 769=15
--   carol   WATCHED: 372058=18, 808=19, 324857=20
-- ─────────────────────────────────────────────
INSERT INTO Review (InteractionID, Rating, Review, DateRated) VALUES
(1,  10, 'A cinematic masterpiece! Never gets old no matter how many times I watch it.',        '2026-02-02'),
(2,  9,  'The most iconic Bollywood romance ever made. SRK and Kajol are unforgettable.',       '2026-02-07'),
(3,  10, 'Completely reinvented what an animated film could be. Stunning in every way.',        '2026-02-09'),
(6,  9,  'The Matrix changed action movies forever. Still holds up perfectly today.',           '2026-02-11'),
(7,  8,  'Had to watch it twice to understand it fully but completely worth it.',               '2026-02-13'),
(8,  9,  'Emotionally devastating and visually breathtaking. Nolan at his most ambitious.',     '2026-02-15'),
(9,  8,  'Dark, twisted, and brilliantly written. Norton and Pitt are electric together.',      '2026-02-17'),
(12, 9,  'Tom Hanks delivers one of the greatest performances in cinema history.',              '2026-02-16'),
(13, 8,  'One of the most gripping thrillers ever made. Hopkins is terrifying.',                '2026-02-18'),
(14, 10, 'The greatest film ever made. Every frame is perfect.',                               '2026-02-20'),
(15, 9,  'Scorsese at his absolute best. Ray Liotta is incredible throughout.',                 '2026-02-22'),
(18, 10, 'The most beautiful animated film I have ever seen. Cried multiple times.',            '2026-02-21'),
(19, 8,  'A classic I grew up with. Still makes me laugh every single time.',                  '2026-02-23'),
(20, 9,  'Into the Spider-Verse is a love letter to Spider-Man and animation itself.',          '2026-02-25');

COMMIT;
