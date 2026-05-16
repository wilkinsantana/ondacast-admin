// Category normalization — maps raw M3U group-title / Xtream category_name
// values to a canonical OndaCast taxonomy. The goal is to collapse provider-
// specific prefixes ("Xumo Kids", "LG Kids", "Pluto TV Kids") into a single
// "Kids" category so the master playlist and genre filter read cleanly.
//
// Each canonical key maps to an array of lowercase patterns. The normalizer
// checks each pattern against the cleaned input (provider prefixes stripped).
// First match wins — order patterns from most specific to least.

const CATEGORY_RULES: [string, string[]][] = [
  ['Kids', ['kids', 'children', 'child', 'family', 'cartoon', 'animation', 'anime', 'toon', 'nick', 'disney']],
  ['Movies', ['movies', 'movie', 'film', 'films', 'cinema', 'feature films', 'hollywood', 'blockbuster']],
  ['News', ['news', 'opinion', 'journalism', 'report', 'today', 'world news', 'headlines', 'current events', 'politics', 'political']],
  ['Sports', ['sports', 'sport', 'espn', 'nfl', 'nba', 'mlb', 'nhl', 'soccer', 'football', 'racing', 'wrestling', 'boxing', 'mma', 'golf', 'tennis', 'cricket']],
  ['Reality', ['reality', 'reality tv', 'reality show', 'reality competition']],
  ['Talk', ['talk show', 'talk', 'talk shows', 'late night', 'interview']],
  ['Entertainment', ['entertainment', 'variety', 'celebrity', 'pop culture', 'lifestyle', 'show', 'shows', 'game show', 'series', 'television', 'tv', 'home']],
  ['Music', ['music', 'musica', 'música', 'radio', 'audio', 'concerts', 'mtv', 'vh1', 'hits', 'mood']],
  ['Documentary', ['documentary', 'docu', 'educational', 'education', 'learn', 'history', 'nature', 'science', 'tech', 'technology', 'discovery', 'explore']],
  ['Comedy', ['comedy', 'comedia', 'humor', 'humour', 'funny', 'laughs', 'sitcom', 'stand up', 'stand-up']],
  ['Action', ['action', 'action thriller', 'adrenaline', 'stunts', 'combat', 'martial arts']],
  ['Horror', ['horror', 'terror', 'supernatural', 'paranormal', 'creepy', 'scary']],
  ['Drama', ['drama', 'series', 'soap', 'telenovela', 'novela', 'theatre']],
  ['Crime', ['crime', 'investigation', 'mystery', 'law', 'court', 'forensic', 'detective', 'police']],
  ['Faith', ['religious', 'religion', 'church', 'christian', 'faith', 'spiritual', 'gospel', 'catholic', 'worship']],
  ['Cooking', ['cooking', 'cook', 'food', 'foods', 'cuisine', 'kitchen', 'recipe', 'chef', 'baking', 'restaurant', 'grilling', 'bbq']],
  ['Travel', ['travel', 'nature', 'wildlife', 'outdoor', 'adventure', 'tour', 'destination', 'scenic']],
  ['Gaming', ['gaming', 'game', 'games', 'esports', 'e-sports', 'video game', 'gamer', 'twitch']],
  ['Local', ['local', 'regional', 'city', 'community', 'public access', 'municipal']],
  ['Latino', ['latino', 'latin', 'hispanic', 'en español', 'espanol', 'latinoamerica', 'mexico', 'telemundo', 'univision']],
  ['Business', ['business', 'finance', 'financial', 'economy', 'market', 'stock', 'investing', 'crypto']],
  ['Shopping', ['shopping', 'shop', 'commerce', 'retail', 'deals', 'home shopping']],
  ['Classic', ['classic', 'retro', 'vintage', 'old', 'throwback', 'nostalgia', 'western', 'westerns']],
  ['General', ['general', 'misc', 'other', 'various', 'mixed']],
];

// Provider prefixes stripped before matching so "Xumo Kids" → "kids".
const PROVIDER_PREFIXES = [
  'xumo', 'lg', 'samsung', 'samsung tv plus', 'pluto', 'pluto tv',
  'vizio', 'roku', 'freevee', 'plex', 'tubi', 'amazon', 'google',
  'apple', 'fubo', 'sling', 'hulu', 'peacock', 'paramount',
  'distro', 'stirr', 'redbox', 'crackle', 'philo', 'directv',
  'dish', 'comcast', 'xfinity', 'spectrum', 'cox', 'optimum',
  'verizon', 'att', 't-mobile', 'tcl', 'hisense', 'philips',
  'sharp', 'sony', 'panasonic', 'insignia', 'element', 'westinghouse',
];

/** Try to match a single term (word or short phrase) against canonical
 *  patterns. Returns the canonical name or null if no rule matches. */
export function tryMatchTerm(term: string): string | null {
  const check = term
    .replace(/&/g, 'and')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!check || check === 'general') return 'General';

  for (const [canonical, patterns] of CATEGORY_RULES) {
    for (const pattern of patterns) {
      if (check === pattern || check.includes(pattern)) {
        return canonical;
      }
    }
  }
  return null;
}

/** Normalize a raw group-title / category_name to a canonical category.
 *
 *  Compound categories ("Kids + Family", "News / Opinion", "Action, Drama",
 *  "Family and Kids", "Movies: Action", "Sports - Football") are split on
 *  + & / , | : "and" " - " separators and each part is tried against the
 *  rules — the first matching canonical wins.
 *
 *  When NO separator is present AND no pattern matches, the name is treated
 *  as a legitimate proper-name category ("Bachelor Nation", "Shark Tank")
 *  and kept as-is. */
export function normalizeCategory(raw: string): string {
  let cleaned = raw.trim();

  // Strip provider prefix (e.g. "Xumo Kids" → "Kids", "Xumo:Crime" → "Crime",
  // "LG - Kids + Family" → "Kids + Family", "Pluto TV Movies" → "Movies")
  const lower = cleaned.toLowerCase();
  for (const prefix of PROVIDER_PREFIXES) {
    if (lower.startsWith(prefix) && /^[\s:\\-|]+/.test(lower.slice(prefix.length))) {
      cleaned = cleaned.slice(prefix.length).replace(/^[\s:\\-|]+/, '').trim();
      break;
    }
  }

  // Normalize compound separators (& + / , | : "and" " - ") to a canonical pipe
  const normed = cleaned
    .replace(/\s+and\s+/gi, ' | ')
    .replace(/\s+-\s+/g, ' | ')
    .replace(/\s*[&+/,|:]\s*/g, ' | ');

  const hasSeparator = normed !== cleaned;

  if (hasSeparator) {
    const parts = normed
      .split(/\s*\|\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const part of parts) {
      const match = tryMatchTerm(part);
      if (match) return match;
    }

    // No part matched any rule — fall back to the first part
    const first = parts[0]!;
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }

  // Single term — try direct match
  const match = tryMatchTerm(cleaned);
  if (match) return match;

  // No separator + no match — proper name, keep as-is but title-case
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

/** Return a stable lowercase ID for a normalized category, suitable for
 *  filter values and URL slugs. */
export function categoryId(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]/g, '');
}
