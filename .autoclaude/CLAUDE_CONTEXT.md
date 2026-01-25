# AutoClaude Project Context

Generated at: 2026-01-25T16:32:48.601Z

---

# Project Context

## Workspace
- **Root**: c:\Users\ahmed\Downloads\personal files\personal documents\portfolio
- **Type**: single
- **Last Updated**: 2026-01-25T16:32:48.307Z

## Statistics
- **Total Files**: 27
- **Estimated Lines**: 631
- **Average File Size**: 149555 bytes

## Languages
- **json**: 57 files
- **html**: 16 files
- **css**: 8 files
- **javascript**: 8 files
- **markdown**: 8 files
- **shellscript**: 3 files

## Project Structure
- **Main Languages**: Not detected
- **Frameworks**: None detected
- **Test Frameworks**: None detected
- **Build Tools**: None detected

## Configuration Files



## Largest Files
- assets\images\INFTEC.png (707KB)
- assets\images\future_plan.png (595KB)
- assets\images\car_crashes_analysis.png (553KB)
- assets\images\Technical Support Fundamentals.png (414KB)
- assets\images\Introduction to TensorFlow for Artificial Intelligence, ML & DL.png (408KB)
- assets\images\Convolutional Neural Networks in TensorFlow.png (399KB)
- assets\images\Introduction to AI.png (334KB)
- assets\images\UK_Train_performance.png (156KB)
- assets\images\Sales pipeline.png (139KB)
- assets\images\tips_prediction.png (126KB)


---

# Task Summary

## Overall Statistics
- **Total Tasks**: 0
- **Pending**: 0
- **In Progress**: 0
- **Completed**: 0
- **Failed**: 0

## Current Session
- **Session ID**: mktyiyvo-is36mgf
- **Started**: 2026-01-25T16:32:47.892Z
- **Tasks in Session**: 0

## Recent Tasks



---

## Unfinished Tasks
No unfinished tasks

---

## Recent Changes

### Git Status
```
 M assets/data/certificates.json
 M assets/data/profile.json
 M assets/data/projects.json
 M assets/data/timeline.json
?? .autoclaude/
?? .vscode/
?? "assets/images/Sales pipeline.png"
?? assets/images/UK_Train_performance.png
?? assets/images/future_plan.png
?? assets/images/suitpersonalphoto.jpeg
?? assets/images/tips_prediction.png

```

### Recent Commits
```
148c842 Switch project images to object-fit contain
8af7318 Optimize image fitting for projects and certificates
a188c59 Fix absolute paths in certificates.json
934d7ec Fix profile photo path and rename to web-safe filename
c5cddcb Fix profile photo path and sort timelines descending
7754cd1 Add profile photo support
9f6476a Initial commit of portfolio

```

---

## Current File Context
# File Context: README.md

- **Size**: 2537 bytes
- **Language**: markdown
- **Last Modified**: 2026-01-11T11:50:31.211Z
- **Hash**: 9d9dae3d6f28251665605c6f0fb6f16e


### Visible Content (first 50 lines)
```markdown
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

```