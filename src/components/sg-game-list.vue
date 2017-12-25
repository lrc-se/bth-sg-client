<template>
    <div id="sg-game-list">
        <div v-if="error">{{ error }}</div>
        <table v-else>
            <tr><th>Namn</th><th>Spelare</th><th>Tidsfrist</th></tr>
            <tr class="sg-game-server" :class="{ selected: selectedIndex == idx }" v-for="game, idx of games" @click="select(idx)">
                <td>{{ game.name || "Spel #" + (idx + 1) }}</td>
                <td>{{ game.numPlayers }} / {{ game.maxPlayers }} ({{ game.minPlayers }}+)</td>
                <td>{{ game.timeout }} s</td>
            </tr>
        </table>
        <sg-button :text="(status == 'updating' ? 'Uppdaterar...' : 'Uppdatera')" :disabled="status == 'updating'" @click.native="update"></sg-button>
    </div>
</template>

<script>
    import axios from "axios";
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-game-list",
        
        data() {
            return {
                status: "idle",
                error: null,
                games: [],
                selectedIndex: -1
            };
        },
        
        components: {
            "sg-button": SgButton
        },
        
        created() {
            Client.$on("login", () => {
                this.getGames(true);
            });
            Client.$on("offline", this.update);
        },
        
        methods: {
            select(idx) {
                if (this.selectedIndex == idx) {
                    idx = -1;
                }
                this.selectedIndex = idx;
                this.$emit("selected", this.games[idx]);
            },
            
            update() {
                this.getGames();
            },
            
            getGames(first) {
                let vm = this;
                vm.status = "updating";
                axios.get(`${Client.baseUrl}:${Client.basePort}/api/games`).then(function(res) {
                    if (!res.data || !Array.isArray(res.data.data)) {
                        vm.games = [];
                        vm.error = "Servern är inte en giltig Skissa & Gissa-server.";
                        if (first) {
                            alert(vm.error);
                            Client.$emit("restart");
                        }
                    } else {
                        vm.games = res.data.data;
                        vm.error = null;
                        vm.select(-1);
                        Client.$emit("games");
                    }
                    vm.status = "idle";
                }).catch(function(err) {
                    if (err.response && err.response.status == 404) {
                        vm.error = "Servern är inte en giltig Skissa & Gissa-server.";
                    } else {
                        vm.error = "Kunde inte ansluta till servern.";
                    }
                    if (first) {
                        alert(vm.error);
                        Client.$emit("restart");
                    }
                    vm.status = "idle";
                });
            }
        }
    };
</script>

<style>
    #sg-game-list {
        height: 100px;
        overflow-y: auto;
    }
    
    #sg-game-list table {
        width: 100%;
        border-spacing: 0;
    }
    
    #sg-game-list th {
        font-weight: 700;
        text-align: left;
    }
    
    .sg-game-server {
        cursor: pointer;
    }
    
    .sg-game-server.selected {
        outline: 1px solid red;
    }
</style>
