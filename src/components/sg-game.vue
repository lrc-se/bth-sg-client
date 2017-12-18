<template>
    <div id="sg-game">
        <header>
            <div id="drawer">Nu ritar: <strong>{{ drawer || "–" }}</strong></div>
            <div id="word">Ord att rita: <strong>{{ word }}</strong></div>
            <sg-countdown :seconds="seconds"></sg-countdown>
        </header>
        <sg-board ref="board" :draw-type="drawType" :draw-width="drawWidth" :draw-color="drawColor"></sg-board>
        <div>
            <sg-button :icon="`${tool}.png`" :selected="drawType == tool" @click.native="drawType = tool" v-for="tool of tools" :key="tool"></sg-button>
        </div>
        <div>
            <sg-button :bg-color="color" :selected="drawColor == color" @click.native="drawColor = color" v-for="color of colors" :key="color"></sg-button>
        </div>
        <div>
            Linjebredd: <input type="range" min="1" max="10" v-model="drawWidth">
        </div>
        <div>
            <sg-button text="Ångra" :disabled="!word" @click.native="undo"></sg-button>
            <sg-button text="Rensa" :disabled="!word" @click.native="clearBoard"></sg-button>
        </div>
        <div>
            Meddelanden
            <sg-chat></sg-chat>
        </div>
        <div>
            <sg-player-list></sg-player-list>
        </div>
        <sg-button text="Lämna spelet" @click.native="disconnect"></sg-button>
    </div>
</template>

<script>
    import Client from "../client";
    import SgCountdown from "./sg-countdown";
    import SgBoard from "./sg-board";
    import SgButton from "./sg-button";
    import SgChat from "./sg-chat";
    import SgPlayerList from "./sg-player-list";
    
    export default {
        name: "sg-game",
        
        data() {
            return {
                drawType: "path",
                drawWidth: 2,
                drawColor: "#000",
                drawer: null,
                word: null,
                seconds: null,
                tools: ["path", "line", "rect", "frect", "oval", "foval"],
                colors: [
                    "#000",
                    "#888",
                    "#fff",
                    "#f00",
                    "#0f0",
                    "#00f",
                    "#800",
                    "#080",
                    "#008",
                    "#ff0",
                    "#0ff",
                    "#f0f",
                    "#880",
                    "#088",
                    "#808"
                ],
                timer: null
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
                this.word = null;
                this.drawer = name;
            });
            
            Client.$on("word", (word) => {
                this.word = word.toUpperCase();
                this.drawer = Client.nick;
            });
            
            Client.$on("countdown", (sec) => {
                this.seconds = sec;
                this.timer = setInterval(this.tick, 1000);
            });
            
            Client.$on("correct", this.pause);
            Client.$on("timeout", this.pause);
            Client.$on("pause", this.pause);
        },
        
        methods: {
            undo() {
                if (!this.word) {
                    return;
                }
                Client.emitAndSend("undo");
            },
            
            clearBoard() {
                if (!this.word) {
                    return;
                }
                if (confirm("Är du säker på att du vill rensa ritytan?")) {
                    Client.emitAndSend("clear");
                }
            },
            
            tick() {
                if (this.seconds > 0) {
                    this.seconds -= 1;
                } else {
                    this.pause();
                }
            },
            
            pause() {
                clearInterval(this.timer);
                this.seconds = null;
                this.word = null;
            },
            
            disconnect() {
                if (confirm("Är du säker på att du vill lämna spelet?")) {
                    Client.disconnect();
                }
            }
        }
    };
</script>

<style>
    #sg-game {
        width: 804px;
    }
    
    #sg-game header {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>
