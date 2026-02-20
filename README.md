# xHain hack+makespace Homepage

Staging: https://staging.x-hain.de [![status-badge](https://ci.x-hain.de/api/badges/xHain-hackspace/xhain-website/status.svg?branch=staging)](https://ci.x-hain.de/xHain-hackspace/xhain-website)

Production: https://www.x-hain.de  [![status-badge](https://ci.x-hain.de/api/badges/xHain-hackspace/xhain-website/status.svg?branch=main)](https://ci.x-hain.de/xHain-hackspace/xhain-website)

## Getting started

### Install Hugo

The required Hugo version is pinned in the `.hvm` file. This ensures local development and CI use the same version.

#### Mac OS (recommended)

Using [hvm (Hugo Version Manager)](https://github.com/jmooring/hvm):

```bash
# Install brew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install go

# Install hvm
go install github.com/jmooring/hvm@latest

# Add to your shell (zsh)
hvm gen alias zsh >> ~/.zshrc
source ~/.zshrc

# hvm will automatically download and use the version from .hvm
hugo version
```

#### Mac OS (alternative)

```bash
brew install hugo
```

Note: Homebrew may install a different version than specified in `.hvm`.

#### Windows/Linux

* Install hugo: [Hugo Website](https://gohugo.io)
* Use the version specified in `.hvm` file

### Pull Submodules (eg. Theme)

* Initial pull submodule xhain-theme: ``git submodule update --init --recursive``
* Submodule update: ``git submodule foreach git pull origin master``

### Generate Site

* Run hugo to generate HTML: ``hugo``
* Run hugo for local development:

   ``hugo server --config config.toml,home.toml``

  or

  ``hugo server --config config.toml,home.toml -w --cleanDestinationDir``

## Content Editing

### New Post

* create new post (using archetypes):

  ``hugo new de/post/YYYY-MM-DD_title.de.md -k post``

  or

  ``hugo new en/post/YYYY-MM-DD_title.en.md -k post``

* just edit new post in the "content"-folder

## Link Checking

Dead links are automatically checked on pull requests. To run locally:

```bash
# Build the site first
hugo -d public_html --config config.toml,home.toml --cleanDestinationDir

# Check for broken links (via Docker)
docker run --rm -v "$PWD:/src" -w /src ghcr.io/untitaker/hyperlink:0.2.0 \
  public_html --sources .

# Or install natively and run
npm install -g @untitaker/hyperlink
hyperlink public_html/ --sources .
```

See [hyperlink documentation](https://github.com/untitaker/hyperlink) for more options.

## Calendar

The calendar is managed by [Nextcloud](https://files.x-hain.de/apps/calendar/dayGridMonth/now).
