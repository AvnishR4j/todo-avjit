class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.userId = null;
        this.todosRef = null;
        this.init();
    }

    async init() {
        // Initialize Firebase (make sure firebase-config.js is loaded first)
        try {
            await this.signInAnonymously();
            this.setupFirestore();
            this.bindEvents();
            this.loadTodos();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showNotification('Failed to initialize app', 'error');
        }
    }

    async signInAnonymously() {
        try {
            const result = await auth.signInAnonymously();
            this.userId = result.user.uid;
            console.log('Signed in anonymously:', this.userId);
        } catch (error) {
            console.error('Anonymous sign-in failed:', error);
            throw error;
        }
    }

    setupFirestore() {
        // Reference to user's todos collection
        this.todosRef = db.collection('users').doc(this.userId).collection('todos');
        
        // Set up real-time listener
        this.todosRef.orderBy('createdAt', 'desc').onSnapshot(
            (snapshot) => {
                this.todos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                this.render();
                this.updateStats();
            },
            (error) => {
                console.error('Firestore listener error:', error);
                this.showNotification('Failed to sync data', 'error');
            }
        );
    }

    bindEvents() {
        // Add todo
        document.getElementById('addTodoBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filters
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Sort
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });
    }

    async addTodo() {
        const input = document.getElementById('todoInput');
        const priority = document.getElementById('prioritySelect').value;
        const category = document.getElementById('categorySelect').value;
        const text = input.value.trim();

        if (!text) {
            this.showNotification('Please enter a task', 'error');
            return;
        }

        try {
            const todo = {
                text,
                priority,
                category,
                completed: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.todosRef.add(todo);
            
            // Clear input
            input.value = '';
            input.focus();

            this.showNotification('Task added successfully!', 'success');
        } catch (error) {
            console.error('Error adding todo:', error);
            this.showNotification('Failed to add task', 'error');
        }
    }

    async toggleTodo(id) {
        try {
            const todo = this.todos.find(t => t.id === id);
            if (todo) {
                await this.todosRef.doc(id).update({
                    completed: !todo.completed
                });
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
            this.showNotification('Failed to update task', 'error');
        }
    }

    async editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newText = prompt('Edit task:', todo.text);
        if (newText && newText.trim() !== todo.text) {
            try {
                await this.todosRef.doc(id).update({
                    text: newText.trim()
                });
                this.showNotification('Task updated!', 'success');
            } catch (error) {
                console.error('Error editing todo:', error);
                this.showNotification('Failed to update task', 'error');
            }
        }
    }

    async deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await this.todosRef.doc(id).delete();
                this.showNotification('Task deleted', 'info');
            } catch (error) {
                console.error('Error deleting todo:', error);
                this.showNotification('Failed to delete task', 'error');
            }
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });
        
        this.render();
    }

    getFilteredTodos() {
        let filtered = [...this.todos];

        // Apply filter
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(t => !t.completed);
                break;
            case 'completed':
                filtered = filtered.filter(t => t.completed);
                break;
        }

        // Apply sort
        switch (this.currentSort) {
            case 'oldest':
                filtered.sort((a, b) => {
                    const aTime = a.createdAt ? a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime() : 0;
                    const bTime = b.createdAt ? b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime() : 0;
                    return aTime - bTime;
                });
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'name':
                filtered.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => {
                    const aTime = a.createdAt ? a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime() : 0;
                    const bTime = b.createdAt ? b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime() : 0;
                    return bTime - aTime;
                });
                break;
        }

        return filtered;
    }

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        todoList.style.display = 'flex';
        emptyState.style.display = 'none';

        todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');

        // Bind todo events
        todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                this.toggleTodo(e.target.dataset.id);
            });
        });

        todoList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.editTodo(e.target.dataset.id);
            });
        });

        todoList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteTodo(e.target.dataset.id);
            });
        });
    }

    createTodoHTML(todo) {
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-meta">
                        <span class="priority-badge ${todo.priority}">${todo.priority}</span>
                        <span class="category-badge ${todo.category}">${todo.category}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="edit-btn" data-id="${todo.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${todo.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('completionRate').textContent = `${rate}%`;
    }

    loadTodos() {
        // Data is loaded via the real-time listener in setupFirestore()
        // This method is kept for compatibility but the actual loading happens in the listener
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#16a34a',
            error: '#dc2626',
            info: '#2563eb'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
