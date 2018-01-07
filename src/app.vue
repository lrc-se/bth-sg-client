<template>
    <div id="app">
        <header>
            <h1>Skissa &amp; Gissa</h1>
        </header>
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
        
        components: {
            "sg-connect": SgConnect,
            "sg-login": SgLogin,
            "sg-game": SgGame
        },
        
        data() {
            return {
                panel: "connect"
            };
        },
        
        created() {
            Client.$on("restart", this.showConnect);
            Client.$on(["login", "offline"], this.showLogin);
            Client.$on("online", this.showGame);
        },
        
        methods: {
            /**
             * Switches to connection panel.
             */
            showConnect() {
                this.panel = "connect";
            },
            
            
            /**
             * Switches to login panel.
             */
            showLogin() {
                this.panel = "login";
            },
            
            
            /**
             * Switches to game panel.
             */
            showGame() {
                this.panel = "game";
            }
        }
    };
</script>

<style>
    #app {
        margin: auto;
        padding: 2em;
    }
</style>
