<template>
    <div id="sg-chat-form">
        <label>{{ nick }}</label>
        <input type="text" maxlength="200" v-model="message" @keyup.enter.prevent="sendMessage" @blur="refocus">
        <div><sg-button text="Skicka" @click.native="sendMessage"></sg-button></div>
    </div>
</template>

<script>
    import Vue from "vue";
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-chat-form",
        
        components: {
            "sg-button": SgButton
        },
        
        data() {
            return {
                message: ""
            };
        },
        
        computed: {
            nick() {
                return Client.nick;
            }
        },
        
        created() {
            Client.$on("online", this.refocus);
        },
        
        methods: {
            /**
             * Sends chat message to server.
             */
            sendMessage() {
                let msg = this.message.trim();
                if (msg) {
                    Client.emitAndSend("msg", {
                        type: "chat",
                        nick: Client.nick,
                        text: msg
                    });
                    this.message = "";
                }
            },
            
            
            /**
             * Returns focus to chat message input field, preserving scroll position.
             */
            refocus() {
                Vue.nextTick(() => {
                    let x = window.pageXOffset;
                    let y = window.pageYOffset;
                    this.$el.querySelector("input").focus();
                    window.scrollTo(x, y);
                });
            }
        }
    };
</script>

<style>
    #sg-chat-form {
        width: 100%;
        display: flex;
        align-items: center;
    }
    
    #sg-chat-form > input {
        max-width: none;
    }
    
    #sg-chat-form > div {
        flex-grow: 0;
    }
</style>
