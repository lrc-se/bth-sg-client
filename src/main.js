/**
 * Application startup.
 */

"use strict";

import Vue from "vue";
import App from "./app";


// import general stylesheet
require("./css/common.css");

// launch application
Vue.config.productionTip = false;
new Vue({
    el: "#app",
    render: h => h(App)
});
