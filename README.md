# xHain hack+makespace Homepage

Staging: https://staging.x-hain.de
Production: https://www.x-hain.de

# Getting started

## Install Hugo

### Mac OS
* Install brew (for installing the rest): ``/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``
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
