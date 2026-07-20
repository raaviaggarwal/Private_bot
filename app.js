// Application Controller for Deutsche Bank Chatbot Portal

// Common stop words to exclude from keyword search
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 
  'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 
  'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 
  'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
  'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 
  'will', 'just', 'don', 'should', 'now', 'want', 'please', 'tell', 'search', 'find', 'get'
]);

// Map icons to SVG paths
const ICONS = {
  newspaper: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>`,
  briefcase: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
  "trending-up": `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`,
  search: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`,
  shield: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`,
  mail: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-9+13a8.967 8.967 0 01-6 2.292c-1.052 0-2.062-.18-3-.512v-9A9 9 0 0121 12v9z"></path></svg>`,
  "file-text": `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
};

// Application state
let kbData = {};
let activeView = "chat"; // chat, browse, admin
let activeBrowseSection = null;
let activeChatId = null;

// Local Storage Conversation Key
const CONVERSATIONS_KEY = 'db_chatbot_conversations';

// DOM Elements
const navChat = document.getElementById("nav-chat");
const dynamicNavSections = document.getElementById("dynamic-nav-sections");
const btnToggleAdmin = document.getElementById("btn-toggle-admin");
const btnResetDb = document.getElementById("btn-reset-db");
const btnNewChat = document.getElementById("btn-new-chat");
const recentChatsList = document.getElementById("recent-chats-list");
const recentChatsHeader = document.getElementById("recent-chats-header");

const viewChat = document.getElementById("view-chat");
const viewBrowse = document.getElementById("view-browse");
const viewAdmin = document.getElementById("view-admin");

const chatHistory = document.getElementById("chat-history");
const chatWelcome = document.getElementById("chat-welcome");
const chatInputForm = document.getElementById("chat-input-form");
const chatUserInput = document.getElementById("chat-user-input");

const adminArticlesList = document.getElementById("admin-articles-list");
const adminArticlesContainer = document.getElementById("admin-articles-container");
const inputGeminiKey = document.getElementById("input-gemini-key");
const btnSaveGeminiKey = document.getElementById("btn-save-gemini-key");
const btnClearGeminiKey = document.getElementById("btn-clear-gemini-key");
const keyStatusText = document.getElementById("key-status-text");

// Gemini Integration Keys/State
const GEMINI_KEY_STORAGE = 'db_chatbot_gemini_key';
let geminiApiKey = "";
let activeGeminiModel = "models/gemini-flash-latest"; // auto-configured fallback

// Backup in-memory storage to survive local protocol blocks
let backupInMemoryChats = [];

// Conversation History Storage Manager
const ConversationHistory = {
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

// Initialize App
async function init() {
  kbData = await KnowledgeBase.loadFromBackend();
  initGeminiKey();
  renderSidebar();
  renderRecentChats();
  setupEventListeners();
  switchView("chat");
}

function initGeminiKey() {
  const ENCODED_KEY = "QVEuQWI4Uk42SmQwV0VQaUt0Zzc4RWo0TjdQalZiRjdSVS1jVU8yeE5FWk9MV3d4cWdOWlE=";
  const defaultKey = atob(ENCODED_KEY);
  
  try {
    let key = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (!key) {
      key = defaultKey;
      localStorage.setItem(GEMINI_KEY_STORAGE, key);
    }
    
    geminiApiKey = key;
    if (inputGeminiKey) inputGeminiKey.value = key;
    if (keyStatusText) keyStatusText.innerText = "Status: Active";
    if (btnClearGeminiKey) btnClearGeminiKey.style.display = "inline-block";
  } catch (e) {
    console.warn("localStorage read blocked for Gemini key. Using fallback.", e);
    geminiApiKey = defaultKey;
  }
}

const browseSectionTitle = document.getElementById("browse-section-title");
const browseSectionDesc = document.getElementById("browse-section-desc");
const articlesGrid = document.getElementById("articles-grid");
const btnBrowseAskAssistant = document.getElementById("btn-browse-ask-assistant");

const btnAdminCreateNew = document.getElementById("btn-admin-create-new");
const adminFormPane = document.getElementById("admin-form-pane");
const adminFormEmpty = document.getElementById("admin-form-empty");
const adminArticleForm = document.getElementById("admin-article-form");
const btnFormCancel = document.getElementById("btn-form-cancel");

// Form Inputs
const formArticleId = document.getElementById("form-article-id");
const formArticleSection = document.getElementById("form-article-section");
const formArticleTitle = document.getElementById("form-article-title");
const formArticleKeywords = document.getElementById("form-article-keywords");
const formArticleContent = document.getElementById("form-article-content");


// Render Sidebar corporate navigation dynamically
function renderSidebar() {
  dynamicNavSections.innerHTML = "";
  
  Object.keys(kbData).forEach(key => {
    const section = kbData[key];
    const navItem = document.createElement("div");
    navItem.className = `nav-item ${activeBrowseSection === key && activeView === 'browse' ? 'active' : ''}`;
    navItem.id = `nav-${key}`;
    navItem.setAttribute("data-section", key);
    
    const iconHtml = ICONS[section.icon] || ICONS["file-text"];
    const articleCount = section.articles ? section.articles.length : 0;
    
    navItem.innerHTML = `
      <div class="nav-item-content">
        <span class="nav-item-icon">${iconHtml}</span>
        <span>${section.title}</span>
      </div>
      <span class="nav-item-badge">${articleCount}</span>
    `;
    
    navItem.addEventListener("click", () => {
      activeBrowseSection = key;
      switchView("browse");
      renderBrowseView(key);
    });
    
    dynamicNavSections.appendChild(navItem);
  });
}

// Render Recent Chats in the sidebar
function renderRecentChats() {
  if (!recentChatsList) return;
  recentChatsList.innerHTML = "";
  const chats = ConversationHistory.get();
  
  if (chats.length === 0) {
    if (recentChatsHeader) recentChatsHeader.style.display = "none";
    recentChatsList.style.display = "none";
    return;
  }
  
  if (recentChatsHeader) recentChatsHeader.style.display = "flex";
  recentChatsList.style.display = "flex";
  
  // Render latest first
  chats.slice().reverse().forEach(chat => {
    const item = document.createElement("div");
    item.className = `nav-item recent-chat-item ${activeChatId === chat.id ? 'active' : ''}`;
    item.setAttribute("data-chat-id", chat.id);
    
    const trashIcon = `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
    
    item.innerHTML = `
      <span class="recent-chat-title">${escapeHtml(chat.title)}</span>
      <button class="btn-delete-chat" data-chat-id="${chat.id}" title="Delete Conversation">
        ${trashIcon}
      </button>
    `;
    
    item.addEventListener("click", (e) => {
      if (e.target.closest('.btn-delete-chat')) return;
      loadChatSession(chat.id);
    });
    
    item.querySelector('.btn-delete-chat').addEventListener("click", (e) => {
      e.stopPropagation();
      deleteChatSession(chat.id);
    });
    
    recentChatsList.appendChild(item);
  });
}

