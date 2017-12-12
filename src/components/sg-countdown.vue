<template>
    <div>{{ min }}:{{ sec }}</div>
</template>

<script>
    export default {
        name: "sg-countdown",
        
        props: ["seconds"],
        
        computed: {
            min() {
                if (this.seconds > 0) {
                    let min = Math.floor(this.seconds / 60);
                    return (min < 9 ? "0" + min : min);
                }
                return "--";
            },
            
            sec() {
                if (this.seconds > 0) {
                    let sec = this.seconds % 60;
                    return (sec < 9 ? "0" + sec : sec);
                }
                return "--";
            }
        }
    };
</script>
