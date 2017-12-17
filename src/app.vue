<template>
    <div id="app">
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
            
            // temp
            Client.nick = "John Doe" + Math.floor(Math.random() * 100);
            Client.connect("ws://localhost:1701");
        },
        
        methods: {
            undo() {
                if (this.drawer !== Client.nick) {
                    return;
                }
                Client.emitAndSend("undo");
            },
            
            clearBoard() {
                if (this.drawer !== Client.nick) {
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
