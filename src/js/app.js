// Main Application Orchestrator and Bootstrapper module
import { KnowledgeBase, searchKnowledgeBase } from './database.js';
import { 
  ConversationHistory, 
  geminiApiKey, 
  initGeminiKey, 
  callGeminiAPI, 
  getGenericResponse 
} from './chat.js';
import { 
  elements, 
  switchView, 
  renderSidebar, 
  renderRecentChats, 
  startNewChat, 
  renderBrowseView, 
  renderAdminView, 
  openCreateForm, 
  closeAdminForm, 
  authenticateAdmin, 
  appendMessage, 
  appendMessageInstantly, 
  showTypingIndicator, 
  removeTypingIndicator, 
  showToast, 
  activeBrowseSection, 
  activeChatId, 
  setActiveChatId, 
  setActiveBrowseSection 
} from './ui.js';

let kbData = {};

// Bootstrapping the Application
async function init() {
  // 1. Fetch live corporate policy database
  kbData = await KnowledgeBase.loadFromBackend();
  
  // 2. Initialize UI Components
  renderSidebar(kbData);
  renderRecentChats(loadChatSession, deleteChatSession);
  
  // 3. Initialize Gemini Integration Key
  initGeminiKey(elements.inputGeminiKey, elements.keyStatusText, elements.btnClearGeminiKey);
  
  // 4. Register event listeners
  setupEventListeners();
  
  console.log("Amberleigh Private Bank Assistant fully initialized.");
}

// Set up DOM Event Listeners
function setupEventListeners() {
  // Navigation
  if (elements.navChat) {
    elements.navChat.addEventListener("click", () => {
      if (activeChatId) {
        loadChatSession(activeChatId);
      } else {
        startNewChat(kbData);
      }
    });
  }
  
  if (elements.btnToggleAdmin) {
    elements.btnToggleAdmin.addEventListener("click", () => {
      authenticateAdmin(() => {
        switchView("admin", kbData);
      });
    });
  }
  
  if (elements.btnNewChat) {
    elements.btnNewChat.addEventListener("click", () => startNewChat(kbData));
  }
  
  // Database Reset
  const btnResetDb = document.getElementById("btn-reset-db");
  if (btnResetDb) {
    btnResetDb.addEventListener("click", () => {
      authenticateAdmin(() => {
        if (confirm("This will clear all changes, delete conversation history, and restore the default Amberleigh Private Bank corporate data. Continue?")) {
          kbData = KnowledgeBase.reset();
          ConversationHistory.clearAll();
          setActiveChatId(null);
          setActiveBrowseSection(null);
          renderSidebar(kbData);
          renderRecentChats(loadChatSession, deleteChatSession);
          startNewChat(kbData);
          if (document.getElementById("view-admin").classList.contains("active")) {
            renderAdminView(kbData);
            closeAdminForm();
          }
          showToast("Database and history restored to defaults");
        }
      });
    });
  }
  
  // Admin Form triggers
  if (elements.btnAdminCreateNew) {
    elements.btnAdminCreateNew.addEventListener("click", openCreateForm);
  }
  if (elements.btnFormCancel) {
    elements.btnFormCancel.addEventListener("click", closeAdminForm);
  }
  
  if (elements.adminArticleForm) {
    elements.adminArticleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const sectionKey = elements.formArticleSection.value;
      const articleId = elements.formArticleId.value || `art-${Date.now()}`;
      const keywords = elements.formArticleKeywords.value
        .split(",")
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0);
        
      const article = {
        id: articleId,
        title: elements.formArticleTitle.value.trim(),
        keywords: keywords,
        content: elements.formArticleContent.value.trim()
      };
      
      const updatedKb = KnowledgeBase.saveArticle(sectionKey, article);
      Object.assign(kbData, updatedKb);
      
      renderSidebar(kbData);
      renderAdminView(kbData);
      closeAdminForm();
      showToast("Article saved successfully");
    });
  }

  // Gemini Key triggers
  if (elements.btnSaveGeminiKey) {
    elements.btnSaveGeminiKey.addEventListener("click", () => {
      const key = elements.inputGeminiKey.value.trim();
      if (!key) {
        alert("Please enter a valid API key.");
        return;
      }
      try {
        localStorage.setItem('db_chatbot_gemini_key', key);
        initGeminiKey(elements.inputGeminiKey, elements.keyStatusText, elements.btnClearGeminiKey);
        showToast("Gemini API Key saved!");
      } catch (e) {
        showToast("Key saved in-memory (expires on refresh)");
        if (elements.keyStatusText) elements.keyStatusText.innerText = "Status: Active (Memory)";
        if (elements.btnClearGeminiKey) elements.btnClearGeminiKey.style.display = "inline-block";
      }
    });
  }
  
  if (elements.btnClearGeminiKey) {
    elements.btnClearGeminiKey.addEventListener("click", () => {
      try {
        localStorage.removeItem('db_chatbot_gemini_key');
      } catch (e) {}
      initGeminiKey(elements.inputGeminiKey, elements.keyStatusText, elements.btnClearGeminiKey);
      showToast("Gemini API Key removed.");
    });
  }
  
  // Ask Assistant Button from Browse View
  if (elements.btnBrowseAskAssistant) {
    elements.btnBrowseAskAssistant.addEventListener("click", () => {
      if (activeBrowseSection) {
        const sectionName = kbData[activeBrowseSection].title;
        elements.chatUserInput.value = `Tell me about ${sectionName}`;
        switchView("chat", kbData);
        handleChatSubmit();
      }
    });
  }
  
  // Main Chat Form submission
  const chatInputForm = document.getElementById("chat-input-form");
  if (chatInputForm) {
    chatInputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleChatSubmit();
    });
  }
}