// Load a previous conversation
function loadChatSession(chatId) {
  activeChatId = chatId;
  const chats = ConversationHistory.get();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;
  
  if (chatWelcome) {
    chatWelcome.style.display = "none";
  }
  
  // Remove all previous message rows to keep welcome element intact
  const rows = chatHistory.querySelectorAll(".message-row");
  rows.forEach(r => r.remove());
  
  chat.messages.forEach(msg => {
    appendMessageInstantly(msg.sender, msg.text, msg.source, msg.options);
  });
  
  switchView("chat");
  renderRecentChats();
  
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Start a fresh conversation
function startNewChat() {
  activeChatId = null;
  
  // Remove all previous message rows to keep welcome element intact
  const rows = chatHistory.querySelectorAll(".message-row");
  rows.forEach(r => r.remove());
  
  if (chatWelcome) {
    chatWelcome.style.display = "flex";
  }
  
  switchView("chat");
  renderRecentChats();
}

// Delete a conversation from history
function deleteChatSession(chatId) {
  if (confirm("Are you sure you want to delete this conversation?")) {
    ConversationHistory.deleteChat(chatId);
    if (activeChatId === chatId) {
      startNewChat();
    } else {
      renderRecentChats();
    }
    showToast("Conversation deleted");
  }
}

// Helper to render messages instantly without typing animation
function appendMessageInstantly(sender, text, source = null, options = null) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;
  
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  
  const contentElement = document.createElement("div");
  contentElement.className = "message-content";
  contentElement.innerHTML = formatMarkdown(text);
  bubble.appendChild(contentElement);
  
  if (source && sender === "bot") {
    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.innerHTML = `<span>Source:</span>`;
    
    const sourceLink = document.createElement("a");
    sourceLink.className = "message-source";
    sourceLink.href = "#";
    sourceLink.innerText = `${source.sectionTitle} > ${source.articleTitle}`;
    sourceLink.addEventListener("click", (e) => {
      e.preventDefault();
      activeBrowseSection = source.sectionKey;
      switchView("browse");
      renderBrowseView(source.sectionKey);
    });
    
    meta.appendChild(sourceLink);
    bubble.appendChild(meta);
  }
  
  if (options && options.length > 0) {
    const optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexWrap = "wrap";
    optionsContainer.style.gap = "8px";
    optionsContainer.style.marginTop = "12px";
    
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "suggestion-card";
      chip.style.padding = "8px 14px";
      chip.style.borderRadius = "4px";
      chip.style.fontSize = "0.85rem";
      chip.innerText = opt.text;
      
      chip.addEventListener("click", () => {
        if (opt.query) {
          chatUserInput.value = opt.query;
          handleChatSubmit();
        } else if (opt.action) {
          opt.action();
        }
      });
      optionsContainer.appendChild(chip);
    });
    
    bubble.appendChild(optionsContainer);
  }
  
  row.appendChild(bubble);
  chatHistory.appendChild(row);
}


