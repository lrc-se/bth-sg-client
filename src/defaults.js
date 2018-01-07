/**
 * Defaults.
 */

"use strict";

import axios from "axios";


// timeout for AJAX requests
axios.defaults.timeout = 10000;

export default {
    // default server address
    server: document.location.protocol + "//" + document.location.hostname,
    
    // default server port
    port: 1700,
    
    // contact info
    contact: {
        //title: "John Doe",
        //email: "test@example.com",
        //website: "http://www.example.com/"
    }
};
