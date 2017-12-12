<template>
    <div id="app">
        <header>
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
    </div>
</template>

<script>
    import Dispatcher from "./dispatcher";
    import SgCountdown from "./components/sg-countdown";
    import SgBoard from "./components/sg-board";
    import SgButton from "./components/sg-button";
    
    export default {
        name: "app",
        
        data() {
            return {
                drawType: "path",
                drawWidth: 2,
                seconds: null
            };
        },
        
        components: {
            "sg-countdown": SgCountdown,
            "sg-board": SgBoard,
            "sg-button": SgButton
        },
        
        created() {
            Dispatcher.$on("countdown", (sec) => {
                this.seconds = sec;
            });
        },
        
        methods: {
            undo() {
                Dispatcher.$emit("undo");
            },
            
            clearBoard() {
                Dispatcher.$emit("clear");
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
