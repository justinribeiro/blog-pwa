import {PolymerElement} from '@polymer/polymer/polymer-element.js';

const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
 `<template>
   <style>
    :host {
      display: block;
    }

    .hotpink { color: var(--hotpink); }
    .red { color: var(--red); }

    iron-image {
      --iron-image-placeholder: {
        background: var(--img-background);
      };
    }

    a {
      color: var(--accent-color-primary);
      text-decoration: none;
      border-bottom: 1px solid var(--accent-color-primary);
    }

    a:hover {
      color: var(--accent-color-secondary);
      text-decoration: none;
      border-bottom: 1px solid var(--accent-color-secondary);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family:
      "DejaVu Sans", "Bitstream Vera Sans", "Segoe UI", "Lucida Grande", Verdana, Tahoma, Arial, sans-serif;      margin: 0;
    }

    p, li {
      font-family: Georgia, Palatino, "Palatino Linotype", Cambria, Times, "Times New Roman", serif;
      margin: 0;
      color: var(--primary-text-color);
    }

    h1 {
      font-size: 28px;
      margin-left: -1.75px;
      line-height: 1.15;
      letter-spacing: -.02em;
      font-weight: 700;
      font-style: normal;
      margin-top: 16px;
    }

    h2 {
      font-size: 24px;
      margin-left: -1.75px;
      line-height: 1.15;
      letter-spacing: -.02em;
      font-weight: 700;
      font-style: normal;
    }

    h3 {
      font-size: 20px;
      margin-left: -1.75px;
      line-height: 1.15;
      letter-spacing: -.02em;
      font-weight: 400;
      font-style: normal;
    }

    p, li {
      margin-top: 10px;
      margin-bottom: 29px;
      font-weight: 400;
      font-style: normal;
      font-size: 21px;
      line-height: 1.58;
      letter-spacing: -.003em;
    }

    li {
      margin-bottom: 20px;
    }

    /* Don't like this; special case. TODO extract */
    p code, li code {
      background-color: var(--code-background);
      font-size: 19px;
      color: var(--code-color);
      padding: 5px;
    }

    blockquote {
      border-left: 5px solid var(--accent-color-primary);
      padding-left: 10px;
      margin-left: 10px;
    }

    blockquote, blockquote p {
      font-style: oblique;
      font-weight: 400;
      font-size: 20px;
    }

    /* this is because of the offline loop */
    [hidden] {
      display: none !important;
    }
    [network-failed] {
      display: none !important;
    }

    /* Use these to generate skeleton blocks before content loads */
    hr {
      height: 20px;
      background-color: var(--structs-border);
      border: 0;
    }
    hr.short {
      width: 65%;
      margin-left: 0;
    }

    /*
      Design choice: in my components, I always have a #main as a container
      in my web components. Why isn't named container? No idea. LOL.
    */
    #main, #skeleton, #posts {
      margin: auto;
      padding: 0 20px;
      max-width: 800px;
    }

    #skeleton {
      min-height: 100vh;
    }

    /*
      This gets used a couple of places (iron-list, simple related dom-repeat)
    */
    .post-container {
      height: 125px;
      width: calc(50% - 5px);
    }

    .post-container a {
      color: initial;
      background-image: none;
      background-repeat: initial;
      background-position: initial;
    }

    .post-container a:hover {
      background-color: var(--accent-color-highlight);
    }

    .post-container a span {
      font-size: 14px;
      color: var(--accent-color-primary);
    }

    .post-container a h2 {
      font-weight: 400;
    }

    .post-container a h3 {
      font-weight: 200;
      text-transform: uppercase;
      font-size: 16px;
      color: var(--accent-color-secondary);
    }

    #main, #skeleton, blog-network-warning {
      padding-top: 135px;
    }

    @media (max-width: 767px) {
      #main, #skeleton, #posts {
        margin: auto;
        padding: 0 20px;
        max-width: 800px;
      }

      #main, #skeleton, blog-network-warning {
        padding-top: 100px;
      }

      p, li {
        font-size: 18px;
        line-height: 1.58;
        letter-spacing: -.004em;
      }

      .post-container {
        width: 100%;
      }
    }
   </style>
 </template>`;

styleElement.register('shared-styles');
