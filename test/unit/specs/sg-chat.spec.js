/**
 * Chat component tests.
 */

"use strict";

const Vue = require("vue");
const vtu = require("vue-test-utils");
const tap = require("tap");
const Client = require("../../../src/client").default;
const SgChat = require("../../../src/components/sg-chat").default;
const SgChatRoll = require("../../../src/components/sg-chat-roll").default;
const SgChatForm = require("../../../src/components/sg-chat-form").default;


tap.test("Test standard chat message", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    
    t.same(node.vm.messages, [], "list is empty on init");
    t.equal(chatRoll.findAll(".sg-chat-msg").length, 0, "chat roll is empty on init");
    
    let msg = {
        type: "chat",
        nick: "John Doe",
        text: "o hai!"
    };
    Client.$once("msg", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                msg,
                "correct message received"
            );
            t.same(
                [
                    chatRoll.findAll(".sg-chat-msg").length,
                    entry.find(".sg-chat-nick").text(),
                    entry.find("span:last-child").text()
                ],
                [1, `<${msg.nick}>`, msg.text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "chat"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("msg", msg);
});


tap.test("Test welcome notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    
    Client.$once("online", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = "# Välkommen till spelet!";
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("online");
});


tap.test("Test correct guess notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    let data = { word: "TEST", nick: "Jane Doe" };
    
    Client.$once("correct", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = `# ${data.nick} gissade rätt! Det hemliga ordet var "${data.word}".`;
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice correct", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice", "correct"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("correct", data);
});


tap.test("Test timeout notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    let word = "FOOBAR";
    
    Client.$once("timeout", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = `# Ingen lyckades gissa rätt! Det hemliga ordet var "${word}".`;
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice timeout", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice", "timeout"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("timeout", word);
});


tap.test("Test join notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    let nick = "Jane Doe";
    
    Client.$once("join", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = `# ${nick} har anslutit sig till spelet.`;
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("join", nick);
});


tap.test("Test part notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    let nick = "Jane Doe";
    
    Client.$once("part", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = `# ${nick} har lämnat spelet.`;
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("part", nick);
});


tap.test("Test drawer notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    let nick1 = "Jane Doe";
    let nick2 = "John Does";
    let counter = 0;
    
    Client.$on("drawer", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[counter];
            let entry = chatRoll.findAll(".sg-chat-msg").at(counter);
            let genitive = (counter == 0 ? nick1 + "s" : nick2);
            let extra = "nickname " + (counter == 0 ? "not " : "") + "ending with 's'";
            let text = `# Det är ${genitive} tur att rita.`;
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice", nick: null, text: text },
                `correct message received (${extra})`
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [counter + 1, text],
                `correct entry added to chat roll (${extra})`
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice"],
                "correct CSS classes applied to entry in chat roll"
            );
            
            if (counter++ == 0) {
                Client.$emit("drawer", nick2);
            } else {
                Client.$off("drawer");
                t.end();
            }
        });
    });
    Client.$emit("drawer", nick1);
});


tap.test("Test secret word notice", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    let word = "SUPERCALIFRAGILISTICEXPIALIDOCIOUS";
    
    Client.$once("word", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = `# Det är din tur att rita! Det hemliga ordet är "${word}".`;
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice word", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice", "word"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.end();
        });
    });
    Client.$emit("word", word);
});


tap.test("Test pause notice and reset event", function(t) {
    let node = vtu.shallow(SgChat, {
        stubs: { "sg-chat-roll": SgChatRoll }
    });
    let chatRoll = node.find("#sg-chat-roll");
    
    Client.$once("pause", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            let text = "# Spelet är pausat i väntan på fler deltagare.";
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "notice", nick: null, text: text },
                "correct message received"
            );
            t.same(
                [chatRoll.findAll(".sg-chat-msg").length, entry.text()],
                [1, text],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "notice"],
                "correct CSS classes applied to entry in chat roll"
            );
            Client.$emit("offline");
        });
    });
    Client.$once("offline", function() {
        Vue.nextTick(function() {
            t.same(node.vm.messages, [], "list is empty after reset");
            t.equal(chatRoll.findAll(".sg-chat-msg").length, 0, "chat roll is empty after reset");
            t.end();
        });
    });
    Client.$emit("pause");
});


tap.test("Test chat form", function(t) {
    let node = vtu.mount(SgChat);
    let chatRoll = node.find("#sg-chat-roll");
    let chatForm = node.find(SgChatForm);
    let nick = "John Doe";
    let msg = "kthxbye...";
    
    Client.nick = nick;
    Vue.nextTick(function() {
        t.equal(chatForm.find("label").text(), nick, "correct nickname label rendered");
        
        chatForm.setData({ message: msg });
        t.equal(chatForm.find("input").element.value, msg, "form field data binding works");
        chatForm.find(".sg-button").trigger("click");
    });
    
    Client.$once("msg", function() {
        Vue.nextTick(function() {
            let message = node.vm.messages[0];
            let entry = chatRoll.find(".sg-chat-msg");
            t.same(
                { type: message.type, nick: message.nick, text: message.text },
                { type: "chat", nick: nick, text: msg },
                "correct message event emitted and received locally"
            );
            t.same(
                [
                    chatRoll.findAll(".sg-chat-msg").length,
                    entry.find(".sg-chat-nick").text(),
                    entry.find("span:last-child").text()
                ],
                [1, `<${nick}>`, msg],
                "correct entry added to chat roll"
            );
            t.same(
                entry.classes(),
                ["sg-chat-msg", "chat"],
                "correct CSS classes applied to entry in chat roll"
            );
            t.equal(chatForm.vm.message, "", "message data property cleared after send");
            t.equal(chatForm.find("input").element.value, "", "form field cleared after send");
            t.end();
        });
    });
});
