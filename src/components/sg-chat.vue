<template>
    <div id="sg-chat">
        <sg-chat-roll :messages="messages"></sg-chat-roll>
        <sg-chat-form></sg-chat-form>
    </div>
</template>

<script>
    import Client from "../client";
    import SgChatRoll from "./sg-chat-roll";
    import SgChatForm from "./sg-chat-form";
    
    export default {
        name: "sg-chat",
        
        components: {
            "sg-chat-roll": SgChatRoll,
            "sg-chat-form": SgChatForm
        },
        
        data() {
            return {
                messages: []
            };
        },
        
        created() {
            // new chat message received
            Client.$on("msg", this.addMessage);
            
            // successful login announced
            Client.$on("online", () => {
                this.addNotice("* Välkommen till spelet!");
            });
            
            // correct guess announced
            Client.$on("correct", (data) => {
                let word = data.word.toUpperCase();
                this.addNotice(
                    `* ${data.nick} gissade rätt! Det hemliga ordet var "${word}".`,
                    "correct"
                );
            });
            
            // timeout announced
            Client.$on("timeout", (word) => {
                this.addNotice(
                    `* Ingen lyckades gissa rätt! Det hemliga ordet var "${word.toUpperCase()}".`,
                    "timeout"
                );
            });
            
            // player entrance announced
            Client.$on("join", (nick) => {
                this.addNotice(`* ${nick} har anslutit sig till spelet.`);
            });
            
            // player departure announced
            Client.$on("part", (nick) => {
                this.addNotice(`* ${nick} har lämnat spelet.`);
            });
            
            // new drawer announced
            Client.$on("drawer", (nick) => {
                this.addNotice(
                    "* Det är " + (nick.endsWith("s") ? nick : nick + "s") + " tur att rita."
                );
            });
            
            // new word announced
            Client.$on("word", (word) => {
                this.addNotice(
                    `* Det är din tur att rita! Det hemliga ordet är "${word.toUpperCase()}".`,
                    "word"
                );
            });
            
            // game paused
            Client.$on("pause", (word) => {
                this.addNotice("* Spelet är pausat i väntan på fler deltagare.");
            });
            
            // disconnection from game
            Client.$on("offline", () => {
                this.messages = [];
            });
        },
        
        methods: {
            /**
             * Adds a message to chat roll.
             *
             * @param   {object}    message     Message object.
             */
            addMessage(message) {
                this.messages.push(message);
            },
            
            
            /**
             * Adds a notice message to chat roll.
             *
             * @param   {string}    text    Notice text.
             * @param   {string}    [type]  Notice type.
             */
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
