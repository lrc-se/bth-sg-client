<template>
    <div id="app">
        <sg-connect v-show="panel == 'connect'"></sg-connect>
        <sg-login v-show="panel == 'login'"></sg-login>
        <sg-game v-show="panel == 'game'"></sg-game>
    </div>
</template>

<script>
    import Client from "./client";
    import SgConnect from "./components/sg-connect";
    import SgLogin from "./components/sg-login";
    import SgGame from "./components/sg-game";
    
    export default {
        name: "app",
        
        data() {
            return {
                panel: "connect"
            };
        },
        
        components: {
            "sg-connect": SgConnect,
            "sg-login": SgLogin,
            "sg-game": SgGame
        },
        
        created() {
            Client.$on("restart", this.showConnect);
            Client.$on("login", this.showLogin);
            Client.$on("offline", this.showLogin);
            Client.$on("online", this.showGame);
        },
        
        methods: {
            showConnect() {
                this.panel = "connect";
            },
            
            showLogin() {
                this.panel = "login";
            },
            
            showGame() {
                this.panel = "game";
            }
        }
    };
</script>

<style>
    #app {
        max-width: 1024px;
        margin: 0 auto;
        padding: 2em;
    }
</style>
