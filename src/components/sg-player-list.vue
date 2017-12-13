<template>
    <div id="sg-player-list">
        <div id="sg-player-list-head">
            <span>Spelare</span>
            <span>Poäng</span>
        </div>
        <div id="sg-players">
            <div class="sg-player" v-for="player of players">
                <span>{{ player.nick }}</span>
                <span>{{ player.points }}</span>
            </div>
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
    #sg-player-list-head {
        font-weight: 700;
    }
    
    #sg-player-list-head,
    .sg-player {
        display: flex;
    }
    
    #sg-player-list-head > span:last-child,
    .sg-player > span:last-child {
        margin-left: auto;
        text-align: right;
    }

    #sg-players {
        height: 100px;
        border: 1px solid #000;
        overflow-y: scroll;
    }
</style>
