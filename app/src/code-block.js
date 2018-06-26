import '@polymer/polymer/polymer-legacy.js';
import '@polymer/prism-element/prism-highlighter.js';
import '@polymer/prism-element/prism-theme-default.js';
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {FlattenedNodesObserver} from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

Polymer({
  _template: html`
    <style include="prism-theme-default">
      pre {
        padding: 0;
        margin: 0;
      }

      code[class*="language-"],
      pre[class*="language-"] {
        font-family: Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace;
        font-size: 16px;
        line-height: 1.375;
        direction: ltr;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;

        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;

        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
        background: #faf8f5;
        color: #222222;
      }

      #hide {
        display: none !important;
      }
    </style>

    <prism-highlighter languages="[[languages]]"></prism-highlighter>
    <pre class="language-base"><code id="output"></code></pre>

    <div id="hide">
      <slot id="code"></slot>
    </div>
`,

  is: 'code-block',

  properties: {
    languages: Object,
  },

  ready: function() {
    // This is the short-list of langs on my blog (somewhere)
    // Ideally, I'd like to do this smarter with lazy-loaded lang sets based
    // on post data

    // perfect word: non-extended langs with simple patterns.
    this.languages = {
      'python': {'triple-quoted-string': {pattern: /"""[\s\S]+?"""|'''[\s\S]+?'''/, alias: 'string'}, 'comment': {pattern: /(^|[^\\])#.*/, lookbehind: !0}, 'string': {pattern: /("|')(?:\\\\|\\?[^\\\r\n])*?\1/, greedy: !0}, 'function': {pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g, lookbehind: !0}, 'class-name': {pattern: /(\bclass\s+)[a-z0-9_]+/i, lookbehind: !0}, 'keyword': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/, 'boolean': /\b(?:True|False)\b/, 'number': /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i, 'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/, 'punctuation': /[{}[\];(),.:]/},
      'docker': {keyword: {pattern: /(^\s*)(?:ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|LABEL|ENTRYPOINT)(?=\s)/im, lookbehind: !0}, string: /("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/, comment: /#.*/, punctuation: /---|\.\.\.|[:[\]{}\-,|>?]/},
      'json': {'property': /"(?:\\.|[^|"])*"(?=\s*:)/gi, 'string': /"(?!:)(?:\\.|[^|"])*"(?!:)/g, 'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?)\b/g, 'punctuation': /[{}[\]);,]/g, 'operator': /:/g, 'boolean': /\b(true|false)\b/gi, 'null': /\bnull\b/gi},
      'perl': {'comment': [{pattern: /(^\s*)=\w+[\s\S]*?=cut.*/m, lookbehind: !0}, {pattern: /(^|[^\\$])#.*/, lookbehind: !0}], 'string': [/\b(?:q|qq|qx|qw)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/, /\b(?:q|qq|qx|qw)\s+([a-zA-Z0-9])(?:[^\\]|\\[\s\S])*?\1/, /\b(?:q|qq|qx|qw)\s*\((?:[^()\\]|\\[\s\S])*\)/, /\b(?:q|qq|qx|qw)\s*\{(?:[^{}\\]|\\[\s\S])*\}/, /\b(?:q|qq|qx|qw)\s*\[(?:[^[\]\\]|\\[\s\S])*\]/, /\b(?:q|qq|qx|qw)\s*<(?:[^<>\\]|\\[\s\S])*>/, /("|`)(?:[^\\]|\\[\s\S])*?\1/, /'(?:[^'\\\r\n]|\\.)*'/], 'regex': [/\b(?:m|qr)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[msixpodualngc]*/, /\b(?:m|qr)\s+([a-zA-Z0-9])(?:[^\\]|\\.)*?\1[msixpodualngc]*/, /\b(?:m|qr)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngc]*/, /\b(?:m|qr)\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngc]*/, /\b(?:m|qr)\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngc]*/, /\b(?:m|qr)\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngc]*/, {pattern: /(^|[^-]\b)(?:s|tr|y)\s*([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\2(?:[^\\]|\\[\s\S])*?\2[msixpodualngcer]*/, lookbehind: !0}, {pattern: /(^|[^-]\b)(?:s|tr|y)\s+([a-zA-Z0-9])(?:[^\\]|\\[\s\S])*?\2(?:[^\\]|\\[\s\S])*?\2[msixpodualngcer]*/, lookbehind: !0}, {pattern: /(^|[^-]\b)(?:s|tr|y)\s*\((?:[^()\\]|\\[\s\S])*\)\s*\((?:[^()\\]|\\[\s\S])*\)[msixpodualngcer]*/, lookbehind: !0}, {pattern: /(^|[^-]\b)(?:s|tr|y)\s*\{(?:[^{}\\]|\\[\s\S])*\}\s*\{(?:[^{}\\]|\\[\s\S])*\}[msixpodualngcer]*/, lookbehind: !0}, {pattern: /(^|[^-]\b)(?:s|tr|y)\s*\[(?:[^[\]\\]|\\[\s\S])*\]\s*\[(?:[^[\]\\]|\\[\s\S])*\][msixpodualngcer]*/, lookbehind: !0}, {pattern: /(^|[^-]\b)(?:s|tr|y)\s*<(?:[^<>\\]|\\[\s\S])*>\s*<(?:[^<>\\]|\\[\s\S])*>[msixpodualngcer]*/, lookbehind: !0}, /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor|x)\b))/], 'variable': [/[&*$@%]\{\^[A-Z]+\}/, /[&*$@%]\^[A-Z_]/, /[&*$@%]#?(?=\{)/, /[&*$@%]#?((::)*'?(?!\d)[\w$]+)+(::)*/i, /[&*$@%]\d+/, /(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/], 'filehandle': {pattern: /<(?![<=])\S*>|\b_\b/, alias: 'symbol'}, 'vstring': {pattern: /v\d+(\.\d+)*|\d+(\.\d+){2,}/, alias: 'string'}, 'function': {pattern: /sub [a-z0-9_]+/i, inside: {keyword: /sub/}}, 'keyword': /\b(any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|say|state|sub|switch|undef|unless|until|use|when|while)\b/, 'number': /\b-?(0x[\dA-Fa-f](_?[\dA-Fa-f])*|0b[01](_?[01])*|(\d(_?\d)*)?\.?\d(_?\d)*([Ee][+-]?\d+)?)\b/, 'operator': /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(lt|gt|le|ge|eq|ne|cmp|not|and|or|xor)\b/, 'punctuation': /[{}[\];(),:]/},
    };

    // extended languages, which are a little more complicated
    Prism.languages.c=Prism.languages.extend('clike', {keyword: /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/, operator: /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/, number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i}), Prism.languages.insertBefore('c', 'string', {macro: {pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im, lookbehind: !0, alias: 'property', inside: {string: {pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/, lookbehind: !0}, directive: {pattern: /(#\s*)\b(define|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/, lookbehind: !0, alias: 'keyword'}}}, constant: /\b(__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|stdin|stdout|stderr)\b/}), delete Prism.languages.c['class-name'], delete Prism.languages.c['boolean'];

    Prism.languages.cpp=Prism.languages.extend('c', {'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/, 'boolean': /\b(true|false)\b/, 'operator': /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/}), Prism.languages.insertBefore('cpp', 'keyword', {'class-name': {pattern: /(class\s+)[a-z0-9_]+/i, lookbehind: !0}});

    Prism.languages.php = Prism.languages.extend('clike', {keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i, constant: /\b[A-Z0-9_]{2,}\b/, comment: {pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/, lookbehind: !0, greedy: !0}}), Prism.languages.insertBefore('php', 'class-name', {'shell-comment': {pattern: /(^|[^\\])#.*/, lookbehind: !0, alias: 'comment'}}), Prism.languages.insertBefore('php', 'keyword', {'delimiter': /\?>|<\?(?:php)?/i, 'variable': /\$\w+\b/i, 'package': {pattern: /(\\|namespace\s+|use\s+)[\w\\]+/, lookbehind: !0, inside: {punctuation: /\\/}}}), Prism.languages.insertBefore('php', 'operator', {property: {pattern: /(->)[\w]+/, lookbehind: !0}}), Prism.languages.markup&&(Prism.hooks.add('before-highlight', function(e) {
'php'===e.language&&(e.tokenStack=[], e.backupCode=e.code, e.code=e.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi, function(a) {
return e.tokenStack.push(a), '{{{PHP'+e.tokenStack.length+'}}}';
}));
}), Prism.hooks.add('before-insert', function(e) {
'php'===e.language&&(e.code=e.backupCode, delete e.backupCode)
;
}), Prism.hooks.add('after-highlight', function(e) {
if('php'===e.language) {
for(var a, n=0; a=e.tokenStack[n]; n++)e.highlightedCode=e.highlightedCode.replace('{{{PHP'+(n+1)+'}}}', Prism.highlight(a, e.grammar, 'php').replace(/\$/g, '$$$$')); e.element.innerHTML=e.highlightedCode;
}
}), Prism.hooks.add('wrap', function(e) {
'php'===e.language&&'markup'===e.type&&(e.content=e.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, '<span class="token php">$1</span>'));
}), Prism.languages.insertBefore('php', 'comment', {markup: {pattern: /<[^?]\/?(.*?)>/, inside: Prism.languages.markup}, php: /\{\{\{PHP[0-9]+\}\}\}/}));

    Prism.languages.java=Prism.languages.extend('clike', {keyword: /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/, number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+(?:e[+-]?\d+)?[df]?\b/i, operator: {pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m, lookbehind: !0}}), Prism.languages.insertBefore('java', 'function', {annotation: {alias: 'punctuation', pattern: /(^|[^.])@\w+/, lookbehind: !0}});

    !function(e) {
let t={variable: [{pattern: /\$?\(\([\w\W]+?\)\)/, inside: {variable: [{pattern: /(^\$\(\([\w\W]+)\)\)/, lookbehind: !0}, /^\$\(\(/], number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/, operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/, punctuation: /\(\(?|\)\)?|,|;/}}, {pattern: /\$\([^)]+\)|`[^`]+`/, inside: {variable: /^\$\(|^`|\)$|`$/}}, /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i]}; e.languages.bash={'shebang': {pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/, alias: 'important'}, 'comment': {pattern: /(^|[^"{\\])#.*/, lookbehind: !0}, 'string': [{pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g, lookbehind: !0, greedy: !0, inside: t}, {pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g, greedy: !0, inside: t}], 'variable': t.variable, 'function': {pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/, lookbehind: !0}, 'keyword': {pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/, lookbehind: !0}, 'boolean': {pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/, lookbehind: !0}, 'operator': /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/, 'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];]/}; let a=t.variable[1].inside; a['function']=e.languages.bash['function'], a.keyword=e.languages.bash.keyword, a.boolean=e.languages.bash.boolean, a.operator=e.languages.bash.operator, a.punctuation=e.languages.bash.punctuation
;
}(Prism);
  },

  attached: function() {
    const nodes = this.shadowRoot.querySelector('#code');
    this._observer = new FlattenedNodesObserver(nodes, this.render.bind(this));
  },

  render: function(info) {
    // In certain cases, I sometimes end up with multiple nodes,
    // in which case I "best guess" and combine them
    let codeCombined = '';
    for (let index = 0, len = info.addedNodes.length; index < len; ++index) {
      codeCombined += info.addedNodes[index].nodeValue;
    }

    // strip the lead/end newlines so we don't look horrible
    let codeClean = codeCombined.replace(/^\s+|\s+$/g, '');

    // Set to our styled block
    this.shadowRoot.querySelector('#output').innerHTML =
      this.highlight(codeClean, this.lang);
  },

  highlight: function(code, lang) {
    let test = this.fire('syntax-highlight', {code: code, lang: lang});
    return test.detail.code;
  },
});
