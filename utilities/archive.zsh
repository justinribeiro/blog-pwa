#!/bin/zsh
#
# archive.zsh - Send a SiteMap of URLs or a single URL to the Internet Archive
# Wayback Machine
#
# What you need: zsh curl grep
#
# Usage for SiteMap
# ./archive.zsh [-m PATH_TO_SITEMAP.xml] [-t ACCESS:SECRET]
#
# Usage for Single URL
# ./archive.zsh [-u URL] [-t ACCESS:SECRET]
#
# To obtain the ACCESS:SECRET, you need an Archive.org Account and then can
# access the API keys via https://archive.org/account/s3.php
#
# This script is a mashup of the  excellent research and posts from:
# https://fabulous.systems/posts/2025/01/bts1-submitting-entire-websites-to-archive-org/
# and https://foxrow.com/til-api-for-saving-webpages-in-the-wayback-machine
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
   default_target=(-m )
   default_token=(-t )
   default_url=(-u )

   zparseopts -K -- m:=default_target t:=default_token u:=default_url
   if [[ $? != 0 || "$o_help" != "" ]]; then
       echo Usage: $(basename "$0") "[-m SITEMAP.xml] [-t ACCESS:SECRET]"
       exit 1
   fi

   target=$default_target[2]
   token=$default_token[2]
   url=$default_url[2]

   if [[ $root[1] != '/' ]]; then root="$PWD/$root"; fi
}
parse_options $*

SUBMISSION_URL="https://web.archive.org/save/"

print "${YELLOW}***************************************** ${RESET}"
print "${YELLOW}  Internet Archive - Send Some Url(s) ${RESET}"
if [[ $url ]]; then
  print "${YELLOW}  Sending single URL ${url} ${RESET}"
fi
if [[ $target ]]; then
  print "${YELLOW}  Parsing and sending URLs from ${target} ${RESET}"
fi
print "${YELLOW}***************************************** ${RESET}"

try_count=0

#
# The POST will actually give you the job_id, but I don't feel like displaying
# it; if it's a 200, we're golden
#
# Derived from the excellent post:
# https://foxrow.com/til-api-for-saving-webpages-in-the-wayback-machine
#
send_url() {
  curl -s -o /dev/null -w "%{http_code}" -X POST -H "Accept: application/json" -H "Authorization: LOW ${token}" -d"url=${url_to_announce}&capture_all=1&delay_wb_availability=1&skip_first_archive=1" "https://web.archive.org/save"
}

archive_url() {
  ((try_count++))

  if [[ $(send_url "${url_to_announce}") == '200' ]]; then
    print "${BOLD_GREEN}SUCCESS, Added to Archive: ${url_to_announce} ${RESET}"
    try_count=0
  else
    # There is a rate limit when hitting the POST; with the tiny sleep, it
    # usually won't need this catch case, but we sleep for a bit to cool off;
    # this seems to keep things happy
    print "${BOLD_RED}ERROR, Something Went Wrong: ${url_to_announce} ${RESET}"
    print "${BOLD_RED}Sleeping 45 seconds, then trying again ${RESET}"

    sleep 45

    # Retry announcing the same URL again until we reach the failure threshold
    if [ "$try_count" -lt 5 ] && [ "$try_count" -ne 0 ]; then
      archive_url "${url_to_announce}"
    else
      print "${BOLD_RED}FATAL: Giving up on ${url_to_announce} ${RESET}"
      try_count=0
      return 1
    fi
  fi
}

if [[ $url ]]; then
  print ""
  url_to_announce="${url}"
  archive_url "${url_to_announce}"
else
  # Starting the main loop, iterating through the
  # entire contents of sitemap.xml
  print "${BOLD_BLUE}STAGE 1: Parsing URLS from Sitemap... ${RESET}"

  grep loc $target | sed 's/    <loc>//g' | sed 's/<\/loc>//g' | while IFS= read -r url_to_announce; do
    print "${BOLD_BLUE}LOOP: Sending ${url_to_announce} ${RESET}"
    archive_url "${url_to_announce}"
    sleep 5
  done
fi
print ""
print "${GREEN}***************************************** ${RESET}"
print "${GREEN} Program Complete! May your archive live ${RESET}"
print "${GREEN}  until the heat death of the universe! ${RESET}"
print "${GREEN}***************************************** ${RESET}"
print ""