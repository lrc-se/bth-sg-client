<template>
    <div id="sg-chat-roll">
        <div class="sg-chat-msg" :class="msg.type" v-for="msg of messages">
            <span class="sg-chat-nick" v-if="msg.nick">&lt;{{ msg.nick }}&gt;</span>
            <span>{{ msg.text }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "sg-chat-roll",
        
        props: ["messages"],
        
        updated() {
            this.$el.scrollTop = this.$el.scrollHeight;
        }
    };
</script>

<style>
    #sg-chat-roll {
        height: 100px;
        border: 1px solid #000;
        overflow-y: scroll;
    }
    
    .sg-chat-msg.notice {
        padding-left: .25em;
        font-weight: 700;
    }
    
    .sg-chat-msg.correct {
        color: #080;
    }
    
    .sg-chat-msg.timeout {
        color: #b00;
    }
</style>
