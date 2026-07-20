// Chat Session, History, and Gemini API Client Module
import { CONVERSATIONS_KEY, GEMINI_KEY_STORAGE, ACTIVE_GEMINI_MODEL } from './config.js';

export let geminiApiKey = "";
export let activeGeminiModel = ACTIVE_GEMINI_MODEL;

export function setGeminiApiKey(key) {
  geminiApiKey = key;
}

export function initGeminiKey(inputElement, statusElement, clearButton) {
  const ENCODED_KEY = "QVEuQWI4Uk42SmQwV0VQaUt0Zzc4RWo0TjdQalZiRjdSVS1jVU8yeE5FWk9MV3d4cWdOWlE=";
  const defaultKey = atob(ENCODED_KEY);
  
  try {
    let key = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (!key) {
      key = defaultKey;
      localStorage.setItem(GEMINI_KEY_STORAGE, key);
    }
    
    geminiApiKey = key;
    if (inputElement) inputElement.value = key;
    if (statusElement) statusElement.innerText = "Status: Active";
    if (clearButton) clearButton.style.display = "inline-block";
  } catch (e) {
    console.warn("localStorage read blocked for Gemini key. Using fallback.", e);
    geminiApiKey = defaultKey;
  }
}

// Backup in-memory storage to survive local protocol blocks
let backupInMemoryChats = [];

// Conversation History Storage Manager
export const ConversationHistory = {
  get: function() {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          backupInMemoryChats = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn("localStorage read blocked. Using in-memory fallback.", e);
    }
    return backupInMemoryChats;
  },
  
  save: function(chats) {
    backupInMemoryChats = chats;
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(chats));
      return true;
    } catch (e) {
      console.warn("localStorage write blocked. History saved in memory only.", e);
      return false;
    }
  },
  
  addMessage: function(chatId, sender, text, source = null, options = null) {
    let chats = this.get();
    let chat = chats.find(c => c.id === chatId);
    if (!chat) {
      chat = {
        id: chatId,
        title: text.substring(0, 26) + (text.length > 26 ? '...' : ''),
        timestamp: new Date().toISOString(),
        messages: []
      };
      chats.push(chat);
    }
    chat.messages.push({ sender, text, source, options });
    this.save(chats);
    return chats;
  },
  
  deleteChat: function(chatId) {
    let chats = this.get();
    chats = chats.filter(c => c.id !== chatId);
    this.save(chats);
    return chats;
  },
  
  clearAll: function() {
    backupInMemoryChats = [];
    try {
      localStorage.removeItem(CONVERSATIONS_KEY);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};

// Fetch helper for Google Gemini API
export async function callGeminiAPI(promptText) {
  if (!geminiApiKey) {
    throw new Error("Gemini API Key is missing.");
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/${activeGeminiModel}:generateContent?key=${geminiApiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second request timeout
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.2
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API.");
    }
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Gemini API call timed out after 8 seconds.");
    }
    throw error;
  }
}

// Levenshtein Distance for typo tolerance
function getLevenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Check if query contains a word close to the target word
function hasWordCloseTo(query, targetWord, maxDistance = 1) {
  const words = query.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  return words.some(w => {
    if (w === targetWord) return true;
    if (w.length < 4 || targetWord.length < 4) {
      return w === targetWord;
    }
    const dist = getLevenshteinDistance(w, targetWord);
    return dist <= maxDistance;
  });
}

