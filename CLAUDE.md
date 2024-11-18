# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for xHain hack+makespace, a hackerspace in Berlin-Friedrichshain. It's a Hugo static site with a bilingual setup (German/English) and a custom calendar integration that fetches events from Nextcloud.

- **Production**: https://www.x-hain.de (deployed from `main` branch)
- **Staging**: https://staging.x-hain.de (deployed from `staging` branch)

## Development Commands

```bash
# Install Hugo (macOS)
brew install hugo

# Pull theme submodule (required on first clone)
git submodule update --init --recursive

# Update theme submodule
git submodule foreach git pull origin master

# Run local development server
hugo server --config config.toml,home.toml

# Run with watch mode and clean destination
hugo server --config config.toml,home.toml -w --cleanDestinationDir

# Build for production
hugo -d public_html --config config.toml,home.toml --cleanDestinationDir
```

## Creating Content

```bash
# New German article
hugo new de/post/YYYY-MM-DD_title.de.md -k post

# New English article
hugo new en/post/YYYY-MM-DD_title.en.md -k post
```

Articles use YAML frontmatter with these fields: `title`, `date`, `image`, `image_reference`, `image_url`, `image_license`, `categories`, `tags`, `draft`.

## Architecture

### Directory Structure

- `content/de/` and `content/en/` - Bilingual content (German primary, English secondary)
- `layouts/` - Hugo templates (no external theme, all layouts are local)
  - `calendar/` - Custom calendar display with Nextcloud integration
  - `partials/` - Reusable template components
  - `shortcodes/` - Custom Hugo shortcodes
- `assets/css/` - SCSS styles (compiled by Hugo Pipes)
- `assets/js/` - JavaScript for calendar and map functionality
- `i18n/` - Translation strings (de.yaml, en.yaml)

### Calendar System

The calendar fetches events from a Nextcloud CalDAV endpoint (configured in `config.toml` under `params.calendar`). The calendar URL uses jCal format with date range placeholders. Events are parsed and displayed in `layouts/calendar/list.html` using Hugo's time functions.

### Multi-language Setup

- Default language: German (`de`)
- Both languages have their own content directories and menu configurations
- Language switch available in the UI
- Config sections: `[languages.de]` and `[languages.en]` in `config.toml`

## CI/CD

Woodpecker CI (`.woodpecker.yml`) handles:
- **main branch**: Build and deploy to production via rsync
- **staging branch**: Build and deploy to staging
- **Pull requests**: Build preview, deploy to Surge, and run link checking with hyperlink

## Key Configuration

- `config.toml` - Main Hugo configuration, languages, menus, and site parameters
- Timezone is set to `Europe/Berlin`
- Calendar events come from Nextcloud at `files.x-hain.de`
