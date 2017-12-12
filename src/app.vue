<template>
    <div id="app">
        <sg-board ref="board" :draw-type="drawType"></sg-board>
        <div>
            <sg-button text="Pensel" :selected="drawType == 'path'" @click.native="drawType = 'path'"></sg-button>
            <sg-button text="Linje" :selected="drawType == 'line'" @click.native="drawType = 'line'"></sg-button>
            <sg-button text="Rektangel" :selected="drawType == 'rect'" @click.native="drawType = 'rect'"></sg-button>
            <sg-button text="Fylld rektangel" :selected="drawType == 'frect'" @click.native="drawType = 'frect'"></sg-button>
            <sg-button text="Oval" :selected="drawType == 'oval'" @click.native="drawType = 'oval'"></sg-button>
            <sg-button text="Fylld oval" :selected="drawType == 'foval'" @click.native="drawType = 'foval'"></sg-button>
            <sg-button text="Rensa" @click.native="clearBoard"></sg-button>
            <span>{{ drawType }}</span>
        </div>
    </div>
</template>

<script>
    import Dispatcher from "./dispatcher";
    import SgBoard from "./components/sg-board";
    import SgButton from "./components/sg-button";
    
    export default {
        name: "app",
        
        data() {
            return {
                drawType: "path"
            };
        },
        
        components: {
            "sg-board": SgBoard,
            "sg-button": SgButton
        },
        
        methods: {
            clearBoard() {
                Dispatcher.$emit("clear");
            }
        }
    };
</script>

<style>
    
</style>
