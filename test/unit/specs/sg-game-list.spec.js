/**
 * Game list component tests.
 */

"use strict";

const vtu = require("vue-test-utils");
const tap = require("tap");
const SgGameList = require("../../../src/components/sg-game-list").default;


let games = [
    { name: "Game #1", port: 1701, numPlayers: 0, minPlayers: 2, maxPlayers: 10, timeout: 60 },
    { name: "game no. 2", port: 1702, numPlayers: 3, minPlayers: 2, maxPlayers: 12, timeout: 30 },
    { name: "", port: 1703, numPlayers: 7, minPlayers: 5, maxPlayers: 8, timeout: 47 }
];


tap.test("Test initial view state", function(t) {
    let node = vtu.shallow(SgGameList);
    
    t.same(node.vm.games, [], "list is empty on init");
    t.equal(node.vm.selectedIndex, -1, "no game selected on init");
    t.false(node.contains("table"), "no table rendered");
    t.false(node.contains(".sg-message"), "no status message rendered");
    t.false(node.contains(".sg-error"), "no error message rendered");
    t.equal(
        node.find(".sg-table span").text(),
        "Inga pågående spel",
        "correct placeholder text rendered"
    );
    t.end();
});


tap.test("Test intermediate view states", function(t) {
    let node = vtu.shallow(SgGameList);

    node.setData({ status: "updating" });
    t.true(node.contains(".sg-message"), "update status message rendered");
    t.false(node.contains(".sg-error"), "no error message rendered");
    
    node.setData({ status: "idle", error: "Test error" });
    t.equal(node.find(".sg-error").text(), "Test error", "correct error message rendered");
    t.false(node.contains(".sg-message"), "no status message rendered");

    t.end();
});


tap.test("Test game list", function(t) {
    let node = vtu.shallow(SgGameList);

    node.setData({ games });
    t.false(node.contains(".sg-message"), "no status message rendered");
    t.false(node.contains(".sg-error"), "no error message rendered");
    t.equal(node.findAll(".sg-game-server").length, 3, "correct number of table rows rendered");
    t.equal(
        node.find(".sg-game-server:last-child td:first-child").text(),
        "Spel #3",
        "correct placeholder rendered for missing name"
    );
    t.end();
});


tap.test("Test game selection", function(t) {
    let node = vtu.shallow(SgGameList);

    node.setData({ games });
    let row = node.find(".sg-game-server:nth-last-child(2)");
    row.trigger("click");
    t.notEqual(row.classes().indexOf("selected"), -1, "correct game selected");
    
    let evnt = node.emitted().selected;
    t.equal(evnt.length, 1, "correct event emitted for selection");
    t.equal(evnt[0][0].timeout, games[1].timeout, "correct game object passed to event handler");
    
    row.trigger("click");
    t.equal(row.classes().indexOf("selected"), -1, "selected game deselected");
    t.equal(evnt.length, 2, "correct event emitted for deselection");
    t.false(evnt[1][0], "no game object passed to event handler");
    
    t.end();
});
