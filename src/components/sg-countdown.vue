<template>
    <div>Tid kvar: <strong>{{ min }}:{{ sec }}</strong></div>
</template>

<script>
    export default {
        name: "sg-countdown",
        
        props: ["seconds"],
        
        computed: {
            min() {
                if (this.seconds > 0) {
                    let min = Math.floor(this.seconds / 60);
                    return (min < 10 ? "0" + min : min);
                }
                return "--";
            },
            
            sec() {
                if (this.seconds > 0) {
                    let sec = this.seconds % 60;
                    return (sec < 10 ? "0" + sec : sec);
                }
                return "--";
            }
        }
    };
</script>
