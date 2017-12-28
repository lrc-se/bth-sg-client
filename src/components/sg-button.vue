<template>
    <button class="sg-button" :class="{ selected }" :style="{ backgroundColor: bgColor }">
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
    .sg-button.selected {
        outline: 1px solid red;
    }
</style>
