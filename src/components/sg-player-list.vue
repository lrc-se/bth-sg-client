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
            Client.$on("players", (players) => {
                players.sort((a, b) => b.points - a.points);
                this.players = players;
            });
        }
    };
</script>

<style>
    
</style>
