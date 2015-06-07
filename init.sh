#!/bin/bash


set -e

{ # this ensures the entire script is downloaded #

    ## Helpers

    notice() { echo -e "\033[4;37m$@\033[0m"; }
    success() { echo -e "\033[45m ✔ $@ \033[0m"; }
    error() { echo -e "\033[41m ✖ $@ \033[0m"; }

    ## Requirements

    notice "Requirements..."

    if which node >/dev/null; then
        success "NodeJS"
    else
        error "Please install NodeJS"
        exit 1
    fi

    if which npm >/dev/null; then
        success "NPM"
    else
        error "Please install NPM"
        exit 1
    fi

    if which bower >/dev/null; then
        success "Bower"
    else
        notice "Installing Bower globally..."
        npm install -g bower
    fi

    if which gulp >/dev/null; then
        success "Gulp"
    else
        notice "Installing Gulp globally..."
        npm install -g gulp
    fi

    ## Get the repository
    
    echo ""
    read -p "Project Name: " P_NAME
    echo ""

    if which git >/dev/null; then
        notice "Get repository using Git..."
        git clone https://bymathias@github.com/bymathias/_base.git $P_NAME
        cd $P_NAME
    else
        notice "Get repository using Curl..."
        [[ ! -d $P_NAME ]] && mkdir $P_NAME
        cd $P_NAME
        curl -#L https://github.com/bymathias/base/tarball/master | tar -xzv --strip-components 1
    fi

    echo "Replace project name in *.json files"
    sed -i "" "s/base/$P_NAME/g" *.json

    ## Install dependencies

    notice "Installing npm packages..."
    npm install

    notice "Installing bower packages..."
    bower install

    echo ""
    success "Install successfull"
    echo ""

} # this ensures the entire script is downloaded #
