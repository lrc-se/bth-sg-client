<template>
    <div id="app">
        <sg-board :draw-type="drawType"></sg-board>
        <div>
            <sg-button text="Pensel" @click.native="drawType = 'path'"></sg-button>
            <sg-button text="Linje" @click.native="drawType = 'line'"></sg-button>
            <sg-button text="Rektangel" @click.native="drawType = 'rect'"></sg-button>
            <sg-button text="Fylld rektangel" @click.native="drawType = 'frect'"></sg-button>
            <span>{{ drawType }}</span>
        </div>
    </div>
</template>

<script>
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
        }
    };
</script>

<style>
    
</style>