// Switch between panels (chat, browse, admin)
function switchView(viewName) {
  activeView = viewName;
  
  // Deactivate all view panels & navigation items
  const panels = [viewChat, viewBrowse, viewAdmin];
  panels.forEach(p => p.classList.remove("active"));
  
  navChat.classList.remove("active");
  btnToggleAdmin.classList.remove("active");
  
  const navItems = dynamicNavSections.querySelectorAll(".nav-item");
  navItems.forEach(item => item.classList.remove("active"));
  
  // Activate selected panel and matching nav item
  if (viewName === "chat") {
    viewChat.classList.add("active");
    navChat.classList.add("active");
  } else if (viewName === "browse") {
    viewBrowse.classList.add("active");
    if (activeBrowseSection) {
      const activeNav = document.getElementById(`nav-${activeBrowseSection}`);
      if (activeNav) activeNav.classList.add("active");
    }
  } else if (viewName === "admin") {
    viewAdmin.classList.add("active");
    btnToggleAdmin.classList.add("active");
    renderAdminView();
  }
}

// Render the corporate section browser
function renderBrowseView(sectionKey) {
  const section = kbData[sectionKey];
  if (!section) return;
  
  browseSectionTitle.innerText = section.title;
  browseSectionDesc.innerText = section.description;
  articlesGrid.innerHTML = "";
  
  if (!section.articles || section.articles.length === 0) {
    articlesGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path></svg>
        <h3>No Articles Found</h3>
        <p>This corporate section is empty. Go to the Admin Portal to add articles.</p>
      </div>
    `;
    return;
  }
  
  section.articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "article-card";
    
    let tagsHtml = "";
    if (article.keywords && article.keywords.length > 0) {
      tagsHtml = `<div class="keyword-tags">` + 
        article.keywords.map(k => `<span class="keyword-tag">${escapeHtml(k)}</span>`).join('') + 
        `</div>`;
    }
    
    card.innerHTML = `
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(article.content)}</p>
      ${tagsHtml}
      <div class="article-card-footer">
        <span>Updated: ${article.lastUpdated || 'N/A'}</span>
        <span>ID: ${article.id}</span>
      </div>
    `;
    
    articlesGrid.appendChild(card);
  });
}

// Render Admin Portal dashboard
function renderAdminView() {
  if (adminArticlesContainer) adminArticlesContainer.innerHTML = "";
  
  // Fill Section selection in the form
  formArticleSection.innerHTML = '<option value="" disabled selected>Select Section</option>';
  Object.keys(kbData).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = kbData[key].title;
    formArticleSection.appendChild(option);
  });
  
  let hasArticles = false;
  
  Object.keys(kbData).forEach(sectionKey => {
    const section = kbData[sectionKey];
    if (!section.articles || section.articles.length === 0) return;
    
    hasArticles = true;
    
    const header = document.createElement("div");
    header.className = "admin-section-header";
    header.innerHTML = `
      <h4>${escapeHtml(section.title)}</h4>
      <span class="badge-sec">${section.articles.length}</span>
    `;
    if (adminArticlesContainer) adminArticlesContainer.appendChild(header);
    
    const list = document.createElement("div");
    list.className = "admin-list";
    
    section.articles.forEach(article => {
      const item = document.createElement("div");
      item.className = "admin-list-item";
      item.innerHTML = `
        <div class="admin-item-info">
          <span class="admin-item-title">${escapeHtml(article.title)}</span>
          <span class="admin-item-subtitle">ID: ${article.id} • Updated: ${article.lastUpdated}</span>
        </div>
        <div class="admin-item-actions">
          <button class="btn-icon btn-icon-edit" title="Edit Article" data-section="${sectionKey}" data-id="${article.id}">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 17.513a4.5 4.5 0 01-1.897 1.13L3 19l.358-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>
          </button>
          <button class="btn-icon btn-icon-delete" title="Delete Article" data-section="${sectionKey}" data-id="${article.id}">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `;
      
      // Bind Edit Button
      item.querySelector(".btn-icon-edit").addEventListener("click", (e) => {
        const target = e.currentTarget;
        openEditForm(target.getAttribute("data-section"), target.getAttribute("data-id"));
      });
      
      // Bind Delete Button
      item.querySelector(".btn-icon-delete").addEventListener("click", (e) => {
        const target = e.currentTarget;
        deleteArticle(target.getAttribute("data-section"), target.getAttribute("data-id"));
      });
      
      list.appendChild(item);
    });
    
    if (adminArticlesContainer) adminArticlesContainer.appendChild(list);
  });
  
  if (!hasArticles && adminArticlesContainer) {
    adminArticlesContainer.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>
        <p>No corporate articles loaded. Add one to start.</p>
      </div>
    `;
  }
}

