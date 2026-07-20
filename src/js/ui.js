// User Interface Rendering, Navigation, and Event Handlers Module
import { ICONS, ADMIN_PASSCODE } from './config.js';
import { formatMarkdown } from './parser.js';
import { ConversationHistory, geminiApiKey, setGeminiApiKey } from './chat.js';
import { KnowledgeBase } from './database.js';

// DOM Element References (cached on module load)
export const elements = {
  // Navigation
  navChat: document.getElementById("nav-chat"),
  btnToggleAdmin: document.getElementById("btn-toggle-admin"),
  dynamicNavSections: document.getElementById("dynamic-nav-sections"),
  recentChatsHeader: document.getElementById("recent-chats-header"),
  recentChatsList: document.getElementById("recent-chats-list"),
  btnNewChat: document.getElementById("btn-new-chat"),
  
  // Views
  viewChat: document.getElementById("view-chat"),
  viewBrowse: document.getElementById("view-browse"),
  viewAdmin: document.getElementById("view-admin"),
  
  // Chat Interface
  chatHistory: document.getElementById("chat-history"),
  chatUserInput: document.getElementById("chat-user-input"),
  btnSendChat: document.getElementById("btn-send-chat"),
  chatWelcome: document.getElementById("chat-welcome"),
  
  // Browse View
  browseSectionTitle: document.getElementById("browse-section-title"),
  browseSectionDesc: document.getElementById("browse-section-desc"),
  articlesGrid: document.getElementById("articles-grid"),
  btnBrowseAskAssistant: document.getElementById("btn-browse-ask-assistant"),
  
  // Admin View
  btnAdminCreateNew: document.getElementById("btn-admin-create-new"),
  adminFormPane: document.getElementById("admin-form-pane"),
  adminFormEmpty: document.getElementById("admin-form-empty"),
  adminArticleForm: document.getElementById("admin-article-form"),
  btnFormCancel: document.getElementById("btn-form-cancel"),
  adminArticlesContainer: document.getElementById("admin-articles-container"),
  
  // Form Inputs
  formArticleId: document.getElementById("form-article-id"),
  formArticleSection: document.getElementById("form-article-section"),
  formArticleTitle: document.getElementById("form-article-title"),
  formArticleKeywords: document.getElementById("form-article-keywords"),
  formArticleContent: document.getElementById("form-article-content"),
  
  // Settings Panel
  inputGeminiKey: document.getElementById("input-gemini-key"),
  keyStatusText: document.getElementById("key-status-text"),
  btnSaveGeminiKey: document.getElementById("btn-save-gemini-key"),
  btnClearGeminiKey: document.getElementById("btn-clear-gemini-key")
};

// State trackers managed within UI layer
export let activeView = "chat";
export let activeBrowseSection = null;
export let activeChatId = null;
export let isAdminAuthenticated = false;

// Helper to update active view
export function setActiveView(view) {
  activeView = view;
}

// Helper to update active chat session ID
export function setActiveChatId(chatId) {
  activeChatId = chatId;
}

// Helper to update active browse section
export function setActiveBrowseSection(sectionKey) {
  activeBrowseSection = sectionKey;
}

// Switch between panels (chat, browse, admin)
export function switchView(viewName, kbData) {
  activeView = viewName;
  
  const panels = [elements.viewChat, elements.viewBrowse, elements.viewAdmin];
  panels.forEach(p => {
    if (p) p.classList.remove("active");
  });
  
  if (elements.navChat) elements.navChat.classList.remove("active");
  if (elements.btnToggleAdmin) elements.btnToggleAdmin.classList.remove("active");
  
  if (elements.dynamicNavSections) {
    const navItems = elements.dynamicNavSections.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));
  }
  
  if (viewName === "chat") {
    if (elements.viewChat) elements.viewChat.classList.add("active");
    if (elements.navChat) elements.navChat.classList.add("active");
  } else if (viewName === "browse") {
    if (elements.viewBrowse) elements.viewBrowse.classList.add("active");
    if (activeBrowseSection) {
      const activeNav = document.getElementById(`nav-${activeBrowseSection}`);
      if (activeNav) activeNav.classList.add("active");
    }
  } else if (viewName === "admin") {
    if (elements.viewAdmin) elements.viewAdmin.classList.add("active");
    if (elements.btnToggleAdmin) elements.btnToggleAdmin.classList.add("active");
    renderAdminView(kbData);
  }
}

