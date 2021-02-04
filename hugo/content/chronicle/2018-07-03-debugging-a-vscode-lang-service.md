---
date: 2018-07-03T08:00:00-08:00
title: "How to debug a custom language service plugin for VS Code"
description: "10 steps, three builds, and a cup of coffee later and we're debugging some language server action in VS Code."
socialimage: "https://storage.googleapis.com/jdr-public-imgs/blog/20180073-vscode-langdebug-twitter-1024x535.jpg"
tags:
- Web
---

With a little time on my hands before the next project started, I was certain I could implemenet a few features like CSS quickfix and intellisense into [typescript-lit-html-plugin](https://github.com/Microsoft/typescript-lit-html-plugin). This was going to require debugging the language service, and given the issue ticket title ["Debugging Language Service in VS Code" documentation is weird](https://github.com/Microsoft/TypeScript/issues/19254), I didn't have the highest of hopes for a smooth experience, but in reality I was up and running with very little hiccup.

Let's walk the steps shall we?

1. Download stable VS Code for your platform. You're going to need this to do the debugging of your language service code.
2. Clone the VS Code repo. You'll need this to run the language server in so that we can debug it from our stable VS Code.
{{< codeblock lang="bash" >}}
$ git clone git@github.com:Microsoft/vscode.git
{{< /codeblock >}}
3. It's time to build VS Cod. You'll need a tools for the build chain. Some you likely already have (git, python 2.7x, yarn, node 8), some you may not (C/C++ compiler tool chain, libsecret). I'm running Ubuntu, so I've simplified from the [wiki](https://github.com/Microsoft/vscode/wiki/How-to-Contribute):
{{< codeblock lang="bash" >}}
$ apt install build-essential libx11-dev libxkbfile-dev libsecret-1-dev
$ cd vscode
$ yarn
$ yarn run watch
# open new terminal
$ ./scripts/code.sh
{{< /codeblock >}}
At this point, you should have a build of VS Code running! If not, check for build errors.
4. Clone the TypeScript repo.
{{< codeblock lang="bash" >}}
$ git clone git@github.com:Microsoft/TypeScript.git
{{< /codeblock >}}
5. It's time to build TypeScript.
{{< codeblock lang="bash" >}}
$ yarn global add jake
$ cd TypeScript
$ yarn
$ jake local
{{< /codeblock >}}
6. You're doing great! Now in the VS Code instance you built, edit the user settings to point at the version of TypeScript your just built:
{{< codeblock lang="javascript" >}}
{
   "typescript.tsdk": "/path/to/TypeScript-build/built/local"
}
{{< /codeblock >}}
7. Once you're updated the user settings with the path to the TypeScript server, shutdown your built copy of VS Code and head back to the command line where it was running. Now, we're going to set an env variable called `TSS_DEBUG` and restart our built of VS Code.
{{< codeblock lang="bash" >}}
$ export TSS_DEBUG = 5888
$ ./scripts/code.sh
{{< /codeblock >}}
8. You're so close now. In stable VS Code, open your language server project. You need a `launch.json` that can attach to the TypeScript server that your built that is now running in the version of VS Code you built. So we add one:
{{< codeblock lang="javascript" >}}
{
    "version": "0.1.0",
    "configurations": [
        {
            "name": "Attach to TypeScript Server",
            "type": "node",
            "request": "launch",
            "protocol": "inspector",
            "port": 5888,
            "sourceMaps": true,
            "outFiles": ["/path/to/TypeScript-build/built/local"],
            "runtimeArgs": [
                 "--inspect=5888"
            ]
        }
    ]
}
{{< /codeblock >}}
This will now let us bind and debug!
9. In the version of VS Code you built open a folder with a typescript file or other code that you want to debug against. You can now set breakpoints, attach to the TypeScript server through Debug [F5], and walk your code.
10. Note, in the case of the `typescript-lit-html-plugin`, I tell VS Code that is should be using the plugin by defining it within `tsconfig.json`:
{{< codeblock lang="javascript" >}}
{
    "compilerOptions": {
        "noImplicitAny": true,
        "plugins": [
            {
                "name": "/work/src/typescript-lit-html-plugin/lib"
            },

        ]
    }
}
{{< /codeblock >}}

Viola! We have debugging take off.

<img decoding="async" loading="lazy" width="800" height="538" style="background-size: cover;
          background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http%3A//www.w3.org/2000/svg\' xmlns%3Axlink=\'http%3A//www.w3.org/1999/xlink\' viewBox=\'0 0 1280 853\'%3E%3Cfilter id=\'b\' color-interpolation-filters=\'sRGB\'%3E%3CfeGaussianBlur stdDeviation=\'.5\'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'discrete\' tableValues=\'1 1\'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter=\'url(%23b)\' x=\'0\' y=\'0\' height=\'100%25\' width=\'100%25\' xlink%3Ahref=\'data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII=\'%3E%3C/image%3E%3C/svg%3E');" src="https://storage.googleapis.com/jdr-public-imgs/blog/ss-2018-07-03-800-lang-server-debug.png" alt="Sample of debugging a language service plugin in VS Code">

Pretty straight forward. For additional information, do take a look at the [docs](https://github.com/Microsoft/TypeScript/wiki/Debugging-Language-Service-in-VS-Code), which provide some additional context and methods for different debugging senarios.