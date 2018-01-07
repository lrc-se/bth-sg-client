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
            // scroll to bottom
            this.$el.scrollTop = this.$el.scrollHeight;
        }
    };
</script>

<style>
    #sg-chat-roll {
        height: 7em;
        margin-bottom: 1em;
        padding: .25em;
        background-color: #fff;
        border: 1px solid #33312e;
        border-radius: 2px;
        overflow-y: scroll;
        cursor: text;
    }
    
    .sg-chat-msg.notice {
        padding-left: .125em;
        font-weight: 800;
    }
    
    .sg-chat-msg.correct {
        color: #090;
    }
    
    .sg-chat-msg.timeout {
        color: #c00;
    }
    
    .sg-chat-msg.word {
        color: #00b;
    }
</style>
