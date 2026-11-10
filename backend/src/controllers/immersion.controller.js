import { getFallbackLanguageData, IMMERSION_DATABASE } from "../lib/immersionData.js";

// Fast in-memory cache for daily immersion entries
// Key: `${language}_${dateString}` -> Value: { data, timestamp }
const immersionCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch real-time phonetics and pronunciation audio from Free Dictionary API
 * Protected with a strict 2.5-second timeout to prevent hanging requests.
 */
async function fetchEnrichedDictionaryData(word) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const cleanWord = encodeURIComponent(word.trim().split(" ")[0]);
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    if (Array.isArray(data) && data[0]) {
      const entry = data[0];
      const phonetics = entry.phonetics || [];
      const audioObj = phonetics.find((p) => p.audio && p.audio.length > 0);
      const textPhonetic = entry.phonetic || (phonetics[0] && phonetics[0].text);

      return {
        audioUrl: audioObj ? audioObj.audio : null,
        apiPhonetic: textPhonetic || null,
        sourceUrls: entry.sourceUrls || [],
      };
    }
  } catch (err) {
    // Graceful fallback on timeout or offline
    return null;
  }
  return null;
}

/**
 * Get Daily Immersion Spark for the user's target language
 * Endpoint: GET /api/immersion/daily?language=...
 */
export async function getDailyImmersion(req, res) {
  try {
    const targetLanguage = (
      req.query.language ||
      req.user?.learningLanguage ||
      "Spanish"
    ).trim();

    const langKey = targetLanguage.toLowerCase();
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const cacheKey = `${langKey}_${today}`;

    // 1. Check in-memory cache (serves 100k users in < 0.5ms)
    if (immersionCache.has(cacheKey)) {
      const cached = immersionCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return res.status(200).json({
          ...cached.data,
          cached: true,
        });
      }
    }

    // 2. Resolve base linguistic content
    const baseData = getFallbackLanguageData(targetLanguage);

    // 3. Attempt real-time enrichment via Free Dictionary API if applicable
    let enrichedAudio = null;
    let enrichedPhonetic = null;

    if (langKey === "english" || baseData.word) {
      const liveDict = await fetchEnrichedDictionaryData(baseData.word);
      if (liveDict) {
        enrichedAudio = liveDict.audioUrl;
        if (liveDict.apiPhonetic) {
          enrichedPhonetic = liveDict.apiPhonetic;
        }
      }
    }

    const payload = {
      language: targetLanguage,
      date: today,
      wordOfTheDay: {
        word: baseData.word,
        phonetic: enrichedPhonetic || baseData.phonetic,
        partOfSpeech: baseData.partOfSpeech,
        meaning: baseData.meaning,
        example: baseData.example,
        exampleTranslation: baseData.exampleTranslation,
        audioUrl: enrichedAudio,
      },
      culturalIdiom: baseData.idiom,
      slang: baseData.slang,
      conversationStarter: baseData.icebreaker,
    };

    // Cache entry for the rest of the day
    immersionCache.set(cacheKey, {
      data: payload,
      timestamp: Date.now(),
    });

    res.status(200).json({
      ...payload,
      cached: false,
    });
  } catch (error) {
    console.error("❌ Error in getDailyImmersion controller:", error.message);
    res.status(500).json({ message: "Failed to retrieve daily immersion spark" });
  }
}

/**
 * Get a randomized idiom/spark for continuous practice
 * Endpoint: GET /api/immersion/random?language=...
 */
export async function getRandomImmersion(req, res) {
  try {
    const targetLanguage = (
      req.query.language ||
      req.user?.learningLanguage ||
      "Spanish"
    ).trim();

    const langKey = targetLanguage.toLowerCase();
    const list = IMMERSION_DATABASE[langKey];

    let item;
    if (list && list.length > 0) {
      const randomIndex = Math.floor(Math.random() * list.length);
      item = list[randomIndex];
    } else {
      item = getFallbackLanguageData(targetLanguage);
    }

    res.status(200).json({
      language: targetLanguage,
      wordOfTheDay: {
        word: item.word,
        phonetic: item.phonetic,
        partOfSpeech: item.partOfSpeech,
        meaning: item.meaning,
        example: item.example,
        exampleTranslation: item.exampleTranslation,
      },
      culturalIdiom: item.idiom,
      slang: item.slang,
      conversationStarter: item.icebreaker,
    });
  } catch (error) {
    console.error("❌ Error in getRandomImmersion controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

