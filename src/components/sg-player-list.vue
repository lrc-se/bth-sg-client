<template>
    <div class="sg-player-list">
        <div class="sg-table">
            <table>
                <tr><th>Spelare</th><th>Poäng</th></tr>
                <tr class="sg-player" v-for="player of players">
                    <td>{{ player.nick }}</td>
                    <td>{{ player.points }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import Client from "../client";
    
    export default {
        name: "sg-player-list",
        
        data() {
            return {
                players: []
            };
        },
        
        created() {
            // new player list received
            Client.$on("players", (players) => {
                // sort by highest score
                players.sort((a, b) => b.points - a.points);
                this.players = players;
            });
        }
    };
</script>

<style>
    .sg-player-list {
        height: 10.5em;
        margin-bottom: 1em;
        overflow-y: auto;
    }
</style>
