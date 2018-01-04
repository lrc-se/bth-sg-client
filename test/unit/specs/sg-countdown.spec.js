/**
 * Countdown component tests.
 */

"use strict";

const vtu = require("vue-test-utils");
const tap = require("tap");
const SgCountdown = require("../../../src/components/sg-countdown").default;


tap.test("Test minutes and seconds", function(t) {
    let node = vtu.shallow(SgCountdown, {
        propsData: {
            seconds: 227
        }
    });
    
    t.same(
        [node.vm.min, node.vm.sec],
        ["03", "47"],
        "correct values of minutes (1 digit) and seconds fields"
    );
    
    node.setProps({ seconds: 600 });
    t.same(
        [node.vm.min, node.vm.sec],
        ["10", "00"],
        "correct values of minutes (2 digits) and seconds fields"
    );
    
    t.end();
});


tap.test("Test seconds only", function(t) {
    let node = vtu.shallow(SgCountdown, {
        propsData: {
            seconds: 5
        }
    });
    
    t.same(
        [node.vm.min, node.vm.sec],
        ["00", "05"],
        "correct values of minutes and seconds fields"
    );
    t.end();
});


tap.test("Test idle state", function(t) {
    let node = vtu.shallow(SgCountdown, {
        propsData: {
            seconds: 0
        }
    });
    
    t.same(
        [node.vm.min, node.vm.sec],
        ["--", "--"],
        "correct values of minutes and seconds fields"
    );
    t.end();
});
