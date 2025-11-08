// English Pronunciation Assessment Data (5 Sets)
// - Each set contains 10 words, 3 sentences (beginner/intermediate/advanced), and 1 paragraph.

/**
 * Pronunciation Set Type
 * @typedef {Object} PronSet
 * @property {string} id        - Set identifier (e.g., 'A', 'B', 'C', 'D', 'E')
 * @property {string} name      - Set name (e.g., 'Set A')
 * @property {string[]} words   - 10 words
 * @property {string[]} sentences - 3 sentences (beginner/intermediate/advanced)
 * @property {string} paragraph - Paragraph text
 */

// Set A
const setA = /** @type {PronSet} */({
  id: 'A',
  name: 'Set A',
  words: [
    'apple',
    'book',
    'chair',
    'doctor',
    'elephant',
    'friend',
    'guitar',
    'hospital',
    'interesting',
    'journey',
  ],
  sentences: [
    'I like to read books every day.',
    'My brother plays the guitar very well.',
    'The conference discussed environmental sustainability and technological innovation.',
  ],
  paragraph: `Last weekend, I visited the art museum with my family. We saw many beautiful paintings and sculptures from different countries. The exhibition about modern art was particularly fascinating, and we spent almost two hours exploring it.`,
});

// Set B
const setB = /** @type {PronSet} */({
  id: 'B',
  name: 'Set B',
  words: [
    'beautiful',
    'computer',
    'delicious',
    'education',
    'fantastic',
    'happiness',
    'important',
    'language',
    'mountain',
    'necessary',
  ],
  sentences: [
    'The weather is beautiful today.',
    'Learning a new language requires dedication and practice.',
    'International cooperation is essential for addressing global challenges such as climate change.',
  ],
  paragraph: `I have been studying English for six months now. Recently, I started watching English movies with subtitles to improve my listening skills. The natural conversations and different accents help me understand the language better.`,
});

// Set C
const setC = /** @type {PronSet} */({
  id: 'C',
  name: 'Set C',
  words: [
    'celebrate',
    'daughter',
    'exercise',
    'favorite',
    'government',
    'information',
    'knowledge',
    'library',
    'neighborhood',
    'opportunity',
  ],
  sentences: [
    'We celebrate holidays with our family.',
    'The library has many interesting books to read.',
    'Cultural diversity enriches our society and promotes mutual understanding.',
  ],
  paragraph: `Last month, I traveled to New York City for the first time. I visited famous landmarks like the Statue of Liberty and Central Park. The city was full of energy, and I enjoyed trying different foods from around the world.`,
});

// Set D
const setD = /** @type {PronSet} */({
  id: 'D',
  name: 'Set D',
  words: [
    'challenge',
    'comfortable',
    'decision',
    'excellent',
    'familiar',
    'gradually',
    'historical',
    'independent',
    'literature',
    'professional',
  ],
  sentences: [
    'Exercise is important for good health.',
    'I enjoy reading historical novels in my free time.',
    'The research findings demonstrated significant improvements in patient outcomes.',
  ],
  paragraph: `This weekend, I plan to visit a famous restaurant downtown. It has been featured in several cooking shows and magazines. I am excited to try their signature dish and experience the atmosphere that many celebrities have enjoyed.`,
});

// Set E
const setE = /** @type {PronSet} */({
  id: 'E',
  name: 'Set E',
  words: [
    'achievement',
    'architecture',
    'civilization',
    'communicate',
    'development',
    'extraordinary',
    'imagination',
    'philosopher',
    'technology',
    'vocabulary',
  ],
  sentences: [
    'Communication skills are essential in any profession.',
    'Ancient civilizations built remarkable architectural monuments.',
    'The integration of artificial intelligence into healthcare systems presents both opportunities and ethical challenges.',
  ],
  paragraph: `My favorite music group recently released a new album featuring contemporary and classical elements. The fusion of different musical styles creates a unique sound that appeals to diverse audiences. Attending their live concert was an unforgettable experience.`,
});

export const pronEnSets = /** @type {PronSet[]} */([
  setA,
  setB,
  setC,
  setD,
  setE,
]);

// Stable hash function (for ID-based distribution)
function stableHash(input) {
  const str = String(input ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Evenly distribute sets based on participant ID (or session ID).
 * Automatically distributes based on the number of pronEnSets.
 * @param {string|number} participantId
 * @returns {PronSet}
 */
export function getAssignedPronEnSet(participantId) {
  if (!pronEnSets.length) {
    throw new Error('No English pronunciation sets are configured');
  }
  const idx = stableHash(participantId) % pronEnSets.length;
  return pronEnSets[idx];
}

/**
 * Find set by ID. Returns undefined if not found.
 * @param {string} id
 * @returns {PronSet|undefined}
 */
export function getPronEnSetById(id) {
  return pronEnSets.find((s) => s.id === id);
}

// Export default set items for compatibility with current pages
const defaultSet = pronEnSets[0];
export const words = defaultSet.words;
export const sentences = defaultSet.sentences;
export const paragraph = defaultSet.paragraph;

// Use this to get the default set directly if needed
export function getDefaultPronEnSet() {
  return defaultSet;
}
