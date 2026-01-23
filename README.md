# Join - Kanban Project Management Tool

A collaborative task management application built with Vanilla JavaScript, following modern web development best practices and BEM methodology.

## 📋 Project Overview

Join is a Multi-Page Application (MPA) that helps teams organize their work using a Kanban board system. This project is a complete refactoring and reimplementation focusing on clean code, scalability, and user experience.

## 🎯 Project Goals

- ✅ Implement all user stories from the project specification
- ✅ Follow BEM methodology for CSS and JavaScript file structure
- ✅ Write clean, maintainable code (max 400 LOC per file, max 14 lines per function)
- ✅ Use Firebase Firestore for backend data management
- ✅ Support guest login for testing all features
- ✅ Ensure responsive design (min. 320px width)
- ✅ Provide intuitive user feedback (hover effects, toast messages)
- ✅ Document all functions with JSDoc comments

## 🚀 Tech Stack

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **HTML**: Semantic HTML5
- **CSS**: Custom CSS with BEM naming convention
- **Templating**: Custom `includeHTML.js` for component imports
- **Architecture**: MPA (Multi-Page Application) - NO frameworks, NO state management

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting (planned) / Local Development

### Code Quality
- **Documentation**: JSDoc
- **Version Control**: Git with feature branching
- **Naming Convention**: camelCase for JS, BEM for CSS

## 📁 Project Structure

```
join-mpa/
├── config/                    # Firebase configuration
├── services/                  # Backend services (auth, firestore, data)
├── assets/                    # Static resources (fonts, images, templates)
├── css/                       # Stylesheets (base, layout, pages, components)
├── js/                        # JavaScript modules (auth, board, tasks, contacts, etc.)
└── pages/                     # HTML pages
```

## 🎨 Code Conventions

### JavaScript
- **No ES6 Classes** - Use factory functions, closures, and IIFE modules
- **No window globals** - Functions imported via `<script>` tags in logical order
- **Max 14 lines** per function
- **Max 400 lines** per file
- **JSDoc comments** required for all functions
- **camelCase** naming for variables and functions

### CSS
- **BEM methodology** for all class names
- **No deep nesting** - flat CSS structure
- **Component-based** organization

### File Naming
- **JavaScript**: BEM-inspired (e.g., `board__drag.js`, `contact__validation.js`)
- **CSS**: Feature-based (e.g., `board.css`, `add-task.css`)
- **HTML**: Descriptive page names (e.g., `board.html`, `contacts.html`)

## ✨ Key Features

### 1. User Management
- User registration with email validation
- Login/Logout functionality
- Guest login for testing
- Password requirements and validation
- User profile in contacts list

### 2. Kanban Board
- Four columns: To Do, In Progress, Awaiting Feedback, Done
- Drag & Drop task management (desktop & mobile)
- Search functionality
- Visual task cards with priority, category, and assigned users
- Subtask progress visualization

### 3. Task Management
- Create, edit, and delete tasks
- Assign tasks to contacts
- Set priority (Low, Medium, High)
- Add/edit/delete subtasks
- Set due dates
- Categorize tasks (Technical Task, User Story)

### 4. Contact Management
- Alphabetically sorted contact list
- Add, edit, and delete contacts
- Contact details (name, email, phone)
- Color-coded contact initials
- Contact assignment to tasks

### 5. Dashboard
- Task statistics by status
- Upcoming deadlines
- Personalized greeting
- Quick overview of all tasks

## 🔧 Development Guidelines

### Branch Strategy
```
main                   # Production
├── develop            # Development branch
    ├── feature/setup-firebase
    ├── feature/auth-system
    ├── feature/board-basic
    └── feature/contacts-crud
```

### Forbidden Patterns
```javascript
// ❌ WRONG: No ES6 Classes
class TaskManager {}

// ❌ WRONG: No window globals
window.setItem = setItem;

// ✅ CORRECT: Factory functions
function createTaskManager(config) {
  return { addTask, getTasks };
}

// ✅ CORRECT: IIFE modules
const TaskModule = (() => {
  return { addTask, getTasks };
})();
```

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Join-MPA
   ```

2. **Firebase Configuration**
   ```bash
   cp config/firebase.config.js.example config/firebase.config.js
   # Edit firebase.config.js with your Firebase credentials
   ```

3. **Local Development**
   - Use Live Server or any local HTTP server
   - Open `index.html` in your browser

## 🎯 Implementation Phases

### Phase 1: Setup & Foundation ✅
- [x] Project structure
- [x] Firebase configuration
- [x] Include HTML system
- [x] Git branching strategy

### Phase 2: Core Services (In Progress)
- [ ] Firestore CRUD service
- [ ] Auth service (login, register, logout)
- [ ] Data service (user, tasks, contacts)

### Phase 3: Authentication
- [ ] Login page + functionality
- [ ] Register page + validation
- [ ] Guest login
- [ ] Route protection

### Phase 4: Shared Components
- [ ] Header
- [ ] Sidebar/Menu
- [ ] Templates

### Phase 5: Board Feature
- [ ] Board initialization
- [ ] Task rendering
- [ ] Drag & Drop
- [ ] Search functionality

### Phase 6: Task Management
- [ ] Add task form
- [ ] Task validation
- [ ] Subtask management
- [ ] Contact assignment

### Phase 7: Contact Management
- [ ] Contact list
- [ ] Add/Edit/Delete contacts
- [ ] Contact validation

### Phase 8: Dashboard & Polish
- [ ] Summary/Dashboard
- [ ] Help & Legal pages
- [ ] Final testing & bug fixes

## 📝 User Stories Checklist

All user stories from the project specification will be implemented:
- User registration & authentication
- Kanban board with 4 columns
- Task CRUD operations
- Subtask management
- Contact management
- Dashboard with statistics
- Help & legal pages

## 🧪 Testing

Before submission:
- [ ] All features tested in Chrome, Firefox, Safari, Edge
- [ ] Responsive design tested (min. 320px)
- [ ] At least 5 realistic tasks created
- [ ] At least 10 contacts created
- [ ] No console errors
- [ ] All user stories validated

## 🤝 Contributing

This is a learning project for web development training. Follow the Definition of Done checklist before any merge to develop or main branch.

## 📄 License

Educational project - Developer Akademie

## 🔗 Links

- [Project Specification](./SPECIFICATION.md) (if applicable)
- [Firebase Console](https://console.firebase.google.com/)
- [BEM Methodology](http://getbem.com/)
- [JSDoc Documentation](https://jsdoc.app/)

---

**Note**: This project is part of a web development training program and follows strict coding standards for educational purposes.
