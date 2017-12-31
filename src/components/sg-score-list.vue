<template>
    <div class="sg-score-list">
        <div class="sg-table">
            <div class="sg-message" v-if="status == 'updating'">Uppdaterar...</div>
            <div class="sg-error" v-if="error">{{ error }}</div>
            <table v-if="status == 'idle' && !error">
                <tr><th>Spelare</th><th>Poäng</th><th>Tidpunkt</th></tr>
                <tr class="sg-score" v-for="score of scores">
                    <td>{{ score.nick }}</td>
                    <td>{{ score.score }}</td>
                    <td>{{ formatDate(score.timestamp) }}</td>
                </tr>
            </table>
        </div>
         <sg-button :text="(status == 'updating' ? 'Uppdaterar...' : 'Uppdatera')" :disabled="status == 'updating'" @click.native="update"></sg-button>
    </div>
</template>

<script>
    import axios from "axios";
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-score-list",
        
        data() {
            return {
                status: "idle",
                error: null,
                scores: []
            };
        },
        
        components: {
            "sg-button": SgButton
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
                let day = date.getDate();
                let time = date.toTimeString().substring(0, 8);
                if (month < 10) {
                    month = `0${month}`;
                }
                if (day < 10) {
                    day = `0${day}`;
                }
                return `${year}-${month}-${day} ${time}`;
            }
        }
    };
</script>

<style>
    .sg-score-list .sg-table th:first-child,
    .sg-score-list .sg-table td:first-child {
        width: 50%;
    }
</style>
