<template>
    <div class="sg-score-list">
        <div class="sg-table">
            <div class="sg-message" v-if="status == 'updating'">Uppdaterar...</div>
            <div class="sg-error" v-if="error">{{ error }}</div>
            <table v-if="scores.length && status == 'idle' && !error">
                <tr><th>Spelare</th><th>Poäng</th><th>Tidpunkt</th></tr>
                <tr class="sg-score" v-for="score of scores" v-if="scores.length">
                    <td>{{ score.nick }}</td>
                    <td>{{ score.score }}</td>
                    <td v-html="formatDate(score.timestamp)"></td>
                </tr>
            </table>
            <span v-if="!scores.length && status == 'idle' && !error">Inga resultat sparade ännu</span>
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
        name: "sg-score-list",
        
        components: {
            "sg-button": SgButton
        },
        
        data() {
            return {
                status: "idle",
                error: null,
                scores: []
            };
        },
        
        created() {
            Client.$on("login", this.update);
            Client.$on("offline", this.update);
        },
        
        methods: {
            update() {
                let vm = this;
                vm.status = "updating";
                vm.error = null;
                axios.get(`${Client.baseUrl}:${Client.basePort}/api/scores`).then(function(res) {
                    if (res.data.error) {
                        vm.scores = [];
                        vm.error = res.data.error;
                    } else if (Array.isArray(res.data.data)) {
                        vm.scores = res.data.data;
                        vm.error = null;
                    } else {
                        vm.scores = [];
                        vm.error = "Servern är inte en giltig Skissa & Gissa-server.";
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
            },
            
            formatDate(timestamp) {
                let date = new Date(timestamp);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                let day = date.getDate();
                if (day < 10) {
                    day = "0" + day;
                }
                let time = date.toTimeString().substring(0, 8);
                return `${year}-${month}-${day}&nbsp;&nbsp;${time}`;
            }
        }
    };
</script>

<style>
    .sg-game-list .sg-table {
        max-height: 14em;
    }
    
    .sg-score-list .sg-table th:first-child,
    .sg-score-list .sg-table td:first-child {
        width: 50%;
    }
</style>
