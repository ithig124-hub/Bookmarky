"// Bookmarky App - Enhanced with Organization Features

class BookmarkyApp {
    constructor() {
        this.articles = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.selectedTag = null;
        this.sortBy = 'newest';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadArticles();
        this.migrateArticles(); // Add missing properties to old articles
        this.setupEventListeners();
        this.updateStats();
        this.renderTagCloud();
        this.renderArticles();
    }

    // Migrate old articles to add new properties
    migrateArticles() {
        let updated = false;
        this.articles = this.articles.map(article => {
            if (article.isFavorite === undefined) {
                article.isFavorite = false;
                updated = true;
            }
            return article;
        });
        if (updated) {
            this.saveArticles();
        }
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

        // Close Modals
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Menu
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.openMenuModal();
        });

        document.getElementById('closeMenuModal').addEventListener('click', () => {
            this.closeMenuModal();
        });

        // Menu Options
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });

        document.getElementById('importFileInput').addEventListener('change', (e) => {
            this.importData(e);
        });

        document.getElementById('clearReadBtn').addEventListener('click', () => {
            this.clearReadArticles();
        });

        document.getElementById('bookmarkletBtn').addEventListener('click', () => {
            this.closeMenuModal();
            this.openBookmarkletModal();
        });

        document.getElementById('closeBookmarkletModal').addEventListener('click', () => {
            this.closeBookmarkletModal();
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

        // Sort Select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
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

        // Click outside modals to close
        ['articleModal', 'menuModal', 'bookmarkletModal'].forEach(modalId => {
            document.getElementById(modalId).addEventListener('click', (e) => {
                if (e.target.id === modalId) {
                    document.getElementById(modalId).classList.remove('active');
                }
            });
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

    openMenuModal() {
        document.getElementById('menuModal').classList.add('active');
    }

    closeMenuModal() {
        document.getElementById('menuModal').classList.remove('active');
    }

    openBookmarkletModal() {
        document.getElementById('bookmarkletModal').classList.add('active');
    }

    closeBookmarkletModal() {
        document.getElementById('bookmarkletModal').classList.remove('active');
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

        // Check for duplicate URL
        if (!this.editingId) {
            const duplicate = this.articles.find(a => a.url === url);
            if (duplicate) {
                if (!confirm(`This URL is already saved as \"${duplicate.title}\". Add anyway?`)) {
                    return;
                }
            }
        }

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
                isFavorite: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.articles.unshift(newArticle);
            this.showToast('Article added successfully');
        }

        this.saveArticles();
        this.updateStats();
        this.renderTagCloud();
        this.renderArticles();
        this.closeModal();
    }

    toggleReadStatus(id) {
        const article = this.articles.find(a => a.id === id);
        if (article) {
            article.isRead = !article.isRead;
            this.saveArticles();
            this.updateStats();
            this.renderArticles();
        }
    }

    toggleFavorite(id) {
        const article = this.articles.find(a => a.id === id);
        if (article) {
            article.isFavorite = !article.isFavorite;
            this.saveArticles();
            this.renderArticles();
            this.showToast(article.isFavorite ? 'Added to favorites' : 'Removed from favorites');
        }
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            this.saveArticles();
            this.updateStats();
            this.renderTagCloud();
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

    clearReadArticles() {
        const readCount = this.articles.filter(a => a.isRead).length;
        if (readCount === 0) {
            this.showToast('No read articles to clear');
            return;
        }

        if (confirm(`Delete all ${readCount} read articles? This cannot be undone.`)) {
            this.articles = this.articles.filter(a => !a.isRead);
            this.saveArticles();
            this.updateStats();
            this.renderTagCloud();
            this.renderArticles();
            this.closeMenuModal();
            this.showToast(`Cleared ${readCount} read articles`);
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.articles, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookmarky-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.closeMenuModal();
        this.showToast('Data exported successfully');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedArticles = JSON.parse(e.target.result);
                if (!Array.isArray(importedArticles)) {
                    throw new Error('Invalid file format');
                }

                // Merge with existing articles, avoiding duplicates
                let addedCount = 0;
                importedArticles.forEach(article => {
                    const exists = this.articles.find(a => a.url === article.url);
                    if (!exists) {
                        // Ensure all required properties exist
                        this.articles.push({
                            ...article,
                            isFavorite: article.isFavorite || false
                        });
                        addedCount++;
                    }
                });

                this.saveArticles();
                this.updateStats();
                this.renderTagCloud();
                this.renderArticles();
                this.closeMenuModal();
                this.showToast(`Imported ${addedCount} new articles`);
            } catch (error) {
                this.showToast('Error importing file. Please check the format.');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    // Statistics
    updateStats() {
        const total = this.articles.length;
        const read = this.articles.filter(a => a.isRead).length;
        const unread = total - read;
        const progress = total > 0 ? Math.round((read / total) * 100) : 0;

        document.getElementById('statTotal').textContent = total;
        document.getElementById('statRead').textContent = read;
        document.getElementById('statUnread').textContent = unread;
        document.getElementById('statProgress').textContent = `${progress}%`;
    }

    // Tag Cloud
    renderTagCloud() {
        const tagCloud = document.getElementById('tagCloudContainer');
        const tagCounts = {};

        // Count tags
        this.articles.forEach(article => {
            article.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        // Sort by count
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Show top 10 tags

        if (sortedTags.length === 0) {
            tagCloud.innerHTML = '';
            return;
        }

        tagCloud.innerHTML = sortedTags.map(([tag, count]) => `
            <button class=\"tag-cloud-item ${this.selectedTag === tag ? 'active' : ''}\" 
                    data-tag=\"${this.escapeHtml(tag)}\">
                ${this.escapeHtml(tag)}
                <span class=\"tag-count\">${count}</span>
            </button>
        `).join('');

        // Add click handlers
        tagCloud.querySelectorAll('.tag-cloud-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.dataset.tag;
                if (this.selectedTag === tag) {
                    this.selectedTag = null;
                    btn.classList.remove('active');
                } else {
                    tagCloud.querySelectorAll('.tag-cloud-item').forEach(b => b.classList.remove('active'));
                    this.selectedTag = tag;
                    btn.classList.add('active');
                }
                this.renderArticles();
            });
        });
    }

    // Filtering and Sorting
    getFilteredArticles() {
        let filtered = this.articles.filter(article => {
            // Filter by search query
            const matchesSearch = 
                article.title.toLowerCase().includes(this.searchQuery) ||
                article.url.toLowerCase().includes(this.searchQuery) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));

            // Filter by read status
            let matchesFilter = true;
            if (this.currentFilter === 'read') {
                matchesFilter = article.isRead;
            } else if (this.currentFilter === 'unread') {
                matchesFilter = !article.isRead;
            } else if (this.currentFilter === 'favorites') {
                matchesFilter = article.isFavorite;
            }

            // Filter by selected tag
            const matchesTag = !this.selectedTag || article.tags.includes(this.selectedTag);

            return matchesSearch && matchesFilter && matchesTag;
        });

        // Sort articles
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });

        return filtered;
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
                <div class=\"articles-grid\">
                    ${filtered.map(article => this.renderArticleCard(article)).join('')}
                </div>
            `;

            // Add event listeners to dynamic elements
            this.attachArticleEventListeners();
        }
    }

    renderEmptyState() {
        return `
            <div class=\"empty-state\">
                <svg class=\"empty-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                    <path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"></path>
                </svg>
                <h3>No articles found</h3>
                <p>${this.articles.length === 0 
                    ? 'Start building your reading log by adding your first article' 
                    : 'Try adjusting your search or filters'}</p>
                ${this.articles.length === 0 ? `
                    <button class=\"add-btn\" onclick=\"app.openModal()\">
                        <svg class=\"btn-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                            <line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line>
                            <line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>
                        </svg>
                        Add Your First Article
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderArticleCard(article) {
        return `
            <article class=\"article-card ${article.isRead ? 'read' : 'unread'} ${article.isFavorite ? 'favorite' : ''}\" data-id=\"${article.id}\">
                <div class=\"article-header\">
                    <div class=\"article-meta\">
                        <button class=\"read-toggle\" data-action=\"toggle-read\" data-id=\"${article.id}\">
                            ${article.isRead ? `
                                <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                                    <polyline points=\"20 6 9 17 4 12\"></polyline>
                                </svg>
                            ` : '<div class=\"unread-dot\"></div>'}
                        </button>
                        <span class=\"article-date\">${this.formatDate(article.createdAt)}</span>
                    </div>
                    <div class=\"article-actions\">
                        <button class=\"action-btn favorite ${article.isFavorite ? 'active' : ''}\" 
                                data-action=\"favorite\" data-id=\"${article.id}\" 
                                title=\"${article.isFavorite ? 'Remove from favorites' : 'Add to favorites'}\">
                            <svg viewBox=\"0 0 24 24\" fill=\"${article.isFavorite ? 'currentColor' : 'none'}\" stroke=\"currentColor\" stroke-width=\"2\">
                                <polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon>
                            </svg>
                        </button>
                        <button class=\"action-btn\" data-action=\"edit\" data-id=\"${article.id}\" title=\"Edit article\">
                            <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                                <path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path>
                                <path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path>
                            </svg>
                        </button>
                        <button class=\"action-btn delete\" data-action=\"delete\" data-id=\"${article.id}\" title=\"Delete article\">
                            <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                                <polyline points=\"3 6 5 6 21 6\"></polyline>
                                <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <h3 class=\"article-title\">${this.escapeHtml(article.title)}</h3>

                <a href=\"${article.url}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"article-url\">
                    <span>${this.escapeHtml(article.url)}</span>
                    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">
                        <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>
                        <polyline points=\"15 3 21 3 21 9\"></polyline>
                        <line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>
                    </svg>
                </a>

                ${article.tags.length > 0 ? `
                    <div class=\"article-tags\">
                        ${article.tags.map(tag => `<span class=\"tag\">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}

                ${article.notes ? `
                    <p class=\"article-notes\">${this.escapeHtml(article.notes)}</p>
                ` : ''}
            </article>
        `;
    }

    attachArticleEventListeners() {
        // Toggle read status
        document.querySelectorAll('[data-action=\"toggle-read\"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleReadStatus(btn.dataset.id);
            });
        });

        // Toggle favorite
        document.querySelectorAll('[data-action=\"favorite\"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(btn.dataset.id);
            });
        });

        // Edit article
        document.querySelectorAll('[data-action=\"edit\"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editArticle(btn.dataset.id);
            });
        });

        // Delete article
        document.querySelectorAll('[data-action=\"delete\"]').forEach(btn => {
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
"