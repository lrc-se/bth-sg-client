<template>
    <div id="sg-login">
        <header>
            <h1>Skissa & Gissa</h1>
        </header>
        <h4>Anslut till spel</h4>
        <form @submit.prevent="connect">
            <div>
                <label for="nick">Smeknamn</label>
                <input id="nick" type="text" v-model="nick">
            </div>
            <div>
                <label for="server">Server</label>
                <input id="server" type="text" v-model="server">
            </div>
            <sg-button :text="(status == 'connecting' ? 'Ansluter...' : 'Anslut')" :disabled="status == 'connecting'"></sg-button>
        </form>
    </div>
</template>

<script>
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-login",
        
        data() {
            return {
                status: "idle",
                nick: "",
                server: document.location.host
            };
        },
        
        components: {
            "sg-button": SgButton
        },
        
        created() {
            Client.$on("online", this.reset);
            Client.$on("offline", this.reset);
        },
        
        methods: {
            connect() {
                if (!this.nick.trim()) {
                    alert("Var god ange ett smeknamn.");
                    return;
                }
                if (!this.server.trim()) {
                    alert("Var god ange en serveradress.");
                    return;
                }
                
                this.status = "connecting";
                Client.nick = this.nick.trim();
                Client.connect(this.server.trim().replace(/^https?:\/\//, ""));
            },
            
            reset() {
                this.status = "idle";
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
