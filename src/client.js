/**
 * Client instance.
 */

"use strict";

import Vue from "vue";


let Client = null;
let conn = null;


/**
 * Starts handshake procedure with server.
 */
function startHandshake() {
    Client.status = "handshake";
}


/**
 * Handles disconnection event.
 *
 * @param   {object}    e   Event object.
 */
function handleDisconnection(e) {
    
}


/**
 * Handles incoming messages.
 *
 * @param   {object}    e   Event object.
 */
function handleMessage(e) {
    let data;
    try {
        data = JSON.parse(e.data);
    } catch (ex) {
        console.warn("Invalid message format:", e.data);
        return;
    }
    
    switch (Client.status) {
        case "handshake":
            handleHandshake(data);
            break;
        case "login":
            handleLogin(data);
            break;
        case "online":
            handleCommand(data);
            break;
    }
}


/**
 * Handles handshake messages.
 *
 * @param   {object}    data    Message data.
 */
function handleHandshake(data) {
    
}


/**
 * Handles login messages.
 *
 * @param   {object}    data    Message data.
 */
function handleLogin(data) {
    
}


/**
 * Handles received protocol command.
 *
 * @param   {object}    data    Command data.
 */
function handleCommand(data) {
    switch (data.cmd) {
        case "QUOTH":
            Client.$emit("msg", data.data);
            break;
        case "DOODLE":
            Client.$emit("draw", data.data);
            break;
        case "OOPS":
            Client.$emit("undo");
            break;
        default:
            console.warn("Unknown command:", data.cmd);
    }
}


/**
 * Sends a command to the server.
 *
 * @param   {string}    cmd     Name of command.
 * @param   {object}    [data]  Data payload, if any.
 */
function sendCmd(cmd, data) {
    if (conn && conn.readyState === WebSocket.OPEN) {
        conn.send(JSON.stringify({ cmd, data }));
    }
}


export default new Vue({
    data: {
        nick: "",
        status: "offline"
    },
    
    created() {
        Client = this;
    },
    
    methods: {
        connect(url) {
            if (!url.startsWith("ws://")) {
                url = "ws://" + url;
            }
            
            try {
                conn = new WebSocket(url);
            } catch (ex) {
                alert(
                    "Kunde inte öppna anslutningen." +
                    (ex.message ? "Felmeddelande: " + ex.message : "")
                );
                return;
            }
            
            this.status = "connect";
            conn.onopen = startHandshake;
            conn.onclose = handleDisconnection;
            conn.onmessage = handleMessage;
        },
        
        disconnect() {
            conn.close();
            this.status = "offline";
        }
    }
});
