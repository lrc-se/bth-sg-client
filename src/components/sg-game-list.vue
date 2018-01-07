<template>
    <div class="sg-game-list">
        <div class="sg-table">
            <div class="sg-message" v-if="status == 'updating'">Uppdaterar...</div>
            <div class="sg-error" v-if="error">{{ error }}</div>
            <table v-if="games.length && status == 'idle' && !error">
                <tr><th>Namn</th><th>Spelare</th><th>Tidsfrist</th></tr>
                <tr class="sg-game-server" :class="{ selected: selectedIndex == idx }" v-for="game, idx of games" @click="select(idx)">
                    <td>{{ game.name || "Spel #" + (idx + 1) }}</td>
                    <td>{{ game.numPlayers }} / {{ game.maxPlayers }} ({{ game.minPlayers }}+)</td>
                    <td>{{ game.timeout }} s</td>
                </tr>
            </table>
            <span v-if="!games.length && status == 'idle' && !error">Inga pågående spel</span>
        </div>
        <div class="right">
            <sg-button :text="(status == 'updating' ? 'Uppdaterar...' : 'Uppdatera')" :disabled="status == 'updating'" @click.native="update"></sg-button>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-game-list",
        
        components: {
            "sg-button": SgButton
        },
        
        data() {
            return {
                status: "idle",
                error: null,
                games: [],
                selectedIndex: -1
            };
        },
        
        created() {
            Client.$on(["login", "offline"], this.update);
        },
        
        methods: {
            /**
             * Selects a game from the list.
             *
             * @param   {number}    idx     Row index.
             */
            select(idx) {
                if (this.selectedIndex == idx) {
                    idx = -1;
                }
                this.selectedIndex = idx;
                this.$emit("selected", this.games[idx]);
            },
            
            
            /**
             * Updates game info from server.
             */
            update() {
                let vm = this;
                vm.status = "updating";
                vm.error = null;
                axios.get(`${Client.baseUrl}:${Client.basePort}/api/games`).then(function(res) {
                    if (!res.data || !Array.isArray(res.data.data)) {
                        vm.games = [];
                        vm.error = "Servern är inte en giltig Skissa & Gissa-server.";
                    } else {
                        vm.games = res.data.data;
                        vm.error = null;
                        vm.select(-1);
                    }
                    vm.status = "idle";
                }).catch(function(err) {
                    if (err.response && err.response.status == 404) {
                        vm.error = "Servern är inte en giltig Skissa & Gissa-server.";
                    } else {
                        vm.error = "Kunde inte ansluta till servern.";
                    }
                    vm.status = "idle";
                });
            }
        }
    };
</script>

<style>
    .sg-game-list .sg-table {
        max-height: 7em;
    }
    
    .sg-game-list .sg-table th:first-child,
    .sg-game-list .sg-table td:first-child {
        width: 50%;
    }
    
    .sg-game-server {
        cursor: pointer;
    }
    
    .sg-game-server.selected {
        background-color: #eeece9;
    }
</style>
