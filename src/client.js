/**
 * Client instance.
 */

"use strict";

import Vue from "vue";


// events for incoming commands
const commandEvents = {
    DOODLE: "draw",
    GOTIT: "correct",
    ITSABUST: "timeout",
    OOPS: "undo",
    PEEKABOO: "join",
    POSSE: "players",
    QUOTH: "msg",
    SCRAP: "clear",
    SHUTEYE: "pause",
    SKEDADDLE: "part",
    THEYREIT: "drawer",
    TMINUS: "countdown",
    YOUREIT: "word"
};

// commands for outgoing events
const eventCommands = {
    clear: "SCRAP",
    draw: "DOODLE",
    msg: "QUOTH",
    undo: "OOPS"
};


let Client = null;
let conn = null;


/**
 * Starts handshake procedure with server.
 */
function startHandshake() {
    Client.status = "handshake";
    sendCommand("HOWDY");
}


/**
 * Handles disconnection event.
 */
function handleDisconnection() {
    if (Client.status == "online") {
        alert("Kontakten med servern har förlorats och spelet stängs därför ner.");
    }
    Client.status = "offline";
    Client.$emit("offline");
    conn = null;
}


/**
 * Handles connection errors.
 */
function handleError() {
    if (Client.status == "connect") {
        alert("Kunde inte ansluta till servern.");
    }
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
        default:
            // NOOP
    }
}


/**
 * Handles handshake messages.
 *
 * @param   {object}    data    Message data.
 */
function handleHandshake(data) {
    if (data.cmd == "GDAYMATE") {
        Client.status = "login";
        sendCommand("LEMMEIN", Client.nick);
    } else {
        Client.disconnect("Felaktigt serversvar vid anslutning.");
    }
}


/**
 * Handles login messages.
 *
 * @param   {object}    data    Message data.
 */
function handleLogin(data) {
    switch (data.cmd) {
        case "CMONIN":
            Client.status = "online";
            Client.$emit("online");
            break;
        case "DOPPELGANGER":
            Client.disconnect("Smeknamnet är upptaget.");
            break;
        case "FULLHOUSE":
            Client.disconnect("Spelet är fullt.");
            break;
        default:
            Client.disconnect("Felaktigt serversvar vid anslutning.");
    }
}


/**
 * Handles received protocol command.
 *
 * @param   {object}    data    Command data.
 */
function handleCommand(data) {
    if (commandEvents[data.cmd]) {
        Client.$emit(commandEvents[data.cmd], data.data);
    } else {
        console.warn("Unknown command:", data.cmd);
    }
}


/**
 * Sends a command to the server.
 *
 * @param   {string}    cmd     Name of command.
 * @param   {object}    [data]  Data payload, if any.
 */
function sendCommand(cmd, data) {
    if (conn && conn.readyState === WebSocket.OPEN) {
        conn.send(JSON.stringify({ cmd, data }));
    }
}


export default new Vue({
    data: {
        nick: "",
        baseUrl: "",
        basePort: 0,
        status: "offline",
        isDrawing: false
    },
    
    created() {
        Client = this;
    },
    
    methods: {
        /**
         * Connects to an S&G game server using internal base URL.
         *
         * @param   {number}    port    Game server port.
         */
        connect(port) {
            this.status = "connect";
            let url = "ws://" + this.baseUrl.replace(/^https?:\/\//, "") + ":" + port;
            conn = new WebSocket(url);
            conn.onerror = handleError;
            conn.onopen = startHandshake;
            conn.onclose = handleDisconnection;
            conn.onmessage = handleMessage;
        },
        
        
        /**
         * Disconnects from the S&G server.
         *
         * @param   {String}    [msg]   Message to display to user, if any.
         */
        disconnect(msg) {
            sendCommand("SEEYA");
            this.status = "offline";
            this.$emit("offline");
            conn.close();
            conn = null;
            
            if (msg) {
                alert(msg);
            }
        },
        
        
        /**
         * Sends a protocol command to server.
         *
         * @param   {String}    evnt    Name of the event to send command for.
         * @param   {object}    [data]  Data payload, if any.
         */
        send(evnt, data) {
            if (eventCommands[evnt]) {
                sendCommand(eventCommands[evnt], data);
            }
        },
        
        
        /**
         * Emits an internal event and sends the corresponding protocol command to server.
         *
         * @param   {String}    evnt    Name of the event.
         * @param   {object}    [data]  Data payload, if any.
         */
        emitAndSend(evnt, data) {
            this.$emit(evnt, data);
            this.send(evnt, data);
        }
    }
});
