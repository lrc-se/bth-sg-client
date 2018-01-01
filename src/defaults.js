/**
 * Defaults.
 */

"use strict";

import axios from "axios";


axios.defaults.timeout = 15000;

export default {
    server: document.location.protocol + "//" + document.location.hostname,
    port: 1700
};
