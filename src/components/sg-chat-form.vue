<template>
    <form id="sg-chat-form" @submit.prevent>
        Meddelande: <input type="text" v-model="message" @keyup.enter.prevent="sendMessage">
        <input type="button" value="Skicka" @click="sendMessage">
    </form>
</template>

<script>
    import Dispatcher from "../dispatcher";
    
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
                    Dispatcher.$emit("msg", {
                        type: "chat",
                        nick: "test",
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
