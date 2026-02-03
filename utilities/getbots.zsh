#!/bin/zsh
#
# getbots.zsh - Pull and format latest AI bot list for Python and robots.txt
# from https://github.com/ai-robots-txt/ai.robots.txt
#
# This is not fancy; it could be, but I don't run this/update all the time, so
# copy and paste works fine.
#

autoload colors
if [[ "$terminfo[colors]" -gt 8 ]]; then
    colors
fi
for COLOR in RED GREEN YELLOW BLUE MAGENTA CYAN BLACK WHITE; do
    eval $COLOR='$fg_no_bold[${(L)COLOR}]'
    eval BOLD_$COLOR='$fg_bold[${(L)COLOR}]'
done
eval RESET='$reset_color'

echo '\n'${BOLD_BLUE}STEP 1: Pulling Bots and formatting with jq and perl...:${RESET}
curl -s https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.json | jq 'keys_unsorted' | perl -pe 's/ (?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/\/ /gm'

echo '\n'${BOLD_BLUE}STEP 2: Pulling Bots for robots.txt...:${RESET}
curl -s https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt

echo '\n'${BOLD_GREEN}DONE: Copy and Paste as needed!${RESET}