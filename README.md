# DrupalPack

This module provides a starter pack for building sophisticated front end applications in Drupal 7. It has 
the following features:

* ES2015 Transpilation with Babel
* SCSS compilation
* Support for Vue 
* Hot module reloading
* Component level front end assets for Drupal

## Installation

To install it simply copy the contents of `./starter/` to the root of your Drupal site and configure
`local.config.js`. Make sure to read through the copy of this file in the starter directory, as it provides
some basic instructions/examples to get started.

## Usage

To use the tool you need to first make sure  `pulic://webpack/` is installed and properly configured:

**NOTE: All these commands are run from the root of the Drupal install**

```bash
mkdir -p sites/default/files/webpack
```
Once you have verified the installation of the public files folder for the webpack assets you can install the nodeN
packages required for building/deving.

```bash
npm install
```

After the installation of the Node dependencies you are ready to configure your local webpack settings found in
`local.config.js`. This is a simple process that involves:

* Determine which themes and modules will have their assets managed by webpack
* Configure the proxy server for hot reloading

Configuration of the project assets to be managed by webpack is as simple as entering static assets paths
(the keys in the `drupalPaths` entry). And the source path (i.e. the path from the Drupal root, to the root folder
of the project you'd like to manage). The webpack job is setup to recursively search for both .SCSS, and .JS files
so entering the path to the project itself is all that's required. Here's what managing a custom theme and module
might look like:

```javascript
{
  drupalPaths: {
    'theme/my_custom_theme' : './sites/all/themes/custom/my_custom_theme',
    'module/my_custom_module': './sites/all/modules/custom/my_custom_module'
  }
}
```

It's *that* simple.

## Front End Usage

### Per Component Assets
DrupalPack automatically scans for compiled JS/CSS files which match any `theme_hook_suggestions` for a given template.
This means that we can automatically decompose our script and style resources *per component*. When architected correctly,
the result is a dramatic reduction in unused assets. To leverage this functionality, simply match the name of a
`theme_hook_suggestion` with the name of a CSS/JS output file from webpack, examples:

* Load a particular JS file for all views-exposed-forms: `./sites/all/modules/custom/my_custom_module/views-exposed-form.js`
* Load a particular CSS file for all views-exposed-forms: `./sites/all/modules/custom/my_custom_module/views-exposed-form.scss`

### Global Assets
By default, any file named `index.js` in your project will be included on every page. It is important to make sure
any assets in these files are genuinely used on every page.