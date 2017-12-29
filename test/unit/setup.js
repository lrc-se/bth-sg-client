/**
 * Test bootstrap.
 */

"use strict";

require("browser-env")();

const hooks = require("require-extension-hooks");
hooks("vue").plugin("vue").push();
hooks(["vue", "js"]).plugin("babel").push();

require("vue").config.productionTip = false;
