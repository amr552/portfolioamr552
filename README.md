# Minimalist Data Portfolio

A professional, static portfolio website designed for Data Analysts, Scientists, and ML Engineers. Built with HTML, CSS, and Vanilla JavaScript.

## Features
- **JSON-Driven Content**: Manage Projects, Timeline, and Profile data via simple JSON files.
- **Dark Mode**: Persisted user preference.
- **Responsive Design**: Mobile-friendly layout.
- **Filterable Projects**: Search by title or filter by tags (ML, CV, Data, etc.).
- **Zero Dependencies**: Runs offline (except for external linked resources like fonts/icons).

## Project Structure
```
/
├── index.html              # Main entry point
├── assets/
│   ├── css/
│   │   └── styles.css      # All styling variables and rules
│   ├── js/
│   │   └── main.js         # Logic for loading data and interactions
│   ├── data/               # <-- EDIT THESE FILES
│   │   ├── profile.json    # Personal info & site config
│   │   ├── projects.json   # Process objects
│   │   ├── timeline.json   # Timeline events
│   │   ├── certificates.json
│   │   └── socials.json
│   └── img/                # Place your images here
```

## How to Customize

### 1. Personal Information
Edit `assets/data/profile.json` to update your name, role, bio, and contact details.

### 2. Adding Projects
Open `assets/data/projects.json` and add a new object to the array:
```json
{
  "title": "My New Project",
  "description": "Short description...",
  "tags": ["NLP", "Python"],
  "tech": ["PyTorch", "HuggingFace"],
  "status": "Completed",
  "links": { "github": "..." }
}
```

### 3. Timeline & Certificates
Edit `assets/data/timeline.json` and `assets/data/certificates.json` following the existing format.

## Deployment on GitHub Pages

1. **Push to GitHub**:
   - Create a new repository (e.g., `username.github.io` or `portfolio`).
   - Push all files to the repository.

2. **Enable Pages**:
   - Go to Repository Settings > Pages.
   - Select `main` branch and `/ (root)` folder.
   - Click Save.

3. **Visit Site**:
   - Your site will be live at `https://username.github.io/repo-name`.

## Local Development
To test locally, you can open `index.html` directly in your browser.
*Note: Some browsers block `fetch` calls on local files (`file://`). If data doesn't load:*
1. Use a simple local server, e.g., VS Code "Live Server" extension.
2. Or python: `python -m http.server`
