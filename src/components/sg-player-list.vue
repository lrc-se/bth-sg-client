<template>
    <div id="sg-player-list">
        <table>
            <tr><th>Spelare</th><th>Poäng</th></tr>
            <tr class="sg-player" v-for="player of players">
                <td>{{ player.nick }}</td>
                <td>{{ player.points }}</td>
            </tr>
        </table>
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

<style scoped>
    #sg-player-list {
        height: 100px;
        overflow-y: auto;
    }
    
    table {
        width: 100%;
        border-spacing: 0;
    }
    
    th {
        font-weight: 700;
        text-align: left;
    }
    
    th:last-child,
    td:last-child {
        text-align: right;
    }
</style>
