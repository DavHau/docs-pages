# Docs
This repo builds the documentation for developer.holochain.org generated by 11ty (https://www.11ty.dev/).

## A note about browsers
Other than a warning to the user (see `unsupported-brower-warning.njk` if you care) ___no___ effort has been made to accommodate non-Evergreen browsers, which is mostly to say Internet Explorer of any version. There isn't a lot of js in the rendered site, but what there is won't work, and newer CSS features are used as well.

## What the heck is 11ty (an extremely quick intro)
11ty, or Eleventy, is a NodeJS based static website generator. It supports a bunch of template types,
including markdown and nunjucks (https://mozilla.github.io/nunjucks/) which we use here. By default any
template file in the input directory will generate an html file in the generated site. It also supports
includes and data generated content. It is extremely configurable and as such the docs (https://www.11ty.dev/docs/)
can be a handful, but they are quite good and are worth a look.

## How are we using 11ty
The 11ty config (.eleventy.js) is the final source of truth, but the basic setup is:
- The output goes to _site.
- Template files in `/src/pages` are transformed into html pages in the resulting site.
- Page templates can have embedded data called Front Matter in YAML format.
- `/src/pages/_includes` contains overall page layouts and helpers that can be called from the page template files
- `/src/pages/_data` contains files that provide data that can be consumed by the templates. See [Datafiles](./Datafiles.md) for details Uses:
    - Header Navigation
    - Contributors display
    - Community quotes display
    - Roadmap data
- `assets` and `client-side` are static assets that get copied to _site, via calls to 11ty's .addPassthroughCopy.
- `copy-to-root` (Not in place yet): sitemap.xml, robots.txt and _redirects (a Netlify config file with HTTP redirect _commands_).
Copied to _site by 11ty's addPassthroughCopy.
- Also see `Using Markdown Here` below.

## Other artifacts
- SCSS is compiled by sass via package.json script
- `/src/client-side` is Typescript code that is compiled by via package.json script. When building for production it is also bundled into a single script for broader browser support.

## Syntax highlighting
Syntax highlighting is applied server-side during the build process. The most popular highlighting tool for 11ty is [`syntaxhighlight`](https://www.11ty.dev/docs/plugins/syntaxhighlight/), which uses Prism.js for formatting. **We don't use this plugin.** Instead, we use a custom transform based on [`highlight.js`](https://highlightjs.org).

There are two reasons for this:

1. highlight.js supports a lot more languages both natively and through extensions, including Svelte, which is used heavily in the Get Started guide.
2. highlight.js also supports nested languages such as JavaScript and CSS inside HTML in a Svelte template.

[Here is a list](https://highlightjs.readthedocs.io/en/latest/supported-languages.html) of all supported languages. Use a value from the 'Aliases' column as a tag on your GitHub-style code fence, like so:

````text
```svelte
<main>
  {#if loading}
    <div>Loading...</div>
  {:else}
    <h1>Hello world!</h1>
    <p>The weather today will be {weather}.</p>
  {/if}
</main>
```
````

The tag will be added to the `<code>` element as a `language-<tag>` CSS class, along with a `hljs` tag. The surrounding `<pre>` element will also get a `hljs-container` class. We're using the `atom-one-light` theme that ships with highlight.js.

## Using Markdown Here
We are using a mixture of markdown and nunjucks as the main page templates. For documentation pages (as opposed to more blingy pages like the home page) md is preferred.

By default 11ty uses the [markdown-it](https://github.com/markdown-it/markdown-it) parser and we stuck with that.
Additionally the following `markdown-it` plugins have been added:
- [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) allows, in particular, attributes and classes to be added. For example:
  ```
  [Holochain Launcher](https://github.com/holochain/launcher){#my-link target=_blank .a-super-cool-link}
  ```
  renders as
  ```
  <a href="https://github.com/holochain/launcher" id="my-link" target="_blank" class="a-super-cool-link">Holochain Launcher</a>
  ```
  There are of course more details. See the docs at [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) for more.
- [markdown-it-container](https://github.com/markdown-it/markdown-it-container) Plugin for creating block-level custom containers. For example:
  ```
  ::: intro
  Blah blah
  :::
  ```

  renders as

  ```
  <div class="intro">
    <p>Blah blah</p>
  </div>
  ```
  Please note: The closing `:::` is required. Also if you need to nest containers then the outer container gets an additional `:`.
  Each container type needs to be configured in `markdown-it-config.js` for examples and to add more. This one provides a lot of flexibility.

## Site search and indexing
The site uses the [Pagefind](https://pagefind.app/) library to index the contents of the site and to find search results upon request.
The documentation is quite good. One thing to note; pages are indexed based on the inclusion of the `data-pagefind-body`
attribute on a page. It is included on all of the main pages (all but the Design System). If you need to remove some or all of a page
from indexing you can use the `data-pagefind-ignore` attribute. See (https://pagefind.app/docs/indexing/) for details.

## Setup for Dev
- `npm install`
- `npm run dev`
- open browser to http://localhost:8080/

## NPM Scripts of note
- `dev`: Runs 11ty & SCSS compile with browser reload.
- `build`: The Production build. Mostly used by CI/CD.
    - Cleans `_site` dir
    - Builds, [autoprefixes](https://github.com/postcss/autoprefixer) and minifies the SCSS
    - Bundles the JS modules
      - Builds the Typescript to JS
      - Minifies the JS with Terser
      - Saves the module to `_site/scripts/` dir
    - Builds 11ty with links to the bundled JS and minified CSS
- `clean`: Cleans out the `_site` dir
- `build:search-index`: builds the index files for the search function. This is called as pat of the build process, but if you want the search to work during local dev then you need to run this once, or you can just run `build` before you start the `dev` script.
- `update-browserlist`: Updates the browserlist that autoprefixer uses determine what vendor prefixes are needed for your specified browser set. Run once in a while.