// Open form for editing
function openEditForm(sectionKey, articleId) {
  const article = kbData[sectionKey].articles.find(a => a.id === articleId);
  if (!article) return;
  
  formArticleId.value = article.id;
  formArticleSection.value = sectionKey;
  formArticleSection.disabled = true; // Section cannot be changed once created
  formArticleTitle.value = article.title;
  formArticleKeywords.value = article.keywords ? article.keywords.join(", ") : "";
  formArticleContent.value = article.content;
  
  adminFormEmpty.style.display = "none";
  adminArticleForm.style.display = "block";
  formArticleTitle.focus();
}

// Open form for creating a new article
function openCreateForm() {
  formArticleId.value = "";
  formArticleSection.value = "";
  formArticleSection.disabled = false;
  formArticleTitle.value = "";
  formArticleKeywords.value = "";
  formArticleContent.value = "";
  
  adminFormEmpty.style.display = "none";
  adminArticleForm.style.display = "block";
  formArticleSection.focus();
}

// Handle article deletion
function deleteArticle(sectionKey, articleId) {
  const article = kbData[sectionKey].articles.find(a => a.id === articleId);
  if (!article) return;
  
  if (confirm(`Are you sure you want to delete the article: "${article.title}"?`)) {
    kbData = KnowledgeBase.deleteArticle(sectionKey, articleId);
    
    // If the deleted article was currently being edited, close the form
    if (formArticleId.value === articleId) {
      closeAdminForm();
    }
    
    renderSidebar();
    renderAdminView();
    showToast("Article deleted successfully");
  }
}

// Close Admin Form and show Empty State
function closeAdminForm() {
  adminArticleForm.style.display = "none";
  adminFormEmpty.style.display = "flex";
  formArticleId.value = "";
}

let isAdminAuthenticated = false;

