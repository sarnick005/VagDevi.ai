## VagDevi: AI Chatbot Project

### Instructions

1. **Clone Repository:**


   ```bash
   git clone <repository_url>
   cd VagDevi
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     SECRET_KEY=<your_secret_key>
     MONGODB_URI=<your_mongodb_uri>
     GOOGLE_GEMINI_API_KEY=<your_google_gemini_api_key>
     ```

5. **Create a Virtual Environment:**

   - For Unix or MacOS (Bash):
     ```bash
     cd backend
     python3 -m venv .venv
     ```

   - For Windows (PowerShell):
     ```bash
     cd backend
     python -m venv .venv
     ```

6. **Activate the Virtual Environment:**
   - On Unix or MacOS:
     ```bash
     source .venv/bin/activate
     ```
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```

7. **Install Dependencies:**
    ```bash
     pip install -r requirements.txt
    ```

8. **Start the Application:**
   - Start MongoDB server.
   - Backend server:
     ```bash
     python app.py
     ```

9. **Accessing the Application:**
   Open `http://localhost:5173` in your web browser.

### Forking and Branching

1. **Forking the Repository:**
   - Navigate to the [VagDevi repository](https://github.com/sarnick005/VagDevi) on GitHub.
   - Click the "Fork" button in the top-right corner of the page.
   - Wait for the repository to be copied to your GitHub account.

2. **Creating a Branch:**
   - After forking the repository, navigate to your forked repository on GitHub.
   - Click on the "Branch" dropdown menu and enter a name for your new branch.
   - Click "Create branch" or hit Enter.

3. **Making Changes:**
   - Clone your forked repository to your local machine.
   - Create a new branch for your changes.
   - Make your desired changes to the codebase.

4. **Committing and Pushing Changes:**
   - Stage your changes for commit.
   - Commit your changes with a descriptive message.
   - Push your changes to your forked repository.

5. **Creating a Pull Request:**
   - Navigate to your forked repository on GitHub.
   - Click on the "Pull Requests" tab and then the "New Pull Request" button.
   - Select the branch containing your changes and provide a descriptive title and summary for your pull request.
   - Click the "Create Pull Request" button.

### Tech Stack

- Frontend: React, Tailwind CSS, Material-UI
- Backend: Flask
- Authentication: JWT
- Database: MongoDB
- External API: Google Gemini

### Contributors

- [Sarnick Chakraborty](https://github.com/sarnick005)
- [Shubhayan Bagchi](https://github.com/S11UB11AYAN)
- [Subhakash Paul](https://github.com/SUBHAKASH-PAUL)

Feel free to reach out with any questions or feedback!
```

This layout provides a clearer structure for the instructions and makes it easier for users to follow.
