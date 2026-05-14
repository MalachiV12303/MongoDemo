Live Demo: not live yet  
Started: May 2026

You will need own .env with MongoDB Atlas connection string.  

### Start Frontend  
cd frontend  
pnpm dev  

### Start Backend  
cd backend  
source venv/Scripts/activate  
uvicorn app.main:app --reload  

#### Exit Backend VENV
deactivate  

# Making Full-Stack Application
## Tech Stack
**Frontend:**
- React  
- TypeScript  
- Tailwind CSS  

**Backend:**
- FastAPI  
- Python  
- MongoDB Atlas  

### TO DO:
- React Protected Routes
- Deploy with AWS, learn/add Terraform

### Current Features
- User authentication
- CRUD functionality
- Search/filter/sorting
- User-specific permissions
- Backend validation
- Frontend validation
- Automated testing

### Dev Log
#### Day 1: May 11th 2026
- Built the initial full-stack project structure.  
- Connected FastAPI backend to MongoDB Atlas.  
- Created core API routes for GET, POST, PATCH, and DELETE requests.  
- Verified frontend could successfully communicate with backend APIs.  

#### Day 2: May 12th 2026
- Expanded API query functionality:
  - result limiting
  - filtering by value ranges
  - search functionality
  - sorting options
  - collection selection
- Refactored both frontend and backend code to make things easier to scale as features get added.  
- Cleaned up component structure and separated API logic from UI logic.  

#### Day 3: May 13th 2026
- Added user authentication system.  
- Stored user accounts in MongoDB.  
- Implemented password hashing with bcrypt.  
- Fixed bcrypt version issue during setup.  
- Connected frontend UI state to backend auth state.  
- Added backend validation for API requests.  
- Added frontend validation to prevent invalid submissions before making unnecessary API calls.  
- Linked created movie entries to specific users.  
- Users can only edit/delete their own entries, while admins can manage all entries.  
- Added pytest tests for backend endpoints — all currently passing.  
