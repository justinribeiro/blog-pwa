#!/bin/zsh
#
# A list of build instructions and future tools to fork
#

# setup the world
rm -rf build
mkdir -p build/temp
mkdir -p build/default/src
mkdir build/default/node_modules
mkdir build/default/node_modules/prismjs

# copy code-block deps for Prism for the pretty colors
cp -r node_modules/prismjs/components build/default/node_modules/prismjs

# copy base details
cp index.html build/default
cp robots.txt build/default
cp app.webmanifest build/default
cp -r data/ build/default
cp -r helpers/ build/default

# copy temp representation of the source; we only need this for the JS/CSS
cp -r src/ build/temp

# Minify all the CSS prior to the module build in place
yarn lightningcss --minify --bundle src/css/dev.css -o build/temp/src/css/dev.css
yarn lightningcss --minify --bundle src/css/page.css -o build/temp/src/css/page.css
yarn lightningcss --minify --bundle src/css/entry.css -o build/temp/src/css/entry.css
yarn lightningcss --minify --bundle src/css/element.css -o build/temp/src/css/element.css

# Build the PWA
yarn rollup -c

# Minify all the HTML
yarn html-minifier-next --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-attribute-quotes --remove-tag-whitespace --remove-optional-tags --output build/default/index.html build/default/index.html
yarn html-minifier-next --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-attribute-quotes --remove-tag-whitespace --remove-optional-tags --output build/default/sw-shell.html build/default/helpers/sw-shell.html
yarn html-minifier-next --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-attribute-quotes --remove-tag-whitespace --remove-optional-tags --output build/default/helpers/static.html build/default/helpers/static.html

# Replace the dev JS entry point with the build artifact
find build/default/src -name 'blog-pwa-*.js' -exec basename {} \; | xargs -I {} sed -i 's#js/blog/blog-pwa.js#{}#g' build/default/index.html
find build/default/src -name 'blog-pwa-*.js' -exec basename {} \; | xargs -I {} sed -i 's#js/blog/blog-pwa.js#{}#g' build/default/sw-shell.html

# Replace the @imports with the built CSS for speed
sed -i "s/@import '.\/src\/css\/dev.css';/$(<build/temp/src/css/dev.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/index.html
sed -i "s/@import '.\/src\/css\/page.css';/$(<build/temp/src/css/page.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/index.html
sed -i "s/@import '.\/src\/css\/entry.css';/$(<build/temp/src/css/entry.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/index.html
sed -i "s/@import '.\/src\/css\/dev.css';/$(<build/temp/src/css/dev.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/sw-shell.html
sed -i "s/@import '.\/src\/css\/dev.css';/$(<build/temp/src/css/dev.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/helpers/static.html
sed -i "s/@import '.\/src\/css\/page.css';/$(<build/temp/src/css/page.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/helpers/static.html
sed -i "s/@import '.\/src\/css\/entry.css';/$(<build/temp/src/css/entry.css sed -e 's/[\&/]/\\&/g' -e 's/$/\\n/' | tr -d '\n')/g" build/default/helpers/static.html

# Build the service worker
yarn workbox generateSW workbox-config.cjs