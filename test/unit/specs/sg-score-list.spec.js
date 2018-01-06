/**
 * Score list component tests.
 */

"use strict";

const vtu = require("vue-test-utils");
const tap = require("tap");
const SgScoreList = require("../../../src/components/sg-score-list").default;


let scores = [
    { nick: "Jane Doe", points: 100, timestamp: 1515247014495 },
    { nick: "John Doe", points: 42, timestamp: 1514815049139 },
    { nick: "Leeroy Jenkins", points: 2, timestamp: 1514901449884 }
];


tap.test("Test initial view state", function(t) {
    let node = vtu.shallow(SgScoreList);
    
    t.same(node.vm.scores, [], "list is empty on init");
    t.false(node.contains("table"), "no table rendered");
    t.false(node.contains(".sg-message"), "no status message rendered");
    t.false(node.contains(".sg-error"), "no error message rendered");
    t.equal(
        node.find(".sg-table span").text(),
        "Inga resultat sparade ännu",
        "correct placeholder text rendered"
    );
    t.end();
});


tap.test("Test intermediate view states", function(t) {
    let node = vtu.shallow(SgScoreList);
    
    node.setData({ status: "updating" });
    t.true(node.contains(".sg-message"), "update status message rendered");
    t.false(node.contains(".sg-error"), "no error message rendered");
    
    node.setData({ status: "idle", error: "Test error" });
    t.equal(node.find(".sg-error").text(), "Test error", "correct error message rendered");
    t.false(node.contains(".sg-message"), "no status message rendered");
    
    t.end();
});


tap.test("Test score list", function(t) {
    let node = vtu.shallow(SgScoreList);
    
    node.setData({ scores });
    t.false(node.contains(".sg-message"), "no status message rendered");
    t.false(node.contains(".sg-error"), "no error message rendered");
    t.equal(node.findAll(".sg-score").length, 3, "correct number of table rows rendered");
    t.end();
});


tap.test("Test date formatter", function(t) {
    let node = vtu.shallow(SgScoreList);
    
    let timestamp = 1514901449157;
    t.equal(
        node.vm.formatDate(timestamp),
        "2018-01-02&nbsp;&nbsp;14:57:29",
        "correct date format rendered (with zero padding)"
    );
    
    timestamp = 1514124000886;
    t.equal(
        node.vm.formatDate(timestamp),
        "2017-12-24&nbsp;&nbsp;15:00:00",
        "correct date format rendered (without zero padding)"
    );
    t.end();
});
