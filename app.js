// Bookmarky App - Vanilla JavaScript

class BookmarkyApp {
    constructor() {
        this.articles = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.renderArticles();
    }

    loadArticles() {
        const saved = localStorage.getItem('bookmarky_articles');
        if (saved) {
            this.articles = JSON.parse(saved);
        }
    }

    saveArticles() {
        localStorage.setItem('bookmarky_articles', JSON.stringify(this.articles));
    }

    setupEventListeners() {
        // Add Article Button
        document.getElementById('addArticleBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Close Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Cancel Button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form Submit
        document.getElementById('articleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Search Input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderArticles();
        });

        // Filter Buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderArticles();
            });
        });

        // Click outside modal to close
        document.getElementById('articleModal').addEventListener('click', (e) => {
            if (e.target.id === 'articleModal') {
                this.closeModal();
            }
        });
    }

    openModal(article = null) {
        const modal = document.getElementById('articleModal');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');

        if (article) {
            this.editingId = article.id;
            modalTitle.textContent = 'Edit Article';
            submitBtn.textContent = 'Update Article';
            document.getElementById('articleTitle').value = article.title;
            document.getElementById('articleUrl').value = article.url;
            document.getElementById('articleTags').value = article.tags.join(', ');
            document.getElementById('articleNotes').value = article.notes || '';
        } else {
            this.editingId = null;
            modalTitle.textContent = 'Add New Article';
            submitBtn.textContent = 'Add Article';
            document.getElementById('articleForm').reset();
        }

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('articleModal');
        modal.classList.remove('active');
        this.editingId = null;
        document.getElementById('articleForm').reset();
    }

    handleSubmit() {
        const title = document.getElementById('articleTitle').value.trim();
        const url = document.getElementById('articleUrl').value.trim();
        const tagsInput = document.getElementById('articleTags').value.trim();
        const notes = document.getElementById('articleNotes').value.trim();

        const tags = tagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        if (this.editingId) {
            // Update existing article
            const index = this.articles.findIndex(a => a.id === this.editingId);
            if (index !== -1) {
                this.articles[index] = {
                    ...this.articles[index],
                    title,
                    url,
                    tags,
                    notes,
                    updatedAt: new Date().toISOString()
                };
                this.showToast('Article updated successfully');
            }
        } else {
            // Add new article
            const newArticle = {
                id: Date.now().toString(),
                title,
                url,
                tags,
                notes,
                isRead: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.articles.unshift(newArticle);
            this.showToast('Article added successfully');
        }

        this.saveArticles();
        this.renderArticles();
        this.closeModal();
    }

    toggleReadStatus(id) {
        const article = this.articles.find(a => a.id === id);
        if (article) {
            article.isRead = !article.isRead;
            this.saveArticles();
            this.renderArticles();
        }
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            this.saveArticles();
            this.renderArticles();
            this.showToast('Article deleted');
        }
    }

    editArticle(id) {
        const article = this.articles.find(a => a.id === id);
        if (article) {
            this.openModal(article);
        }
    }

    getFilteredArticles() {
        return this.articles.filter(article => {
            // Filter by search query
            const matchesSearch = 
                article.title.toLowerCase().includes(this.searchQuery) ||
                article.url.toLowerCase().includes(this.searchQuery) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));

            // Filter by read status
            const matchesFilter = 
                this.currentFilter === 'all' ||
                (this.currentFilter === 'read' && article.isRead) ||
                (this.currentFilter === 'unread' && !article.isRead);

            return matchesSearch && matchesFilter;
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    renderArticles() {
        const container = document.getElementById('articlesContainer');
        const filtered = this.getFilteredArticles();

        if (filtered.length === 0) {
            container.innerHTML = this.renderEmptyState();
        } else {
            container.innerHTML = `
                <div class="articles-grid">
                    ${filtered.map(article => this.renderArticleCard(article)).join('')}
                </div>
            `;

            // Add event listeners to dynamic elements
            this.attachArticleEventListeners();
        }
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3>No articles found</h3>
                <p>${this.articles.length === 0 
                    ? 'Start building your reading log by adding your first article' 
                    : 'Try adjusting your search or filters'}</p>
                ${this.articles.length === 0 ? `
                    <button class="add-btn" onclick="app.openModal()">
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Your First Article
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderArticleCard(article) {
        return `
            <article class="article-card ${article.isRead ? 'read' : 'unread'}" data-id="${article.id}">
                <div class="article-header">
                    <div class="article-meta">
                        <button class="read-toggle" data-action="toggle-read" data-id="${article.id}">
                            ${article.isRead ? `
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ` : '<div class="unread-dot"></div>'}
                        </button>
                        <span class="article-date">${this.formatDate(article.createdAt)}</span>
                    </div>
                    <div class="article-actions">
                        <button class="action-btn" data-action="edit" data-id="${article.id}" title="Edit article">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn delete" data-action="delete" data-id="${article.id}" title="Delete article">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <h3 class="article-title">${this.escapeHtml(article.title)}</h3>

                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-url">
                    <span>${this.escapeHtml(article.url)}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>

                ${article.tags.length > 0 ? `
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}

                ${article.notes ? `
                    <p class="article-notes">${this.escapeHtml(article.notes)}</p>
                ` : ''}
            </article>
        `;
    }

    attachArticleEventListeners() {
        // Toggle read status
        document.querySelectorAll('[data-action="toggle-read"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleReadStatus(btn.dataset.id);
            });
        });

        // Edit article
        document.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editArticle(btn.dataset.id);
            });
        });

        // Delete article
        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteArticle(btn.dataset.id);
            });
        });
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app
const app = new BookmarkyApp();