function authenticateAdmin(actionCallback) {
  if (isAdminAuthenticated) {
    actionCallback();
    return;
  }
  
  const code = prompt("Enter Admin Passcode to authorize this action:");
  if (code === "DBAdmin2026") {
    isAdminAuthenticated = true;
    showToast("Access Granted");
    actionCallback();
  } else if (code !== null) {
    alert("Access Denied: Invalid passcode.");
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Navigation
  if (navChat) {
    navChat.addEventListener("click", () => {
      if (activeChatId) {
        loadChatSession(activeChatId);
      } else {
        startNewChat();
      }
    });
  }
  
  if (btnToggleAdmin) {
    btnToggleAdmin.addEventListener("click", () => {
      authenticateAdmin(() => {
        switchView("admin");
      });
    });
  }
  
  if (btnNewChat) {
    btnNewChat.addEventListener("click", startNewChat);
  }
  
  // Database Reset
  if (btnResetDb) {
    btnResetDb.addEventListener("click", () => {
      authenticateAdmin(() => {
        if (confirm("This will clear all changes, delete conversation history, and restore the default Amberleigh Private Bank corporate data. Continue?")) {
          kbData = KnowledgeBase.reset();
          ConversationHistory.clearAll();
          activeChatId = null;
          activeBrowseSection = null;
          renderSidebar();
          renderRecentChats();
          startNewChat();
          if (activeView === "admin") {
            renderAdminView();
            closeAdminForm();
          }
          showToast("Database and history restored to defaults");
        }
      });
    });
  }
  
  // Admin Form triggers
  if (btnAdminCreateNew) {
    btnAdminCreateNew.addEventListener("click", openCreateForm);
  }
  if (btnFormCancel) {
    btnFormCancel.addEventListener("click", closeAdminForm);
  }
  
  if (adminArticleForm) {
    adminArticleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const sectionKey = formArticleSection.value;
      const articleId = formArticleId.value || `art-${Date.now()}`;
      const keywords = formArticleKeywords.value
        .split(",")
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0);
        
      const article = {
        id: articleId,
        title: formArticleTitle.value.trim(),
        keywords: keywords,
        content: formArticleContent.value.trim()
      };
      
      kbData = KnowledgeBase.saveArticle(sectionKey, article);
      
      // Reset views
      renderSidebar();
      renderAdminView();
      closeAdminForm();
      showToast("Article saved successfully");
    });
  }

  // Gemini Key triggers
  if (btnSaveGeminiKey) {
    btnSaveGeminiKey.addEventListener("click", () => {
      const key = inputGeminiKey.value.trim();
      if (!key) {
        alert("Please enter a valid API key.");
        return;
      }
      try {
        localStorage.setItem(GEMINI_KEY_STORAGE, key);
        geminiApiKey = key;
        showToast("Gemini API Key saved!");
        initGeminiKey();
      } catch (e) {
        // Fallback in case localStorage is blocked
        geminiApiKey = key;
        showToast("Key saved in-memory (expires on refresh)");
        if (keyStatusText) keyStatusText.innerText = "Status: Active (Memory)";
        if (btnClearGeminiKey) btnClearGeminiKey.style.display = "inline-block";
      }
    });
  }
  
  if (btnClearGeminiKey) {
    btnClearGeminiKey.addEventListener("click", () => {
      try {
        localStorage.removeItem(GEMINI_KEY_STORAGE);
      } catch (e) {}
      geminiApiKey = null;
      showToast("Gemini API Key removed.");
      initGeminiKey();
    });
  }
  
  // Ask Assistant Button from Browse View
  btnBrowseAskAssistant.addEventListener("click", () => {
    if (activeBrowseSection) {
      const sectionName = kbData[activeBrowseSection].title;
      chatUserInput.value = `Tell me about ${sectionName}`;
      switchView("chat");
      handleChatSubmit();
    }
  });
  
  // Quick Chat Suggestion cards
  document.querySelectorAll(".suggestion-card").forEach(card => {
    card.addEventListener("click", () => {
      const query = card.getAttribute("data-query");
      chatUserInput.value = query;
      handleChatSubmit();
    });
  });
  
  // Main Chat Form submission
  chatInputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleChatSubmit();
  });
}

