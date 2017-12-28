/**
 * Button component tests.
 */

"use strict";

const setup = require("../setup");

const vtu = require("vue-test-utils");
const tap = require("tap");
const SgButton = setup.loadComponent("sg-button");


tap.test("Test text button", function(t) {
    let node = vtu.shallow(SgButton, {
        propsData: {
            text: "test!!"
        }
    });
    
    t.true(node.is("button"), "root element is button");
    t.equal(node.find("span").text(), "test!!", "correct text rendered");
    t.false(node.contains("img"), "no icon rendered");
    t.end();
});


tap.test("Test color button", function(t) {
    let node = vtu.shallow(SgButton, {
        propsData: {
            bgColor: "#f00"
        }
    });
    
    t.equal(node.find("span").text(), "", "empty text rendered");
    t.true(node.hasStyle("background-color", "#f00"), "correct background color applied");
    t.end();
});
