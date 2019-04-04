#!/bin/zsh
#
# builder.zsh - build our blog-pwa
#
# What you need:
#   zsh
#   polymer-cli
#   hugo
#   sed
#   jq
#
# Basic usage:
# ./utilities/builder.zsh -t [build target]
#
# Example:
# ./utilities/builder.zsh -t dev
# ./utilities/builder.zsh -t prod
#
# Targets:
#
# dev
#   - will do some building and moving of files
#   - runs polymer serve so you can edit on the fly
#
# prod
#   - will do some building, will move files around, will vet files
#   - will generate /ship with ready-to-roll H2 GAE setup
#
# check
#   - validates if you have the needed tooling
#
# setup
#   - runs npm and bower for support of the frontend
#

zmodload zsh/zutil
autoload zmv
autoload colors

if [[ "$terminfo[colors]" -gt 8 ]]; then
    colors
fi
for COLOR in RED GREEN YELLOW BLUE MAGENTA CYAN BLACK WHITE; do
    eval $COLOR='$fg_no_bold[${(L)COLOR}]'
    eval BOLD_$COLOR='$fg_bold[${(L)COLOR}]'
done
eval RESET='$reset_color'

parse_options()
{
   default_target=(-t dev)
   default_project=(-p $PWD)

   zparseopts -K -- t:=default_target p:=drefault_project
   if [[ $? != 0 || "$o_help" != "" ]]; then
       echo Usage: $(basename "$0") "[-t BUILD_TARGET] [-p PROJECT_PATH]"
       exit 1
   fi

   target=$default_target[2]
   project=$default_project[2]

   if [[ $root[1] != '/' ]]; then root="$PWD/$root"; fi
}
parse_options $*

move_json() {
  zmv -Q '(**/)(*).html' '$1$2.json';
}

clean_json() {
  # Optional: strip newline start in article
  sed -r -i -- 's/\"article\": \"\\n\\n/\"article\": \"/g' **/*.json(D.)

  # Optional: strip newline double at ending <p>
  sed -r -i -- 's/\&lt;\/p\&gt;\\n\\n/\&lt;\/p\&gt;/g' **/*.json(D.)

  # Kinda important; escape slashes in certain cases
  sed -r -i -- 's/(\\)/\\\\/g' **/*.json(D.)
  sed -r -i -- 's/(\\[n])/n/g' **/*.json(D.)
}

