#!/bin/zsh
#
# gensocials.zsh - Outputs from master three targets for social sharing bots
#
# Master should be greater than 2000x1300; script will center crop (don't put
# focus on edges of frame)
#
# ./gensocials.zsh -i ~/my-master.jpg -o ~/20160501-title -u true
#
# Outputs for paste into Hugo md blog post file:
#
# socialimage = "https://storage.googleapis.com/jdr-public-imgs/blog/20160501-title-twitter-1024x535.jpg"
# imagefb = "https://storage.googleapis.com/jdr-public-imgs/blog/20160501-title-fb-1200x630.jpg"
# imagegplus = "https://storage.googleapis.com/jdr-public-imgs/blog/20160501-title-gplus-800x360.jpg"
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

local inputfile outputfile uploadgsutil basefilename
local usage="Usage: $0:t [-i input file] [-o output path] [-u upload true|false]"

# no arguments - return with zero exit status
if [[ $# -eq 0 ]]
then
  echo $usage >&2
  return 1
fi

# fetch options
while getopts :i:o:u: opt
do
  case $opt in
    'i') inputfile=$OPTARG ;;
    'o') outputpath=$OPTARG ;;
    'u') uploadgsutil=$OPTARG ;;
    '?') echo $usage >&2 ; return 1 ;;
  esac
done

# http://zsh.sourceforge.net/Guide/zshguide05.html
# 5.4.8: Nested parameter substitutions
# remove longest match of */ from head
basefilename=${outputpath##*/}

echo '\n'${BOLD_BLUE}STEP 1: Generating Sizes...:${RESET}
convert $inputfile -verbose -resize '1200x630^' -gravity Center -crop 1200x630+0+0 $outputpath-fb-1200x630.jpg
convert $inputfile -verbose -resize '800x360^' -gravity Center -crop 800x360+0+0 $outputpath-gplus-800x360.jpg
convert $inputfile -verbose -resize '1024x535^' -gravity Center -crop 1024x535+0+0 $outputpath-twitter-1024x535.jpg
echo '\n'

echo ${BOLD_BLUE}STEP 2: Optimizing output...:${RESET}
jpegoptim -s --all-progressive -o -m65 $outputpath-fb-1200x630.jpg
jpegoptim -s --all-progressive -o -m65 $outputpath-gplus-800x360.jpg
jpegoptim -s --all-progressive -o -m65 $outputpath-twitter-1024x535.jpg
echo '\n'

if [[ ( $uploadgsutil ) ]]
then
  echo ${BOLD_BLUE}STEP 3: Uploading to Google Cloud Storage...:${RESET}
  gsutil cp $outputpath-fb-1200x630.jpg gs://jdr-public-imgs/blog/
  gsutil cp $outputpath-gplus-800x360.jpg gs://jdr-public-imgs/blog/
  gsutil cp $outputpath-twitter-1024x535.jpg gs://jdr-public-imgs/blog/
  gsutil acl ch -u AllUsers:R gs://jdr-public-imgs/blog/$basefilename-twitter-1024x535.jpg
  gsutil acl ch -u AllUsers:R gs://jdr-public-imgs/blog/$basefilename-fb-1200x630.jpg
  gsutil acl ch -u AllUsers:R gs://jdr-public-imgs/blog/$basefilename-gplus-800x360.jpg
  echo '\n'
fi

echo ${BOLD_RED}ACTION: Copy/Paste into YAML FrontMatter:${RESET}
echo 'socialimage = "https://storage.googleapis.com/jdr-public-imgs/blog/'$basefilename'-twitter-1024x535.jpg"'
echo 'imagefb = "https://storage.googleapis.com/jdr-public-imgs/blog/'$basefilename'-fb-1200x630.jpg"'
echo 'imagegplus = "https://storage.googleapis.com/jdr-public-imgs/blog/'$basefilename'-gplus-800x360.jpg"'