// Render Sidebar corporate navigation dynamically
export function renderSidebar(kbData) {
  if (!elements.dynamicNavSections) return;
  elements.dynamicNavSections.innerHTML = "";
  
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
      switchView("browse", kbData);
      renderBrowseView(kbData, key);
    });
    
    elements.dynamicNavSections.appendChild(navItem);
  });
}

// Render Recent Chats in the sidebar
export function renderRecentChats(onSelectSession, onDeleteSession) {
  if (!elements.recentChatsList) return;
  elements.recentChatsList.innerHTML = "";
  const chats = ConversationHistory.get();
  
  if (chats.length === 0) {
    if (elements.recentChatsHeader) elements.recentChatsHeader.style.display = "none";
    elements.recentChatsList.style.display = "none";
    return;
  }
  
  if (elements.recentChatsHeader) elements.recentChatsHeader.style.display = "flex";
  elements.recentChatsList.style.display = "flex";
  
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
      onSelectSession(chat.id);
    });
    
    item.querySelector('.btn-delete-chat').addEventListener("click", (e) => {
      e.stopPropagation();
      onDeleteSession(chat.id);
    });
    
    elements.recentChatsList.appendChild(item);
  });
}

// Start a fresh conversation
export function startNewChat(kbData) {
  activeChatId = null;
  
  const rows = elements.chatHistory.querySelectorAll(".message-row");
  rows.forEach(r => r.remove());
  
  if (elements.chatWelcome) {
    elements.chatWelcome.style.display = "flex";
  }
  
  switchView("chat", kbData);
  renderRecentChats(() => {}, () => {});
}

