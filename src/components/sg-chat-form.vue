<template>
    <div id="sg-chat-form">
        Meddelande: <input type="text" v-model="message" @keyup.enter.prevent="sendMessage">
        <input type="button" value="Skicka" @click="sendMessage">
    </div>
</template>

<script>
    import Client from "../client";
    
    export default {
        name: "sg-chat-form",
        
        data() {
            return {
                message: ""
            };
        },
        
        methods: {
            sendMessage() {
                if (this.message) {
                    Client.emitAndSend("msg", {
                        type: "chat",
                        nick: Client.nick,
                        text: this.message
                    });
                    this.message = "";
                }
            }
        }
    };
</script>

<style>
    
</style>
