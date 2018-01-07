<template>
    <div id="sg-login">
        <h2>{{ serverName }}</h2>
        <form @submit.prevent="connect">
            <div>
                <label for="sg-connect-nick">Smeknamn:</label>
                <input id="sg-connect-nick" type="text" maxlength="20" required autofocus v-model="nick">
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
        
        components: {
            "sg-button": SgButton,
            "sg-game-list": SgGameList,
            "sg-score-list": SgScoreList
        },
        
        data() {
            return {
                status: "idle",
                serverName: "",
                nick: "",
                selectedGame: null
            };
        },
        
        created() {
            // successful login announced
            Client.$on("login", (name) => {
                this.serverName = name;
            });
            
            Client.$on(["online", "offline"], this.reset);
        },
        
        methods: {
            /**
             * Selects a game.
             *
             * @param   {object}    game    Game info object.
             */
            selectGame(game) {
                this.selectedGame = game;
            },
            
            
            /**
             * Connects to a game.
             */
            connect() {
                let nick = this.nick.trim();
                
                // safety checks
                if (!this.selectedGame || !nick) {
                    return;
                }
                if (nick.length > 20) {
                    alert("Smeknamnet får vara högst 20 tecken långt.");
                    return;
                }
                
                // connect
                this.status = "connecting";
                Client.nick = nick;
                Client.connect(this.selectedGame.port);
            },
            
            
            /**
             * Resets view state.
             */
            reset() {
                this.status = "idle";
            },
            
            
            /**
             * Returns to connection panel.
             */
            restart() {
                this.reset();
                Client.$emit("restart");
            }
        }
    };
</script>

<style>
    #sg-login form {
        text-align: center;
    }
    
    #sg-connect-nick {
        width: 200px;
    }
</style>