// Render the corporate section browser
export function renderBrowseView(kbData, sectionKey) {
  const section = kbData[sectionKey];
  if (!section) return;
  
  if (elements.browseSectionTitle) elements.browseSectionTitle.innerText = section.title;
  if (elements.browseSectionDesc) elements.browseSectionDesc.innerText = section.description;
  if (elements.articlesGrid) elements.articlesGrid.innerHTML = "";
  
  if (!section.articles || section.articles.length === 0) {
    if (elements.articlesGrid) {
      elements.articlesGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"></path></svg>
          <h3>No Articles Found</h3>
          <p>This corporate section is empty. Go to the Admin Portal to add articles.</p>
        </div>
      `;
    }
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
    
    if (elements.articlesGrid) elements.articlesGrid.appendChild(card);
  });
}

// Render Admin Portal dashboard
export function renderAdminView(kbData) {
  if (elements.adminArticlesContainer) elements.adminArticlesContainer.innerHTML = "";
  
  // Fill Section selection in the form
  if (elements.formArticleSection) {
    elements.formArticleSection.innerHTML = '<option value="" disabled selected>Select Section</option>';
    Object.keys(kbData).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.innerText = kbData[key].title;
      elements.formArticleSection.appendChild(option);
    });
  }
  
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
    if (elements.adminArticlesContainer) elements.adminArticlesContainer.appendChild(header);
    
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
      
      item.querySelector(".btn-icon-edit").addEventListener("click", (e) => {
        const target = e.currentTarget;
        authenticateAdmin(() => {
          openEditForm(kbData, target.getAttribute("data-section"), target.getAttribute("data-id"));
        });
      });
      
      item.querySelector(".btn-icon-delete").addEventListener("click", (e) => {
        const target = e.currentTarget;
        authenticateAdmin(() => {
          const sec = target.getAttribute("data-section");
          const artId = target.getAttribute("data-id");
          const art = kbData[sec].articles.find(a => a.id === artId);
          if (confirm(`Are you sure you want to delete the article: "${art.title}"?`)) {
            const updatedKb = KnowledgeBase.deleteArticle(sec, artId);
            Object.assign(kbData, updatedKb);
            if (elements.formArticleId.value === artId) {
              closeAdminForm();
            }
            renderSidebar(kbData);
            renderAdminView(kbData);
            showToast("Article deleted successfully");
          }
        });
      });
      
      list.appendChild(item);
    });
    
    if (elements.adminArticlesContainer) elements.adminArticlesContainer.appendChild(list);
  });
  
  if (!hasArticles && elements.adminArticlesContainer) {
    elements.adminArticlesContainer.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>
        <p>No corporate articles loaded. Add one to start.</p>
      </div>
    `;
  }
}

// Open form for editing
export function openEditForm(kbData, sectionKey, articleId) {
  const article = kbData[sectionKey].articles.find(a => a.id === articleId);
  if (!article) return;
  
  elements.formArticleId.value = article.id;
  elements.formArticleSection.value = sectionKey;
  elements.formArticleSection.disabled = true;
  elements.formArticleTitle.value = article.title;
  elements.formArticleKeywords.value = article.keywords ? article.keywords.join(", ") : "";
  elements.formArticleContent.value = article.content;
  
  if (elements.adminFormEmpty) elements.adminFormEmpty.style.display = "none";
  if (elements.adminArticleForm) elements.adminArticleForm.style.display = "block";
  if (elements.formArticleTitle) elements.formArticleTitle.focus();
}

// Open form for creating a new article
export function openCreateForm() {
  elements.formArticleId.value = "";
  elements.formArticleSection.value = "";
  elements.formArticleSection.disabled = false;
  elements.formArticleTitle.value = "";
  elements.formArticleKeywords.value = "";
  elements.formArticleContent.value = "";
  
  if (elements.adminFormEmpty) elements.adminFormEmpty.style.display = "none";
  if (elements.adminArticleForm) elements.adminArticleForm.style.display = "block";
  if (elements.formArticleSection) elements.formArticleSection.focus();
}

// Close Admin Form and show Empty State
export function closeAdminForm() {
  if (elements.adminArticleForm) elements.adminArticleForm.style.display = "none";
  if (elements.adminFormEmpty) elements.adminFormEmpty.style.display = "flex";
  elements.formArticleId.value = "";
}

// Request admin passcode authentication
export function authenticateAdmin(actionCallback) {
  if (isAdminAuthenticated) {
    actionCallback();
    return;
  }
  
  const code = prompt("Enter Admin Passcode to authorize this action:");
  if (code === ADMIN_PASSCODE) {
    isAdminAuthenticated = true;
    showToast("Access Granted");
    actionCallback();
  } else if (code !== null) {
    alert("Access Denied: Invalid passcode.");
  }
}

// Simulates typing effect for a premium feel
export function typeMessage(element, text) {
  let index = 0;
  const speed = 2;
  element.textContent = "";
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      if (elements.chatHistory) elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
      setTimeout(type, speed);
    }
  }
  type();
}

// Show Typing Indicator bubble
export function showTypingIndicator() {
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
  
  if (elements.chatHistory) {
    elements.chatHistory.appendChild(row);
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
  }
  return indicatorId;
}

// Remove Typing Indicator bubble
export function removeTypingIndicator(id) {
  const indicator = document.getElementById(id);
  if (indicator) {
    indicator.remove();
  }
}

// Toast Notification system
export function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.style.position = "absolute";
  toast.style.bottom = "24px";
  toast.style.right = "24px";
  toast.style.background = isError ? "#ef4444" : "#ffffff";
  toast.style.color = isError ? "#ffffff" : "#0f172a";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "4px";
  toast.style.fontSize = "0.9rem";
  toast.style.fontWeight = "600";
  toast.style.border = isError ? "1px solid #ef4444" : "1px solid rgba(15, 23, 42, 0.1)";
  toast.style.boxShadow = "0 8px 16px rgba(15, 23, 42, 0.08)";
  toast.style.zIndex = "1000";
  toast.style.animation = "fadeIn 0.2s ease, fadeOut 0.2s ease 2.8s";
  
  toast.innerText = message;
  
  const container = document.querySelector(".app-container");
  if (container) container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Escape HTML helper
