<template>
    <button class="sg-button" :class="{ selected }">
        <span v-if="text">{{ text }}</span>
    </button>
</template>

<script>
    export default {
        name: "sg-button",
        
        props: [
            "text",
            "selected"
        ]
    };
</script>

<style>
    .sg-button.selected {
        outline: 1px solid red;
    }
</style>