// Handle Chat Message Submissions
function handleChatSubmit() {
  const query = chatUserInput.value.trim();
  if (!query) return;
  
  // Hide initial welcome message if first message
  if (chatWelcome) {
    chatWelcome.style.display = "none";
  }
  
  // If no active chat session, generate a new ID
  const isFirstMessage = !activeChatId;
  if (isFirstMessage) {
    activeChatId = `chat-${Date.now()}`;
  }
  
  // Save user query to history
  ConversationHistory.addMessage(activeChatId, "user", query);
  
  // If it was the first message, refresh sidebar to show the new chat item
  if (isFirstMessage) {
    renderRecentChats();
  }
  
  // Append User message to UI
  appendMessage("user", query);
  chatUserInput.value = "";
  
  // Scroll to bottom
  chatHistory.scrollTop = chatHistory.scrollHeight;
  
  // 1. If Gemini API Key is available: async network call
  if (geminiApiKey) {
    const typingId = showTypingIndicator();
    
    (async () => {
      try {
        const localMatch = searchKnowledgeBase(query);
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
            appendMessage("bot", localGeneric.message, null, localGeneric.options);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            return;
          }
          
          const systemInstruction = "Instruction: You are the Amberleigh Private Bank Virtual Concierge and smart assistant. If the user's question is about Amberleigh Private Bank (policies, onboarding, expenses, HR), answer it professionally using bank standards. If the user's question is a general or universal question (such as general knowledge, coding, writing help, calculations, or translation), act as a helpful universal assistant like ChatGPT and answer it thoroughly, accurately, and politely in clear paragraph form. Keep your tone professional, intelligent, and supportive.";
          promptText = `${systemInstruction}\n\nUser Question: ${query}`;
        }
        
        const aiAnswer = await callGeminiAPI(promptText);
        
        removeTypingIndicator(typingId);
        ConversationHistory.addMessage(activeChatId, "bot", aiAnswer, sourceToCite);
        appendMessage("bot", aiAnswer, sourceToCite);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
      } catch (err) {
        console.error("Gemini API Error. Falling back to local static search:", err);
        removeTypingIndicator(typingId);
        runLocalSearchFallback(query);
      }
    })();
    return;
  }
  
  // 2. If Gemini is NOT active: process locally and print INSTANTLY (0ms delay)
  runLocalSearchFallback(query);
}

// Separate helper for local search to avoid duplicate code
function runLocalSearchFallback(query) {
  const genericResponse = getGenericResponse(query);
  if (genericResponse) {
    ConversationHistory.addMessage(activeChatId, "bot", genericResponse.message, null, genericResponse.options);
    appendMessage("bot", genericResponse.message, null, genericResponse.options);
  } else {
    const result = searchKnowledgeBase(query);
    if (result) {
      const formattedParagraph = `According to Amberleigh Private Bank official policy regarding ${result.source.articleTitle}:\n\n${result.content}\n\nIf you have additional questions or require further assistance, please consult the Policy Hub or contact the Ask HR Service Desk.`;
      ConversationHistory.addMessage(activeChatId, "bot", formattedParagraph, result.source);
      appendMessage("bot", formattedParagraph, result.source);
    } else {
      const suggestions = generateSearchFallbackSuggestions(query);
      ConversationHistory.addMessage(activeChatId, "bot", suggestions.message, null, suggestions.options);
      appendMessage("bot", suggestions.message, null, suggestions.options);
    }
  }
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Fetch helper for Google Gemini API (v1beta stable endpoint with timeout)
async function callGeminiAPI(promptText) {
  if (!geminiApiKey) {
    throw new Error("Gemini API Key is missing.");
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/${activeGeminiModel}:generateContent?key=${geminiApiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second request timeout
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to contact Gemini API");
    }
    
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      throw new Error("No answer generated by Gemini.");
    }
    
    return answer.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Connection timed out (Google API took too long to respond).");
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
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
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
      // Short words require exact matches to avoid false positives (e.g. 'db' matching 'do')
      return w === targetWord;
    }
    const dist = getLevenshteinDistance(w, targetWord);
    return dist <= maxDistance;
  });
}