export function escapeHtml(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(string).replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Append Chat Message HTML Instantly
export function appendMessageInstantly(sender, text, source = null, options = null, onChipClick = () => {}) {
  if (!elements.chatHistory) return;
  
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;
  
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = formatMarkdown(text);
  
  let metaText = sender === "user" ? "You" : "Amberleigh Assistant";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  
  if (source) {
    const sourceLink = document.createElement("a");
    sourceLink.href = "#";
    sourceLink.className = "message-source";
    sourceLink.innerHTML = `
      <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"></path></svg>
      ${source.sectionTitle} - ${source.articleTitle}
    `;
    sourceLink.addEventListener("click", (e) => {
      e.preventDefault();
      activeBrowseSection = source.sectionKey;
      switchView("browse", KnowledgeBase.get());
      renderBrowseView(KnowledgeBase.get(), source.sectionKey);
    });
    meta.appendChild(sourceLink);
  }
  
  const spanMeta = document.createElement("span");
  spanMeta.innerText = metaText;
  meta.appendChild(spanMeta);
  bubble.appendChild(meta);
  
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
        onChipClick(opt);
      });
      optionsContainer.appendChild(chip);
    });
    bubble.appendChild(optionsContainer);
  }
  
  row.appendChild(bubble);
  elements.chatHistory.appendChild(row);
}

// Append Chat Message HTML with typing effect
export function appendMessage(sender, text, source = null, options = null, onChipClick = () => {}) {
  if (!elements.chatHistory) return;
  
  if (sender === "user") {
    appendMessageInstantly(sender, text, source, options, onChipClick);
    return;
  }
  
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;
  
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  
  const textContainer = document.createElement("div");
  bubble.appendChild(textContainer);
  
  let metaText = "Amberleigh Assistant";
  const meta = document.createElement("div");
  meta.className = "message-meta";
  
  if (source) {
    const sourceLink = document.createElement("a");
    sourceLink.href = "#";
    sourceLink.className = "message-source";
    sourceLink.innerHTML = `
      <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"></path></svg>
      ${source.sectionTitle} - ${source.articleTitle}
    `;
    sourceLink.addEventListener("click", (e) => {
      e.preventDefault();
      activeBrowseSection = source.sectionKey;
      switchView("browse", KnowledgeBase.get());
      renderBrowseView(KnowledgeBase.get(), source.sectionKey);
    });
    meta.appendChild(sourceLink);
  }
  
  const spanMeta = document.createElement("span");
  spanMeta.innerText = metaText;
  meta.appendChild(spanMeta);
  bubble.appendChild(meta);
  
  row.appendChild(bubble);
  elements.chatHistory.appendChild(row);
  
  // Custom typewriter for bot answers
  let charIndex = 0;
  const speed = 2;
  const rawFormatted = formatMarkdown(text);
  
  textContainer.innerHTML = "";
  
  function typeHtml() {
    // Instead of character-by-character raw text typewriter (which breaks HTML tags mid-way),
    // we can immediately render the formatted markdown, or run a safe token-based type simulator.
    // For high visual fidelity, we instantly set innerHTML but slide/fade the container in, 
    // or run a rapid content typewriter! Since we want premium quality, setting innerHTML
    // directly and scrolling to bottom is standard, stable, and highly performant.
    textContainer.innerHTML = rawFormatted;
    
    // Add action chips once text is rendered
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
          onChipClick(opt);
        });
        optionsContainer.appendChild(chip);
      });
      bubble.appendChild(optionsContainer);
    }
    
    if (elements.chatHistory) elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
  }
  
  typeHtml();
}
