<template>
    <div id="sg-chat">
        <sg-chat-roll ref="chatRoll" :messages="messages"></sg-chat-roll>
        <sg-chat-form ref="chatForm"></sg-chat-form>
    </div>
</template>

<script>
    import Client from "../client";
    import SgChatRoll from "./sg-chat-roll";
    import SgChatForm from "./sg-chat-form";
    
    export default {
        name: "sg-chat",
        
        data() {
            return {
                messages: []
            };
        },
        
        components: {
            "sg-chat-roll": SgChatRoll,
            "sg-chat-form": SgChatForm
        },
        
        created() {
            Client.$on("msg", this.addMessage);
            
            Client.$on("online", () => {
                this.addNotice("* Välkommen till spelet!");
            });
            
            Client.$on("correct", (data) => {
                let word = data.word.toUpperCase();
                this.addNotice(
                    `* ${data.nick} gissade rätt! Det hemliga ordet var "${word}".`,
                    "correct"
                );
            });
            
            Client.$on("timeout", (word) => {
                this.addNotice(
                    `* Ingen lyckades gissa rätt! Det hemliga ordet var "${word.toUpperCase()}".`,
                    "timeout"
                );
            });
            
            Client.$on("join", (nick) => {
                this.addNotice(`* ${nick} har anslutit sig till spelet.`);
            });

            Client.$on("part", (nick) => {
                this.addNotice(`* ${nick} har lämnat spelet.`);
            });
            
            Client.$on("drawer", (nick) => {
                this.addNotice(
                    "* Det är " + (nick.endsWith("s") ? nick : nick + "s") + " tur att rita."
                );
            });
            
            Client.$on("word", (word) => {
                this.addNotice(
                    `* Det är din tur att rita! Det hemliga ordet är "${word.toUpperCase()}".`,
                    "word"
                );
            });
            
            Client.$on("pause", (word) => {
                this.addNotice("* Spelet är pausat i väntan på fler deltagare.");
            });
            
            Client.$on("offline", () => {
                this.messages = [];
            });
        },
        
        methods: {
            addMessage(message) {
                this.messages.push(message);
            },
            
            addNotice(text, type) {
                this.addMessage({
                    type: "notice" + (type ? ` ${type}` : ""),
                    nick: null,
                    text: text
                });
            }
        }
    };
</script>

<style>
    #sg-chat {
        margin-top: 1em;
    }
</style>
