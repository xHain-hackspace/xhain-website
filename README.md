# xHain hack+makespace Homepage

Staging: https://staging.x-hain.de [![status-badge](https://ci.x-hain.de/api/badges/xHain-hackspace/xhain-website/status.svg?branch=staging)](https://ci.x-hain.de/xHain-hackspace/xhain-website)

Production: https://www.x-hain.de  [![status-badge](https://ci.x-hain.de/api/badges/xHain-hackspace/xhain-website/status.svg?branch=main)](https://ci.x-hain.de/xHain-hackspace/xhain-website)

## Getting started

### Install Hugo

The required Hugo version is pinned in the `.hvm` file. This ensures local development and CI use the same version.

#### Linux

* Check [Linux instructions](https://gohugo.io/installation/linux/)

```bash
sudo snap install hugo
```

Note: snap might install a different version than specified in `.hvm` file.

#### macOS

```bash
# Install brew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Hugo
brew install hugo
```

Note: Homebrew only installs the latest version, which can be a different version than specified in `.hvm` file.

#### Windows

* Check [Windows instructions](https://gohugo.io/installation/windows/)

```bash
# Using Chocolatey 
choco install hugo-extended
# Using Scoop 
scoop install hugo-extended
```

Note: choco / scoop might install a different version than specified in `.hvm` file.

#### To install the exact same version as the one we use online...

This is useful to be sure that the build locally will behave the same later, in CI pipeline and online.

We will be using [hvm (Hugo Version Manager)](https://github.com/jmooring/hvm), which works on Linux, macOS and Windows.

* Install the executable

Download a [prebuilt binary](https://github.com/jmooring/hvm/releases/latest) or install from source (requires Go 1.26.3 or later):

```bash
# Install brew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install go

# Install hvm
go install github.com/jmooring/hvm@latest
```

* Linux / macOS (bash or fish can also be used):
```
# Add to your shell (zsh)
hvm gen alias zsh >> ~/.zshrc
source ~/.zshrc
```

Windows:
```
# Add to your shell (zsh)
hvm gen alias powershell --help

# Follow instructions from output
```

Finally, run hugo!
```sh
# hvm will automatically download and use the version from .hvm
hugo version
```

More info? see https://tsalikis.blog/posts/switching_hugo_versions/

### Pull Submodules (eg. Theme)

* Initial pull submodule xhain-theme: ``git submodule update --init --recursive``
* Submodule update: ``git submodule foreach git pull origin master``

### Generate Site

* Run hugo to generate HTML: ``hugo``
* Run hugo for local development:

   ``hugo server --config config.toml``

  or

  ``hugo server --config config.toml -w --cleanDestinationDir``

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
hugo -d public_html --config config.toml --cleanDestinationDir

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