// Intercept generic queries before searching corporate database
function getGenericResponse(query) {
  const queryLower = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  // Helpers for common terms (typo tolerant)
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

// Client-side local search engine
function searchKnowledgeBase(query) {
  // Normalize and clean user tokens
  const cleanTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(token => token.length > 0 && !STOP_WORDS.has(token));
    
  if (cleanTokens.length === 0) return null;
  
  let bestMatch = null;
  let highestScore = 0;
  
  // Search through sections
  Object.keys(kbData).forEach(sectionKey => {
    const section = kbData[sectionKey];
    if (!section.articles) return;
    
    section.articles.forEach(article => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const contentLower = article.content.toLowerCase();
      const titleWords = titleLower.split(/\s+/);
      const contentWords = contentLower.split(/\s+/);
      
      // Calculate token match scores
      cleanTokens.forEach(token => {
        const isShort = token.length < 4;
        
        // Title Match
        if (isShort ? titleWords.includes(token) : titleLower.includes(token)) {
          score += 15;
        }
        
        // Keyword tags match: High points
        if (article.keywords && article.keywords.some(kw => isShort ? kw === token : kw.includes(token))) {
          score += 20;
        }
        
        // Content Match
        if (isShort ? contentWords.includes(token) : contentLower.includes(token)) {
          score += 5;
        }
      });
      
      // Phrase matches: Big bonus
      const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '');
      if (titleLower.includes(cleanQuery)) score += 40;
      if (contentLower.includes(cleanQuery)) score += 30;
      
      if (score > highestScore && score >= 5) {
        highestScore = score;
        bestMatch = {
          content: article.content,
          source: {
            sectionKey: sectionKey,
            sectionTitle: section.title,
            articleTitle: article.title
          }
        };
      }
    });
  });
  
  return bestMatch;
}

// Generate smart fallbacks when no direct article matches
function generateSearchFallbackSuggestions(query) {
  const queryLower = query.toLowerCase();
  let suggestions = [];
  
  // Look for section matches
  Object.keys(kbData).forEach(sectionKey => {
    const section = kbData[sectionKey];
    if (queryLower.includes(sectionKey.replace('_', ' ')) || queryLower.includes(section.title.toLowerCase())) {
      suggestions.push({
        text: `Browse the ${section.title} section`,
        action: () => {
          activeBrowseSection = sectionKey;
          switchView("browse");
          renderBrowseView(sectionKey);
        }
      });
    }
  });
  
  // Offer general search triggers
  if (suggestions.length === 0) {
    // Pick 3 random articles as suggestions
    const allArticles = [];
    Object.keys(kbData).forEach(sKey => {
      if (kbData[sKey].articles) {
        kbData[sKey].articles.forEach(a => {
          allArticles.push({ title: a.title, query: a.title });
        });
      }
    });
    
    // Shuffle and pick 3
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

// Append message bubbles to chat history
function appendMessage(sender, text, source = null, options = null) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;
  
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  
  // Render content
  const contentElement = document.createElement("div");
  contentElement.className = "message-content";
  bubble.appendChild(contentElement);
  
  // Render source citation
  if (source && sender === "bot") {
    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.innerHTML = `<span>Source:</span>`;
    
    const sourceLink = document.createElement("a");
    sourceLink.className = "message-source";
    sourceLink.href = "#";
    sourceLink.innerText = `${source.sectionTitle} > ${source.articleTitle}`;
    sourceLink.addEventListener("click", (e) => {
      e.preventDefault();
      activeBrowseSection = source.sectionKey;
      switchView("browse");
      renderBrowseView(source.sectionKey);
    });
    
    meta.appendChild(sourceLink);
    bubble.appendChild(meta);
  }
  
  // Render options/chips if available
  if (options && options.length > 0) {
    const optionsContainer = document.createElement("div");
    optionsContainer.style.display = "flex";
    optionsContainer.style.flexWrap = "wrap";
    optionsContainer.style.gap = "8px";
    optionsContainer.style.marginTop = "12px";
    
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "suggestion-card";
      chip.style.padding = "8px 14px";
      chip.style.borderRadius = "4px";
      chip.style.fontSize = "0.85rem";
      chip.innerText = opt.text;
      
      chip.addEventListener("click", () => {
        if (opt.query) {
          chatUserInput.value = opt.query;
          handleChatSubmit();
        } else if (opt.action) {
          opt.action();
        }
      });
      optionsContainer.appendChild(chip);
    });
    
    bubble.appendChild(optionsContainer);
  }
  
  row.appendChild(bubble);
  chatHistory.appendChild(row);
  
  // Bot responses are printed instantly for maximum responsiveness and snappiness
  contentElement.innerHTML = formatMarkdown(text);
}

