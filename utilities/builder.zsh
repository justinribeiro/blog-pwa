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
    jq -c . $file 1> /dev/null
    if [[ $? -eq 0 ]]; then
      jq -c . $file | sponge $file
    else
       echo "json parse error: $file"
    fi
  done
}

validate_tools() {
  local good=true;

  echo -n "yarn ... "
  if ! type "yarn" > /dev/null; then
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

  echo -n "sponge ... "
  if ! type "sponge" > /dev/null; then
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

# this is hacky and very specific; I should just write a rollup plugin and be
# smarter about this...but it'll work in the pinch for now
generate_manifest() {
  echo "{" >> ./ship/dist/push_manifest.json
  for i in $(find ./ship/dist/src -name 'blog-*.js' -exec basename {} \;); do
    echo "\"/src/$i\":{\"type\": \"script\"}," >> ./ship/dist/push_manifest.json
  done
  # soooo hacky, remove the last comman from the json
  truncate -s-2 ./ship/dist/push_manifest.json
  echo "" >> ./ship/dist/push_manifest.json
  echo "}" >> ./ship/dist/push_manifest.json
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

    print "${BOLD_BLUE}STAGE 6: es-dev-server serve ${RESET}"

    # Step 4: build polymer frontend
    cd $project/app/; yarn dev;

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
    print "${BOLD_BLUE}STAGE 6: Generate Frontend Build and Service Worker ${RESET}"
    cd $project/app/;
    yarn build:dist;
    cd ../;

    # Step 5: make a ship dir
    mkdir ship;

    # Step 6: copy AppEngine base
    print "${BOLD_BLUE}STAGE 7: Copy GAE config to /ship${RESET}"
    cp -R appengine/* ship/;

    # Step 7: copy polymer build
    print "${BOLD_BLUE}STAGE 8: Copy frontend build /ship${RESET}"
    cp -R app/build/default ship/dist;

    # clean this up
    xmllint --format app/data/sitemap.xml > ship/dist/data/sitemap.xml

    print "${BOLD_BLUE}STAGE 9: Generate preload manifest${RESET}"
    generate_manifest $*

    # run app engine dev server to test
    print "${BOLD_GREEN}/ship built and ready for deploy${RESET}"

    ;;
  (setup)
    print "${BOLD_YELLOW}Checking tools and env${RESET}"
    print "${BOLD_YELLOW}Project Path: $project ${RESET}"
    echo ""
    print "${BOLD_BLUE}Searching for:${RESET}"
    validate_tools $*

    cd $project/app;

    print "${BOLD_BLUE}Running 'yarn install' ${RESET}"
    yarn;

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
