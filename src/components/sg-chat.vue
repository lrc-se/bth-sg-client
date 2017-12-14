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
            
            Client.$on("correct", (data) => {
                let word = data.word.toUpperCase();
                this.addServerMessage(
                    `* ${data.nick} gissade rätt! Det hemliga ordet var "${word}".`,
                    "correct"
                );
            });
            
            Client.$on("timeout", (word) => {
                this.addServerMessage(
                    `* Ingen lyckades gissa rätt! Det hemliga ordet var "${word.toUpperCase()}".`,
                    "timeout"
                );
            });
            
            Client.$on("join", (nick) => {
                this.addServerMessage(`* ${nick} har anslutit sig till spelet.`);
            });

            Client.$on("part", (nick) => {
                this.addServerMessage(`* ${nick} har lämnat spelet.`);
            });
            
            Client.$on("drawer", (nick) => {
                this.addServerMessage(
                    "* Det är " + (nick.endsWith("s") ? nick : nick + "s") + " tur att rita."
                );
            });
            
            Client.$on("word", (word) => {
                this.addServerMessage(
                    `* Det är din tur att rita! Det hemliga ordet är "${word.toUpperCase()}".`
                );
            });
            
            Client.$on("pause", (word) => {
                this.addServerMessage("* Spelet är pausat i väntan på fler deltagare.");
            });
        },
        
        methods: {
            addMessage(message) {
                this.messages.push(message);
            },
            
            addServerMessage(text, type) {
                this.addMessage({
                    type: type || "server",
                    nick: null,
                    text: text
                });
            }
        }
    };
</script>

<style>
    
</style>