validate_json() {
  # we basically pipe the good jq output to /dev/null
  # and only look for parse errors
  for file in **/*.json(D.); do;
    jq -c .title $file 1> /dev/null
    if [[ $? -eq 4 ]]; then
      echo "file: $file"
    fi
  done
}

validate_tools() {
  local good=true;

  echo -n "npm ... "
  if ! type "npm" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "yarn ... "
  if ! type "yarn" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "bower ... "
  if ! type "bower" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "polymer-cli ... "
  if ! type "polymer" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "hugo ... "
  if ! type "hugo" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "jq ... "
  if ! type "jq" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "sed ... "
  if ! type "sed" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  echo -n "gcloud ... "
  if ! type "gcloud" > /dev/null; then
    echo "${BOLD_RED} NO ${RESET}"
    good=false;
  else
    echo "${BOLD_GREEN} YES ${RESET}"
  fi

  if [ good ]; then
    print "${BOLD_GREEN}Looks like you have all the tools!${RESET}"
  else
    print "${BOLD_RED}Oh no, tools missing! Install the missing tools before continuing.${RESET}"
    exit 1;
  fi
}

case $target in
  (dev)
    print "${BOLD_YELLOW}BUILD TARGET = DEV${RESET}"
    print "${BOLD_YELLOW}Project Path: $project ${RESET}"
    print "${BOLD_YELLOW}...hang on to your hats...${RESET}"

    print "${BOLD_BLUE}STAGE 1: Cleaning... ${RESET}"

    # Step 1: clean some things out
    if [[ -d "$project/app/data" ]]; then
      rm -rf $project/app/data/*
    fi

    print "${BOLD_BLUE}STAGE 2: Build hugo data files ${RESET}"

    # Step 2: build the hugo config
    cd $project/hugo/; hugo; cd ..;

    print "${BOLD_BLUE}STAGE 3: Shuffle HTML > JSON ${RESET}"

    # Step 3: shuffle html > json
    cd $project/app/data/;

    move_json $*

    # Clean up some data with sed
    print "${BOLD_BLUE}STAGE 4: Clean JSON data ${RESET}"
    clean_json $*

    print "${BOLD_BLUE}STAGE 5: Validate JSON files ${RESET}"
    validate_json $*

    # back to top
    cd ../../;

    print "${BOLD_BLUE}STAGE 6: polymer serve ${RESET}"

    # Step 4: build polymer frontend
    cd $project/app/; polymer serve --hostname 0.0.0.0;

    ;;
  (prod)
    print "${BOLD_YELLOW}BUILD TARGET = PROD${RESET}"
    print "${BOLD_YELLOW}Project Path: $project ${RESET}"
    print "${BOLD_YELLOW}...hang on to your hats...${RESET}"

    # Step 1: clean some things out
    print "${BOLD_BLUE}STAGE 1: Cleaning... ${RESET}"
    if [[ -d "$project/app/data" ]]; then
      rm -rf $project/app/data/*
    fi
    if [[ -d "$project/ship" ]]; then
      rm -rf $project/ship
    fi

    print "${BOLD_BLUE}STAGE 2: Build hugo data files ${RESET}"
    cd $project/hugo/; hugo; cd ..;

    print "${BOLD_BLUE}STAGE 3: Shuffle HTML > JSON ${RESET}"

    # Step 3: shuffle html > json
    cd $project/app/data/;
    move_json $*

    # Clean up some data with sed
    print "${BOLD_BLUE}STAGE 4: Clean JSON data ${RESET}"
    clean_json $*

    print "${BOLD_BLUE}STAGE 5: Validate JSON files ${RESET}"
    validate_json $*

    # back to top
    cd ../../;

    # Step 4: build polymer frontend + push manifest
    print "${BOLD_BLUE}STAGE 6: Generate H2 push manifest ${RESET}"
    cd $project/app/;
    # node_modules/http2-push-manifest/bin/http2-push-manifest -f $PWD/index.html;
    polymer build;
    cd build/default;
    workbox generateSW $project/app/workbox-config.js
    cd ../../../;

    # Step 5: make a ship dir
    mkdir ship;

    # Step 6: copy AppEngine base
    print "${BOLD_BLUE}STAGE 7: Copy GAE config to /ship${RESET}"
    cp -R appengine/* ship/;

    # Step 7: copy polymer build
    print "${BOLD_BLUE}STAGE 8: Build+copy polymer build /ship${RESET}"
    cp -R app/build/default ship/dist;

    # Step 8: run app engine dev server to test
    print "${BOLD_GREEN}/ship built and ready for deploy${RESET}"

    ;;
  (setup)
    print "${BOLD_YELLOW}Checking tools and env${RESET}"
    print "${BOLD_YELLOW}Project Path: $project ${RESET}"
    echo ""
    print "${BOLD_BLUE}Searching for:${RESET}"
    validate_tools $*

    cd $project/app;

    print "${BOLD_BLUE}Running 'npm install' ${RESET}"
    npm install;

    print "${BOLD_BLUE}Running 'bower install' ${RESET}"
    bower install;

    ;;
  (check)
    print "${BOLD_YELLOW}Checking tools and env${RESET}"
    print "${BOLD_YELLOW}Project Path: $project ${RESET}"
    echo ""
    print "${BOLD_BLUE}Searching for:${RESET}"

    validate_tools $*

    ;;
  (*)
    print "You did not specifiy a valid build target."
    ;;
esac
