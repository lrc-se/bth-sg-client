/**
 * Player list component tests.
 */

"use strict";

const Vue = require("vue");
const vtu = require("vue-test-utils");
const tap = require("tap");
const Client = require("../../../src/client").default;
const SgPlayerList = require("../../../src/components/sg-player-list").default;


let player1 = { nick: "Jane Doe", points: 5 };
let player2 = { nick: "John Doe", points: 10 };


tap.test("Test event response", function(t) {
    let node = vtu.mount(SgPlayerList);
    
    t.same(node.vm.players, [], "list is empty on init");
    t.equal(node.findAll(".sg-player").length, 0, "table is empty on init");
    
    Client.$once("players", function() {
        Vue.nextTick(function() {
            t.same([
                { nick: node.vm.players[0].nick, points: node.vm.players[0].points },
                { nick: node.vm.players[1].nick, points: node.vm.players[1].points }
            ], [player2, player1], "correctly sorted list populated");
            t.equal(node.findAll(".sg-player").length, 2, "correct number of rows in table");
            t.end();
        });
    });
    Client.$emit("players", [player1, player2]);
});
