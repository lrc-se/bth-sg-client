<template>
    <button class="sg-button" :class="{ selected, colored: !!bgColor }" :style="{ backgroundColor: bgColor }">
        <img :src="require(`../img/${icon}`)" :alt="text" v-if="icon">
        <span v-else-if="text">{{ text }}</span>
        <span v-else>&nbsp;</span>
    </button>
</template>

<script>
    export default {
        name: "sg-button",
        
        props: [
            "text",
            "icon",
            "selected",
            "bg-color"
        ]
    };
</script>

<style>
    .sg-button {
        margin: 0 .5em .5em 0;
        padding: .25em 1em;
        border: 3px double #33312e;
        border-radius: 2px;
        cursor: pointer;
    }
    
    .sg-button:last-child {
        margin: 0;
    }
    
    .sg-button:not(.colored) {
        background-image: radial-gradient(#eeece9, #eeece9 40%, #cccac7);
    }
    
    .sg-button:not(.colored):hover {
        background-image: radial-gradient(#f4f2ef, #f4f2ef 40%, #dddbd9);
    }
    
    .sg-button:focus {
        outline: none;
        box-shadow: 0 0 5px rgba(0, 0, 0, .667) inset;
    }
    
    .sg-button.selected {
        border-style: solid;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, .333);
    }
    
    .sg-button.selected:focus {
        box-shadow: 0 0 5px rgba(0, 0, 0, .667) inset, 0 0 0 1px rgba(0, 0, 0, .333);
    }
    
    .sg-button:disabled {
        color: inherit;
        opacity: .5;
        cursor: progress;
    }
    
    .sg-button img {
        display: block;
    }
</style>
