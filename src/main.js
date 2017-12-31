import Vue from "vue";
import App from "./app";

Vue.config.productionTip = false;

require("./css/common.css");

new Vue({
    el: "#app",
    render: h => h(App)
});