// Handle Chat Message Submissions
function handleChatSubmit() {
  const query = elements.chatUserInput.value.trim();
  if (!query) return;
  
  if (elements.chatWelcome) {
    elements.chatWelcome.style.display = "none";
  }
  
  const isFirstMessage = !activeChatId;
  if (isFirstMessage) {
    setActiveChatId(`chat-${Date.now()}`);
  }
  
  ConversationHistory.addMessage(activeChatId, "user", query);
  
  if (isFirstMessage) {
    renderRecentChats(loadChatSession, deleteChatSession);
  }
  
  appendMessage("user", query, null, null, onChipClick);
  elements.chatUserInput.value = "";
  elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
  
  if (geminiApiKey) {
    const typingId = showTypingIndicator();
    
    (async () => {
      try {
        const localMatch = searchKnowledgeBase(kbData, query);
        let promptText = "";
        let sourceToCite = null;
        
        if (localMatch) {
          const systemInstruction = "Instruction: You are the Amberleigh Private Bank Virtual Concierge. Answer the user's question directly, accurately, and thoroughly in clear paragraph form. Start your answer immediately with the exact information requested, followed by a complete and detailed explanation of all relevant rules, thresholds, and guidelines. Keep your tone professional, helpful, and conversational. Do not write manual 'Source:' text at the end as the UI displays a dedicated source badge.";
          promptText = `${systemInstruction}\n\nContext from Amberleigh Private Bank Database:\nSection: ${localMatch.source.sectionTitle}\nArticle: ${localMatch.source.articleTitle}\nContent: ${localMatch.content}\n\nUser Question: ${query}`;
          sourceToCite = localMatch.source;
        } else {
          // Check for generic answers first to save API tokens
          const localGeneric = getGenericResponse(query);
          if (localGeneric) {
            removeTypingIndicator(typingId);
            ConversationHistory.addMessage(activeChatId, "bot", localGeneric.message, null, localGeneric.options);
            appendMessage("bot", localGeneric.message, null, localGeneric.options, onChipClick);
            elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
            return;
          }
          
          const systemInstruction = "Instruction: You are the Amberleigh Private Bank Virtual Concierge and smart assistant. If the user's question is about Amberleigh Private Bank (policies, onboarding, expenses, HR), answer it professionally using bank standards. If the user's question is a general or universal question (such as general knowledge, coding, writing help, calculations, or translation), act as a helpful universal assistant like ChatGPT and answer it thoroughly, accurately, and politely in clear paragraph form. Keep your tone professional, intelligent, and supportive.";
          promptText = `${systemInstruction}\n\nUser Question: ${query}`;
        }
        
        const aiAnswer = await callGeminiAPI(promptText);
        
        removeTypingIndicator(typingId);
        ConversationHistory.addMessage(activeChatId, "bot", aiAnswer, sourceToCite);
        appendMessage("bot", aiAnswer, sourceToCite, null, onChipClick);
        elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
        
      } catch (err) {
        console.error("Gemini API Error. Falling back to local static search:", err);
        removeTypingIndicator(typingId);
        runLocalSearchFallback(query);
      }
    })();
    return;
  }
  
  runLocalSearchFallback(query);
}

