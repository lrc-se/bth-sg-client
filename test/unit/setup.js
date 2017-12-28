/**
 * Test bootstrap.
 */

"use strict";

require("browser-env")();

const hooks = require("require-extension-hooks");
hooks("vue").plugin("vue").push();
hooks(["vue", "js"]).plugin("babel").push();


module.exports = {
    loadComponent(name) {
        return require(`../../src/components/${name}.vue`).default;
    }
};
