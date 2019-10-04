---
title: "Visual Studio Code extension update for LitElement snippets and new Pack available"
description: "LitElement and Polymer Snippets gets a bump to v2.0.0 and the initial release of a LitElement Extension pack lands in the marketplace."
date: 2019-09-26T08:31:54-07:00
tags:
- Development
- Web
- VSCode
---

After some delay, I've gotten around to releasing v2.0.0 of [LitElement, Polymer v2 / v3, and Web Components Snippets for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=justinribeiro.Polymer2Snippets). This includes some significant retooling around the LitElement shortcuts which were painfully lacking. This now includes shortcuts like:

{{< codeblock lang="bash" >}}
l-element                 // LitElement Web Component definition (alias p-lit-element)
l-render-html             // LitElement render() with html literal
l-render-svg              // LitElement render() with svg literal
l-firstRendered           // LitElement firstRender()
l-properties              // Lit-Element properties by implementing a static properties getter
l-get-styles              // Lit-Element styles in a static styles property
l-get-styles-super        // Lit-Element static styles property with super class
l-firstUpdated            // Lit-Element firstUpdated()
l-shouldUpdate            // Lit-Element shouldUpdate()
l-requestUpdate           // Lit-Element requestUpdate()
l-updateComplete          // Lit-Element await this.updateComplete;
{{< /codeblock >}}

In addition to this update, I've released a new extension pack, [LitElement Web Components Extension Pack](https://marketplace.visualstudio.com/items?itemName=justinribeiro.litelement-web-components-extension-pack). This pack includes some mainstays like [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin) and my snippets extension, but also includes a fair amount of tooling plugins, such as ESLint and Import Cost among others.

It's a light pack to say the least, but it hopefully simplifies a lot of things for developers just getting started with LitElement.
