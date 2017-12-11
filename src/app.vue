<template>
    <div id="app">
        <sg-board></sg-board>
    </div>
</template>

<script>
    import SgBoard from "./components/sg-board";
    
    export default {
        name: "app",
        components: {
            "sg-board": SgBoard
        }
    };
</script>

<style>
    
</style>
