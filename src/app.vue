<template>
    <div id="app">
        <header>
            <div id="drawer">Nu ritar: <strong>{{ drawer || "–" }}</strong></div>
            <div id="word">Ord att rita: <strong>{{ word }}</strong></div>
            <sg-countdown :seconds="seconds"></sg-countdown>
        </header>
        <sg-board ref="board" :draw-type="drawType" :draw-width="drawWidth"></sg-board>
        <div>
            <sg-button text="Pensel" :selected="drawType == 'path'" @click.native="drawType = 'path'"></sg-button>
            <sg-button text="Linje" :selected="drawType == 'line'" @click.native="drawType = 'line'"></sg-button>
            <sg-button text="Rektangel" :selected="drawType == 'rect'" @click.native="drawType = 'rect'"></sg-button>
            <sg-button text="Fylld rektangel" :selected="drawType == 'frect'" @click.native="drawType = 'frect'"></sg-button>
            <sg-button text="Oval" :selected="drawType == 'oval'" @click.native="drawType = 'oval'"></sg-button>
            <sg-button text="Fylld oval" :selected="drawType == 'foval'" @click.native="drawType = 'foval'"></sg-button>
        </div>
        <div>
            Linjebredd: <input type="range" min="1" max="10" v-model="drawWidth">
        </div>
        <div>
            <sg-button text="Ångra" @click.native="undo"></sg-button>
            <sg-button text="Rensa" @click.native="clearBoard"></sg-button>
        </div>
        <div>
            Meddelanden
            <sg-chat></sg-chat>
        </div>
        <div>
            <sg-player-list></sg-player-list>
        </div>
    </div>
</template>

<script>
    import Client from "./client";
    import SgCountdown from "./components/sg-countdown";
    import SgBoard from "./components/sg-board";
    import SgButton from "./components/sg-button";
    import SgChat from "./components/sg-chat";
    import SgPlayerList from "./components/sg-player-list";
    
    export default {
        name: "app",
        
        data() {
            return {
                drawType: "path",
                drawWidth: 2,
                drawer: null,
                word: null,
                seconds: null
            };
        },
        
        components: {
            "sg-countdown": SgCountdown,
            "sg-board": SgBoard,
            "sg-button": SgButton,
            "sg-chat": SgChat,
            "sg-player-list": SgPlayerList
        },
        
        created() {
            Client.$on("drawer", (name) => {
                this.drawer = name;
            });
            
            Client.$on("word", (word) => {
                this.word = word.toUpperCase();
                this.drawer = Client.nick;
            });
            
            Client.$on("countdown", (sec) => {
                this.seconds = sec;
            });
            
            // temp
            Client.nick = "John Doe";
            setTimeout(() => {
                Client.$emit("word", "foobar");
            }, 2000);
        },
        
        methods: {
            undo() {
                Client.emitAndSend("undo");
            },
            
            clearBoard() {
                if (confirm("Är du säker på att du vill rensa ritytan?")) {
                    Client.emitAndSend("clear");
                }
            }
        }
    };
</script>

<style>
    #app {
        width: 804px;
    }
    
    header {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>
