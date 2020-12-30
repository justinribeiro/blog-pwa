#!/bin/zsh
#
# create-picture.zsh - Generates photo sizes and a <picture> element
#
# ./create-picture.zsh  -i ~/my-master.jpg -o ~/20160501-title -u true
#
# Outputs <picture> for pasting where ever:
#
# <picture>
#   <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/test-test-640.webp 640w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-800.webp 800w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-1024.webp 1024w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-1280.webp 1280w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-1600.webp 1600w"
#           sizes="(min-width: 800px) 800px, 100vw" type="image/webp">
#   <source srcset="https://storage.googleapis.com/jdr-public-imgs/blog/test-test-640.jpg 640w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-800.jpg 800w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-1024.jpg 1024w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-1280.jpg 1280w,
#                   https://storage.googleapis.com/jdr-public-imgs/blog/test-test-1600.jpg 1600w"
#           sizes="(min-width: 800px) 800px, 100vw" type="image/jpg">
#   <img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');" src="https://storage.googleapis.com/jdr-public-imgs/blog/test-test-800.jpg" alt="">
# </picture>
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

#
# all the important paths EDIT AS NEEDED
#
cdnPath='https://storage.googleapis.com/jdr-public-imgs/blog/'
gsPath='gs://jdr-public-imgs/blog/'

# http://zsh.sourceforge.net/Guide/zshguide05.html
# 5.4.8: Nested parameter substitutions
# remove longest match of */ from head
basefilename=${outputpath##*/}

# image widths we are going to scale to
widths=(640 800 1024 1280 1600)
workDir=`mktemp -d`

fileType=$inputfile:t:e

echo '\n'${BOLD_BLUE}STEP 1: Generating Sizes...:${RESET}
for width in ${widths[@]}; do
  convert $inputfile -verbose -resize $width $workDir/$basefilename-$width.$fileType
done
echo '\n'

echo ${BOLD_BLUE}STEP 2: Optimizing output...:${RESET}
for width in ${widths[@]}; do
  if [[ "$fileType" == "png" ]]; then
    optipng -o5 $workDir/$basefilename-$width.$fileType -out $outputpath-$width.png
    cwebp -lossless $workDir/$basefilename-$width.$fileType -o $outputpath-$width.webp
  else
    cjpeg -q 70 -progressive -optimize $workDir/$basefilename-$width.$fileType > $outputpath-$width.jpg
    cwebp -q 70 $workDir/$basefilename-$width.$fileType -o $outputpath-$width.webp
  fi
done
echo '\n'

if [[ ( $uploadgsutil ) ]]
then
  echo ${BOLD_BLUE}STEP 3: Uploading to Google Cloud Storage...:${RESET}
  for width in ${widths[@]}; do
    gsutil cp $outputpath-$width.$fileType $gsPath
    gsutil cp $outputpath-$width.webp $gsPath
    gsutil acl ch -u AllUsers:R $gsPath$basefilename-$width.$fileType
    gsutil acl ch -u AllUsers:R $gsPath$basefilename-$width.webp
  done
  echo '\n'
fi

finalFile="$cdnPath$basefilename"
echo ${BOLD_RED}ACTION: Copy/Paste YAML Figure Head:${RESET}
echo "
<figure aria-label=\"media\" role=\"group\" itemscope=\"\" itemprop=\"associatedMedia\" itemtype=\"http://schema.org/ImageObject\">
  <picture>
    <source srcset=\"$finalFile-640.webp 640w,
                    $finalFile-800.webp 800w,
                    $finalFile-1024.webp 1024w,
                    $finalFile-1280.webp 1280w,
                    $finalFile-1600.webp 1600w\"
            sizes=\"(min-width: 800px) 800px, 100vw\" type=\"image/webp\">
    <source srcset=\"$finalFile-640.$fileType 640w,
                    $finalFile-800.$fileType 800w,
                    $finalFile-1024.$fileType 1024w,
                    $finalFile-1280.$fileType 1280w,
                    $finalFile-1600.$fileType 1600w\"
            sizes=\"(min-width: 800px) 800px, 100vw\" type=\"image/$fileType\">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url(''data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\''http%3A//www.w3.org/2000/svg\'' xmlns%3Axlink=\''http%3A//www.w3.org/1999/xlink\'' viewBox=\''0 0 1280 853\''%3E%3Cfilter id=\''b\'' color-interpolation-filters=\''sRGB\''%3E%3CfeGaussianBlur stdDeviation=\''.5\''%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\''discrete\'' tableValues=\''1 1\''%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\''url(%23b)\'' x=\''0\'' y=\''0\'' height=\''100%25\'' width=\''100%25\'' xlink%3Ahref=\''data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\''%3E%3C/image%3E%3C/svg%3E'');"
      src=\"$finalFile-800.$fileType\" alt=\"\">
  </picture>
  <figcaption itemprop=\"caption description\">
    <span aria-hidden=\"true\"></span>
    <span class=\"author\" itemprop=\"copyrightHolder\"></span>
  </figcaption>
</figure>
"

echo ${BOLD_RED}ACTION: Copy/Paste #main:${RESET}
echo "
<figure aria-label=\"media\" role=\"group\" itemscope=\"\" itemprop=\"associatedMedia\" itemtype=\"http://schema.org/ImageObject\">
  <picture>
    <source srcset=\"$finalFile-640.webp 640w,
                    $finalFile-800.webp 800w,
                    $finalFile-1024.webp 1024w,
                    $finalFile-1280.webp 1280w,
                    $finalFile-1600.webp 1600w\"
            sizes=\"(min-width: 800px) 800px, 100vw\" type=\"image/webp\">
    <source srcset=\"$finalFile-640.$fileType 640w,
                    $finalFile-800.$fileType 800w,
                    $finalFile-1024.$fileType 1024w,
                    $finalFile-1280.$fileType 1280w,
                    $finalFile-1600.$fileType 1600w\"
            sizes=\"(min-width: 800px) 800px, 100vw\" type=\"image/$fileType\">
    <img decoding="async" loading="lazy" width="800" height="538"
      style="background-size: cover; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');"
      src=\"$finalFile-800.$fileType\" alt=\"\">
  </picture>
  <figcaption itemprop=\"caption description\">
    <span aria-hidden=\"true\"></span>
    <span class=\"author\" itemprop=\"copyrightHolder\"></span>
  </figcaption>
</figure>
"