// Intercept generic queries before searching corporate database
export function getGenericResponse(query) {
  const queryLower = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  const hasCompanyWord = hasWordCloseTo(queryLower, 'company') || hasWordCloseTo(queryLower, 'bank') || hasWordCloseTo(queryLower, 'amberleigh') || queryLower.includes('private bank');
  
  // Greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'hola', 'yo', 'good morning', 'good afternoon', 'good evening', 'wasup', 'whats up'];
  if (greetings.some(g => queryLower === g || queryLower.startsWith(g + ' ') || hasWordCloseTo(queryLower, g, 1))) {
    return {
      message: "Hello! I am the Amberleigh Private Bank Virtual Concierge. I can help you search for information across our corporate departments. What would you like to query today?",
      options: [
        { text: "Careers Opportunities", query: "Tell me about Careers" },
        { text: "Q1 Financial Earnings", query: "What was the record profit in Q1 2026?" },
        { text: "Contact Information", query: "What is the corporate headquarters address?" }
      ]
    };
  }
  
  // Goodbyes
  const goodbyes = ['bye', 'goodbye', 'see you', 'have a good day', 'talk later', 'exit', 'quit'];
  if (goodbyes.some(g => queryLower === g || queryLower.startsWith(g + ' ') || hasWordCloseTo(queryLower, g, 1))) {
    return {
      message: "Goodbye! Have a great day, and feel free to return if you have more questions about Amberleigh Private Bank.",
      options: []
    };
  }
  
  // Identity / Capability
  const identityKeywords = ['who are you', 'what is your name', 'what are you', 'what can you do', 'tell me about yourself', 'what is this', 'help me', 'how do i use this'];
  if (identityKeywords.some(keyword => queryLower.includes(keyword) || hasWordCloseTo(queryLower, keyword, 1))) {
    return {
      message: "I am the Amberleigh Private Bank Virtual Concierge. I am designed to help you search for corporate information across our departments. You can ask me about:\n\n• Careers & Graduate Programmes\n• Investor Relations & financial reports\n• Sustainability & ESG responsibility targets\n• Latest press releases & media relations\n• Amberleigh Research forecasts\n• Contact helplines & headquarters address",
      options: [
        { text: "Careers", query: "Tell me about Careers" },
        { text: "Investor Relations", query: "What are the Q1 2026 results?" },
        { text: "Responsibility", query: "What are the ESG targets?" }
      ]
    };
  }
  
  // Gratitude
  const gratitudeKeywords = ['thanks', 'thank you', 'appreciate it', 'awesome', 'perfect', 'great', 'cool', 'nice'];
  if (gratitudeKeywords.some(keyword => queryLower === keyword || queryLower.startsWith(keyword + ' ') || hasWordCloseTo(queryLower, keyword, 1))) {
    return {
      message: "You're very welcome! I'm happy to help. Let me know if there's anything else you'd like to search for.",
      options: [
        { text: "Latest Media Press Releases", query: "Show me latest Media news" },
        { text: "Amberleigh Research Forecasts", query: "Show me Research outlook" }
      ]
    };
  }
  
  // Small Talk (How are you)
  const smallTalkHow = ['how are you', 'how is it going', 'how are you doing', 'hows it going', 'how do you do'];
  if (smallTalkHow.some(keyword => queryLower.includes(keyword))) {
    return {
      message: "I'm doing great, thank you for asking! Ready to assist you with any inquiries about Amberleigh Private Bank's corporate directory.",
      options: [
        { text: "Careers", query: "How do I apply for the Graduate Programme?" },
        { text: "Responsibility", query: "What is the sustainable finance target?" }
      ]
    };
  }
  
  // Small Talk (Are you human)
  const smallTalkBot = ['are you human', 'are you a bot', 'are you ai', 'who made you', 'are you real'];
  if (smallTalkBot.some(keyword => queryLower.includes(keyword) || hasWordCloseTo(queryLower, 'robot') || hasWordCloseTo(queryLower, 'assistant'))) {
    return {
      message: "I am a Virtual Concierge (AI Assistant) running on this portal. I do not have human feelings, but I'm fully equipped to search the Amberleigh Private Bank database for you!",
      options: [
        { text: "What can you do?", query: "what can you do" }
      ]
    };
  }
  
  // Company Overview (Fuzzy)
  const hasAboutWord = hasWordCloseTo(queryLower, 'about') || hasWordCloseTo(queryLower, 'overview') || hasWordCloseTo(queryLower, 'profile') || hasWordCloseTo(queryLower, 'info') || hasWordCloseTo(queryLower, 'details') || hasWordCloseTo(queryLower, 'information') || queryLower.includes('tell me') || queryLower.includes('what is');
  if (hasAboutWord && hasCompanyWord) {
    return {
      message: "Amberleigh Private Bank is a premier global private financial institution and wealth management provider. Headquartered in Frankfurt, Germany, it serves private, corporate, and institutional clients across four core divisions: Private Banking, Wealth Management, Corporate Advisory, and Asset Management.",
      options: [
        { text: "Headquarters Contact", query: "What is the corporate headquarters address?" },
        { text: "Careers", query: "Tell me about Careers" },
        { text: "Q1 2026 Earnings", query: "What are the Q1 2026 results?" }
      ]
    };
  }

  // Founder & History (Fuzzy)
  const hasHistoryQuery = hasWordCloseTo(queryLower, 'history') || hasWordCloseTo(queryLower, 'founded') || queryLower.includes('when was') || hasWordCloseTo(queryLower, 'founding') || queryLower.includes('how old');
  if (hasHistoryQuery && hasCompanyWord) {
    return {
      message: "Amberleigh Private Bank was established to provide elite private wealth, trade financing, and corporate banking solutions. Over its long history, it has grown into a premier global private banking group.",
      options: [
        { text: "Corporate Headquarters", query: "Where is the headquarters?" },
        { text: "Core Divisions", query: "What businesses does the bank operate?" }
      ]
    };
  }

  // CEO / Leadership (Fuzzy)
  const hasCEOQuery = hasWordCloseTo(queryLower, 'ceo') || hasWordCloseTo(queryLower, 'sewing') || queryLower.includes('who is the') || queryLower.includes('who runs') || hasWordCloseTo(queryLower, 'leadership') || hasWordCloseTo(queryLower, 'president');
  if (hasCEOQuery && (hasCompanyWord || hasWordCloseTo(queryLower, 'boss') || hasWordCloseTo(queryLower, 'chief'))) {
    return {
      message: "The Executive Leadership of Amberleigh Private Bank directs our global strategic transformation, focusing on bespoke private wealth management, corporate advisory, and sustainable investment solutions.",
      options: [
        { text: "Financial Performance", query: "What are the Q1 2026 results?" },
        { text: "Investor Relations", query: "Show me Investor Relations details" }
      ]
    };
  }

  // Core Divisions / Businesses (Fuzzy)
  const hasDivisionsQuery = hasWordCloseTo(queryLower, 'divisions') || hasWordCloseTo(queryLower, 'services') || hasWordCloseTo(queryLower, 'departments') || hasWordCloseTo(queryLower, 'sections') || queryLower.includes('what do you') || hasWordCloseTo(queryLower, 'businesses');
  if (hasDivisionsQuery && hasCompanyWord) {
    return {
      message: "Amberleigh Private Bank operates across four main business divisions:\n\n1. **Private Banking & Wealth**: Bespoke wealth planning and individual portfolio management.\n2. **Corporate Banking**: Serving corporate clients, SMEs, and institutional partners.\n3. **Investment Advisory**: Advisory, debt capital, and market strategies.\n4. **Asset Management**: Institutional and retail fund management.",
      options: [
        { text: "Careers", query: "Careers and Technology Hubs" },
        { text: "Q1 Results", query: "Q1 2026 Financial Results" }
      ]
    };
  }

  // Core Values / Mission (Fuzzy)
  const hasValuesQuery = hasWordCloseTo(queryLower, 'values') || hasWordCloseTo(queryLower, 'mission') || hasWordCloseTo(queryLower, 'culture') || hasWordCloseTo(queryLower, 'principles');
  if (hasValuesQuery && hasCompanyWord) {
    return {
      message: "Amberleigh Private Bank's corporate values guide our decisions and client service:\n\n• **Client Centricity**: Placing our clients' prosperity at the heart of our mission.\n• **Excellence & Innovation**: Delivering premier wealth management and modern tech solutions.\n• **Discipline & Integrity**: Protecting capital and upholding strict ethical standards.",
      options: [
        { text: "ESG Responsibility", query: "What are the ESG targets?" }
      ]
    };
  }
  
  return null;
}
