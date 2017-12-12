<template>
    <div id="sg-chat">
        <sg-chat-roll ref="chatRoll" :messages="messages"></sg-chat-roll>
        <sg-chat-form ref="chatForm"></sg-chat-form>
    </div>
</template>

<script>
    import Dispatcher from "../dispatcher";
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
            Dispatcher.$on("msg", this.addMessage);
        },
        
        methods: {
            addMessage(message) {
                this.messages.push(message);
            }
        }
    };
</script>

<style>
    
</style>
