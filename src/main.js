/**
 * Application startup.
 */

"use strict";

import Vue from "vue";
import App from "./app";

require("./css/common.css");


Vue.config.productionTip = false;

new Vue({
    el: "#app",
    render: h => h(App)
});
