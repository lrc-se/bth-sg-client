<template>
    <div id="sg-game">
        <div id="sg-game-left">
            <div id="sg-game-header">
                <div id="sg-drawer"><strong>Nu ritar:</strong> {{ drawer || "–" }}</div>
                <div id="sg-word" :class="{ drawing: !!word }"><strong>Ord att rita:</strong> <span>{{ word || "–" }}</span></div>
                <sg-countdown :seconds="seconds"></sg-countdown>
            </div>
            <sg-board :draw-type="drawType" :draw-width="drawWidth" :draw-color="drawColor"></sg-board>
            <sg-chat></sg-chat>
        </div>
        <div id="sg-game-right">
            <div>
                <label class="line">Ritverktyg:</label>
                <sg-button :icon="`${tool}.png`" :selected="drawType == tool" @click.native="drawType = tool" v-for="tool of tools" :key="tool"></sg-button>
            </div>
            <div>
                <label class="line">Färg:</label>
                <sg-button :bg-color="color" :selected="drawColor == color" @click.native="drawColor = color" v-for="color of colors" :key="color"></sg-button>
            </div>
            <div>
                <label class="line">Linjebredd:</label>
                <input id="sg-game-draw-width" type="range" min="1" max="10" v-model="drawWidth">
            </div>
            <br>
            <div>
                <sg-button text="Ångra" :disabled="!word" @click.native="undo"></sg-button>
                <sg-button text="Rensa rityta" :disabled="!word" @click.native="clearBoard"></sg-button>
            </div>
            <sg-player-list></sg-player-list>
            <div class="right"><sg-button text="Lämna spelet" @click.native="disconnect"></sg-button></div>
        </div>
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
        
        components: {
            "sg-button": SgButton,
            "sg-countdown": SgCountdown,
            "sg-board": SgBoard,
            "sg-chat": SgChat,
            "sg-player-list": SgPlayerList
        },
        
        data() {
            return {
                drawType: "path",
                drawWidth: 2,
                drawColor: "#000",
                drawer: null,
                word: null,
                seconds: null,
                timer: null,
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
                ]
            };
        },
        
        created() {
            // new drawer announced
            Client.$on("drawer", (name) => {
                this.word = null;
                this.drawer = name;
            });
            
            // new word announced
            Client.$on("word", (word) => {
                this.word = word.toUpperCase();
                this.drawer = Client.nick;
            });
            
            // new countdown announced
            Client.$on("countdown", (sec) => {
                clearInterval(this.timer);
                this.seconds = sec;
                this.timer = setInterval(this.tick, 1000);
            });
            
            // player departure announced
            Client.$on("part", (nick) => {
                if (this.drawer === nick) {
                    this.reset();
                }
            });
            
            Client.$on(["correct", "timeout", "pause", "offline", "game"], this.reset);
        },
        
        methods: {
            /**
             * Undoes the latest shape drawn.
             */
            undo() {
                if (!this.word) {
                    return;
                }
                Client.emitAndSend("undo");
            },
            
            
            /**
             * Clears the drawing board.
             */
            clearBoard() {
                if (!this.word) {
                    return;
                }
                if (confirm("Är du säker på att du vill rensa ritytan?")) {
                    Client.emitAndSend("clear");
                }
            },
            
            
            /**
             * Executes a countdown tick.
             */
            tick() {
                if (this.seconds > 0) {
                    this.seconds -= 1;
                } else {
                    clearInterval(this.timer);
                }
            },
            
            
            /**
             * Resets view state.
             */
            reset() {
                clearInterval(this.timer);
                this.drawer = null;
                this.word = null;
                this.seconds = null;
            },
            
            
            /**
             * Disconnect from the game.
             */
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
        width: 928px;
        margin-top: -1em;
        display: flex;
    }
    
    #sg-game-left,
    #sg-game-right {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 0;
    }
    
    #sg-game-left > *,
    #sg-game-right > * {
        width: 100%;
    }
    
    #sg-game-left {
        max-width: 644px;
    }
    
    #sg-game-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    
    #sg-game-right {
        margin-left: 2em;
    }
    
    #sg-game-right .sg-player-list,
    #sg-game-right > div:last-child {
        margin-top: auto;
    }
    
    #sg-game-draw-width {
        width: 100%;
        margin: 0;
    }
    
    #sg-word.drawing span {
        color: #00b;
    }
</style>
