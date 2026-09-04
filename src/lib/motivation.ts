/**
 * Motivation Utility for CPDC Portal
 * Provides:
 * 1. Dynamic Greeting based on time of day (Good Morning / Good Afternoon / Good Evening)
 * 2. Daily Unique Non-Repeating Motivational Quote (365 unique quotes per year)
 */

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

export function getDailyMotivationQuote(): { quote: string; author: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const quoteIndex = (dayOfYear - 1) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];
}

export const MOTIVATIONAL_QUOTES = [
  { quote: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { quote: "Your dedication today determines your distinction tomorrow.", author: "CPDC Motto" },
  { quote: "Success is no accident. It is hard work, perseverance, learning, and sacrifice.", author: "Pelé" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
  { quote: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { quote: "Excellence is not a skill, it is an attitude.", author: "Ralph Marston" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Work hard in silence, let your success be your noise.", author: "Frank Ocean" },
  { quote: "Dream big, work hard, stay focused, and surround yourself with good people.", author: "Anonymous" },
  { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Skill is developed by hours and hours of dedication and practice.", author: "Will Smith" },
  { quote: "Do what is right, not what is easy.", author: "Roy T. Bennett" },
  { quote: "Continuous learning is the minimum requirement for success in any field.", author: "Brian Tracy" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { quote: "Your passion is waiting for your courage to catch up.", author: "Isabelle Lafleche" },
  { quote: "Aim for the moon. If you miss, you may hit a star.", author: "W. Clement Stone" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Knowledge is power. Information is liberating. Education is the premise of progress.", author: "Kofi Annan" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { quote: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { quote: "Confidence comes from discipline and training.", author: "Robert Kiyosaki" },
  { quote: "Learn as if you will live forever, live like you will die tomorrow.", author: "Mahatma Gandhi" },
  { quote: "Failure is the opportunity to begin again more intelligently.", author: "Henry Ford" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Make each day your masterpiece.", author: "John Wooden" },
  { quote: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { quote: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { quote: "Be so good they can't ignore you.", author: "Steve Martin" },
  { quote: "Courage is resistance to fear, mastery of fear—not absence of fear.", author: "Mark Twain" },
  { quote: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
  { quote: "Success is getting what you want; happiness is wanting what you get.", author: "W. P. Kinsella" },
  { quote: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { quote: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki" },
  { quote: "Leadership is about making others better as a result of your presence.", author: "Sheryl Sandberg" },
  { quote: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { quote: "Rise above the storm and you will find the sunshine.", author: "Mario Fernandez" },
  { quote: "The secret to success is to know something nobody else knows.", author: "Aristotle Onassis" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { quote: "The distance between dreams and reality is called action.", author: "Anonymous" },
  { quote: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Never bend your head. Always hold it high. Look the world straight in the eye.", author: "Helen Keller" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "To be a leader, you must first inspire yourself.", author: "Anonymous" },
  { quote: "With self-discipline almost anything is possible.", author: "Theodore Roosevelt" },
  { quote: "Turn your obstacles into opportunities.", author: "CPDC Skill Hub" },
  { quote: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { quote: "Success starts with self-discipline.", author: "Dwayne Johnson" },
  { quote: "Mastering others is strength; mastering yourself is true power.", author: "Lao Tzu" },
  { quote: "Every day is a fresh start. Take a deep breath and start again.", author: "Anonymous" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Character is how you treat those who can do nothing for you.", author: "Johann Wolfgang von Goethe" },
  { quote: "Set your goals high, and don't stop till you get there.", author: "Bo Jackson" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "Be relentless in the pursuit of what sets your mind on fire.", author: "Anonymous" },
  { quote: "Patience, persistence and perspiration make an unbeatable combination for success.", author: "Napoleon Hill" },
  { quote: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { quote: "Greatness is not a location, but a direction.", author: "Oliver Wendell Holmes" },
  { quote: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { quote: "Integrity is doing the right thing, even when no one is watching.", author: "C.S. Lewis" },
  { quote: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { quote: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Never give up on a dream just because of the time it will take to accomplish it.", author: "Earl Nightingale" },
  { quote: "Focus on your goals, not your obstacles.", author: "Anonymous" },
  { quote: "Dreaming, after all, is a form of planning.", author: "Gloria Steinem" },
  { quote: "Skill is only developed by practice.", author: "Bruce Lee" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { quote: "Work hard, be kind, and amazing things will happen.", author: "Conan O'Brien" },
  { quote: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { quote: "If opportunity doesn't knock, build a door.", author: "Milton Berle" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Innovate or get left behind.", author: "CPDC Executive Counsel" },
  { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { quote: "Do not wait; the time will never be 'just right'.", author: "Napoleon Hill" },
  { quote: "Small acts of courage lead to big achievements.", author: "Anonymous" },
  { quote: "Be happy with what you have while working for what you want.", author: "Helen Keller" },
  { quote: "Great leaders inspire greatness in others.", author: "Anonymous" },
  { quote: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { quote: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
  { quote: "Make your life a mission, not an interception.", author: "Arnold H. Glasow" },
  { quote: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { quote: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { quote: "There is no substitute for hard work.", author: "Thomas Edison" },
  { quote: "Believe in the power of your potential.", author: "Anonymous" },
  { quote: "Success builds character, failure reveals it.", author: "Dave Checketts" },
  { quote: "Keep going. Everything you need will come to you at the perfect time.", author: "Anonymous" },
  { quote: "Knowledge is of no value unless you put it into practice.", author: "Anton Chekhov" }
];
