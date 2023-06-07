# xHain hack+makespace Homepage

Staging: https://staging.x-hain.de [![status-badge](https://ci.x-hain.de/api/badges/xHain-hackspace/xhain-website/status.svg?branch=staging)](https://ci.x-hain.de/xHain-hackspace/xhain-website)

Production: https://www.x-hain.de  [![status-badge](https://ci.x-hain.de/api/badges/xHain-hackspace/xhain-website/status.svg?branch=main)](https://ci.x-hain.de/xHain-hackspace/xhain-website)

# Getting started

## Install Hugo

### Mac OS
* Install brew (for installing the rest): ``/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"``
* Install go: ``brew install go``
* Install hugo: ``brew install hugo``

### For Windows/Linux:
* Install hugo: [Hugo Website](https://gohugo.io)

## Pull Submodules (eg. Theme)
* Initial pull submodule xhain-theme: ``git submodule update --init --recursive``
* Submodule update: ``git submodule foreach git pull origin master``

## Generate Site
* Run hugo to generate HTML: ``hugo``

* Run hugo for local development:

   ``hugo server --config config.toml,home.toml`` 

  or

  ``hugo server --config config.toml,home.toml -w --cleanDestinationDir``

# Content Editing

## New Post

* create new post (using archetypes):

  ``hugo new de/post/YYYY-MM-DD_title.de.md -k post`` 

  or

  ``hugo new en/post/YYYY-MM-DD_title.en.md -k post``

* just edit new post in the "content"-folder
