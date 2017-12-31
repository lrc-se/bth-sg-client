<template>
    <div id="sg-login">
        <header>
            <h1>Skissa & Gissa</h1>
            <h2>{{ serverName }}</h2>
        </header>
        <form @submit.prevent="connect">
            <div>
                <label for="nick">Smeknamn:</label>
                <input id="nick" type="text" required autofocus v-model="nick">
                <sg-button :text="(status == 'connecting' ? 'Ansluter...' : 'Anslut')" :disabled="status == 'connecting' || !nick.trim() || !selectedGame"></sg-button>
                <sg-button text="Byt server" @click.native.prevent="restart"></sg-button>
            </div>
        </form>
        <h4>Välj spel</h4>
        <sg-game-list @selected="selectGame"></sg-game-list>
        <h4>Tio-i-topp</h4>
        <sg-score-list></sg-score-list>
    </div>
</template>

<script>
    import Client from "../client";
    import SgButton from "./sg-button";
    import SgGameList from "./sg-game-list";
    import SgScoreList from "./sg-score-list";
    
    export default {
        name: "sg-login",
        
        data() {
            return {
                status: "idle",
                serverName: "",
                nick: "",
                selectedGame: null
            };
        },
        
        components: {
            "sg-button": SgButton,
            "sg-game-list": SgGameList,
            "sg-score-list": SgScoreList
        },
        
        created() {
            Client.$on("login", (name) => {
                this.serverName = name;
            });
            Client.$on("online", this.reset);
            Client.$on("offline", this.reset);
        },
        
        methods: {
            selectGame(game) {
                this.selectedGame = game;
            },
            
            connect() {
                this.status = "connecting";
                Client.nick = this.nick.trim();
                Client.connect(this.selectedGame.port);
            },
            
            reset() {
                this.status = "idle";
            },
            
            restart() {
                this.reset();
                Client.$emit("restart");
            }
        }
    };
</script>

<style>

</style>