// Fallback search when Gemini is inactive or fails
function runLocalSearchFallback(query) {
  const genericResponse = getGenericResponse(query);
  if (genericResponse) {
    ConversationHistory.addMessage(activeChatId, "bot", genericResponse.message, null, genericResponse.options);
    appendMessage("bot", genericResponse.message, null, genericResponse.options, onChipClick);
  } else {
    const result = searchKnowledgeBase(kbData, query);
    if (result) {
      const formattedParagraph = `According to Amberleigh Private Bank official policy regarding ${result.source.articleTitle}:\n\n${result.content}\n\nIf you have additional questions or require further assistance, please consult the Policy Hub or contact the Ask HR Service Desk.`;
      ConversationHistory.addMessage(activeChatId, "bot", formattedParagraph, result.source);
      appendMessage("bot", formattedParagraph, result.source, null, onChipClick);
    } else {
      const suggestions = generateSearchFallbackSuggestions(query);
      ConversationHistory.addMessage(activeChatId, "bot", suggestions.message, null, suggestions.options);
      appendMessage("bot", suggestions.message, null, suggestions.options, onChipClick);
    }
  }
  elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
}

// Generate smart search suggestions when no match is found
function generateSearchFallbackSuggestions(query) {
  const queryLower = query.toLowerCase();
  let suggestions = [];
  
  Object.keys(kbData).forEach(sectionKey => {
    const section = kbData[sectionKey];
    if (queryLower.includes(sectionKey.replace('_', ' ')) || queryLower.includes(section.title.toLowerCase())) {
      suggestions.push({
        text: `Browse the ${section.title} section`,
        action: () => {
          setActiveBrowseSection(sectionKey);
          switchView("browse", kbData);
          renderBrowseView(kbData, sectionKey);
        }
      });
    }
  });
  
  if (suggestions.length === 0) {
    const allArticles = [];
    Object.keys(kbData).forEach(sKey => {
      if (kbData[sKey].articles) {
        kbData[sKey].articles.forEach(a => {
          allArticles.push({ title: a.title, query: a.title });
        });
      }
    });
    
    const shuffled = allArticles.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    return {
      message: "I couldn't find a direct match for that query in our database. Try checking your spelling or selecting one of these common inquiries:",
      options: selected.map(item => ({ text: item.title, query: item.query }))
    };
  }
  
  return {
    message: "I couldn't find a specific article matching your search, but I noticed you asked about a corporate section. You can check the following:",
    options: suggestions
  };
}

// Load a previous conversation
function loadChatSession(chatId) {
  setActiveChatId(chatId);
  const chats = ConversationHistory.get();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;
  
  if (elements.chatWelcome) {
    elements.chatWelcome.style.display = "none";
  }
  
  const rows = elements.chatHistory.querySelectorAll(".message-row");
  rows.forEach(r => r.remove());
  
  chat.messages.forEach(msg => {
    appendMessageInstantly(msg.sender, msg.text, msg.source, msg.options, onChipClick);
  });
  
  switchView("chat", kbData);
  renderRecentChats(loadChatSession, deleteChatSession);
  
  elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
}

// Delete a conversation from history
function deleteChatSession(chatId) {
  if (confirm("Are you sure you want to delete this conversation?")) {
    ConversationHistory.deleteChat(chatId);
    if (activeChatId === chatId) {
      startNewChat(kbData);
    } else {
      renderRecentChats(loadChatSession, deleteChatSession);
    }
    showToast("Conversation deleted");
  }
}

// Handle clicking of suggested/option chips
function onChipClick(opt) {
  if (opt.query) {
    elements.chatUserInput.value = opt.query;
    handleChatSubmit();
  } else if (opt.action) {
    opt.action();
  }
}

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