// Full ChatGPT-style Markdown parser with complete asterisk removal & rich HTML formatting
function formatMarkdown(text) {
  if (!text) return "";

  let str = text.trim();

  // 1. Convert multiline/single line double asterisks **text** to <strong>text</strong>
  str = str.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
  str = str.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');

  // 2. Convert single asterisk *text* to <em>text</em>
  str = str.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
  str = str.replace(/_([^_\n]+?)_/g, '<em>$1</em>');

  // 3. Headings: ### Title, ## Title, # Title
  str = str.replace(/^### (.*$)/gim, '<h4 style="margin: 12px 0 6px 0; color: #60a5fa; font-size: 1rem; font-weight: 600;">$1</h4>');
  str = str.replace(/^## (.*$)/gim, '<h3 style="margin: 14px 0 6px 0; color: #60a5fa; font-size: 1.1rem; font-weight: 600;">$1</h3>');
  str = str.replace(/^# (.*$)/gim, '<h2 style="margin: 16px 0 8px 0; color: #60a5fa; font-size: 1.2rem; font-weight: 600;">$1</h2>');

  // 4. Parse Bullet Lists (lines starting with *, -, or •)
  const lines = str.split('\n');
  let inList = false;
  let resultLines = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^[\*\-\•]\s+(.*)/.test(trimmed)) {
      const itemText = trimmed.replace(/^[\*\-\•]\s+/, '');
      if (!inList) {
        inList = true;
        resultLines.push('<ul style="margin: 6px 0 8px 18px; padding: 0; list-style-type: disc;">');
      }
      resultLines.push(`<li style="margin-bottom: 4px;">${itemText}</li>`);
    } else {
      if (inList) {
        inList = false;
        resultLines.push('</ul>');
      }
      resultLines.push(line);
    }
  });

  if (inList) {
    resultLines.push('</ul>');
  }

  str = resultLines.join('\n');

  // 5. Parse Numbered Lists (1. 2. 3.)
  str = str.replace(/^\d+\.\s+(.*$)/gim, '<div style="margin: 4px 0 4px 12px; display: flex; gap: 8px;"><span style="color: #60a5fa; font-weight: 600;">•</span><span>$1</span></div>');

  // 6. Absolute Guarantee: Strip ANY remaining raw asterisks anywhere in the text!
  str = str.replace(/\*/g, '');

  // 7. Convert double newlines to paragraph spacing, single newlines to <br>
  str = str.replace(/\n\n/g, '<br><br>');
  str = str.replace(/(?<!<\/ul>|<\/li>|<\/h2>|<\/h3>|<\/h4>)\n/g, '<br>');

  return str;
}

// Simulates typing effect for a premium feel
function typeMessage(element, text) {
  let index = 0;
  const speed = 2; // ms per character
  
  element.textContent = "";
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      chatHistory.scrollTop = chatHistory.scrollHeight;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Show Typing Indicator bubble
function showTypingIndicator() {
  const indicatorId = `typing-${Date.now()}`;
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.id = indicatorId;
  
  row.innerHTML = `
    <div class="message-bubble">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  
  chatHistory.appendChild(row);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  return indicatorId;
}

// Remove Typing Indicator bubble
function removeTypingIndicator(id) {
  const indicator = document.getElementById(id);
  if (indicator) {
    indicator.remove();
  }
}

// Toast Notification system
function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.style.position = "absolute";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = isError ? "#ef4444" : "#ffffff";
  toast.style.color = isError ? "#ffffff" : "#000000";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "4px";
  toast.style.fontSize = "0.9rem";
  toast.style.fontWeight = "600";
  toast.style.border = isError ? "1px solid #ef4444" : "1px solid rgba(0, 0, 0, 0.15)";
  toast.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.4)";
  toast.style.zIndex = "1000";
  toast.style.animation = "fadeIn 0.2s ease, fadeOut 0.2s ease 2.8s";
  
  toast.innerText = message;
  
  document.querySelector(".app-container").appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Helper to escape HTML to prevent XSS in client-rendered fields
function escapeHtml(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(string).replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Start the application when DOM is ready
document.addEventListener("DOMContentLoaded", init);
