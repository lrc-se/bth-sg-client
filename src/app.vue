<template>
    <div id="app">
        <sg-login v-show="status != 'online'"></sg-login>
        <sg-game v-show="status == 'online'"></sg-game>
    </div>
</template>

<script>
    import Client from "./client";
    import SgLogin from "./components/sg-login";
    import SgGame from "./components/sg-game";
    
    export default {
        name: "app",
        
        data() {
            return {
                status: "offline"
            };
        },
        
        components: {
            "sg-login": SgLogin,
            "sg-game": SgGame
        },
        
        created() {
            Client.$on("offline", () => {
                this.status = "offline";
            });
            
            Client.$on("online", () => {
                this.status = "online";
            });
        },
        
        methods: {
            
        }
    };
</script>

<style>

</style>
