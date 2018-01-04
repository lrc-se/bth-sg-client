<template>
    <div id="sg-chat-form">
        <input type="text" v-model="message" @keyup.enter.prevent="sendMessage" @blur="refocus">
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
        
        created() {
            Client.$on("online", this.refocus);
        },
        
        methods: {
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
    }
    
    #sg-chat-form > input {
        max-width: none;
    }
    
    #sg-chat-form > div {
        flex-grow: 0;
    }
</style>
