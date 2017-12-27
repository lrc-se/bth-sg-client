<template>
    <div id="sg-connect">
        <header>
            <h1>Skissa & Gissa</h1>
        </header>
        <h4>Anslut till server</h4>
        <form @submit.prevent="connect">
            <div>
                <label for="connect-server">Server</label>
                <input id="connect-server" type="text" v-model="server">
            </div>
            <div>
                <label for="connect-port">Port</label>
                <input id="connect-port" type="number" v-model="port">
            </div>
            <sg-button :text="(status == 'connecting' ? 'Ansluter...' : 'Anslut')" :disabled="status == 'connecting'"></sg-button>
        </form>
    </div>
</template>

<script>
    import axios from "axios";
    import defaults from "../defaults";
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-login",
        
        data() {
            return {
                status: "idle",
                nick: "",
                server: defaults.server,
                port: defaults.port
            };
        },
        
        components: {
            "sg-button": SgButton
        },
        
        created() {
            Client.$on("restart", this.reset);
        },
        
        methods: {
            connect() {
                if (this.status == "connecting") {
                    return;
                }
                if (!this.server.trim()) {
                    alert("Var god ange en serveradress.");
                    return;
                }
                if (!this.port) {
                    alert("Var god ange en port.");
                    return;
                }
                
                this.status = "connecting";
                Client.baseUrl = this.server.replace(/\/$/, "");
                Client.basePort = +this.port;
                if (!/^https?:\/\//.test(Client.baseUrl)) {
                    Client.baseUrl = "http://" + Client.baseUrl;
                }
                
                let vm = this;
                axios.get(`${Client.baseUrl}:${Client.basePort}/api/info`).then(function(res) {
                    if (!res.data.data || res.data.data.type !== "S&G") {
                        alert("Servern är inte en giltig Skissa & Gissa-server.");
                    } else {
                        Client.$emit(
                            "login",
                            res.data.data.name || `${Client.baseUrl}:${Client.basePort}`
                        );
                    }
                    vm.status = "idle";
                }).catch(function(err) {
                    if (err.response && err.response.status == 404) {
                        alert("Servern är inte en giltig Skissa & Gissa-server.");
                    } else {
                        alert("Kunde inte ansluta till servern.");
                    }
                    vm.status = "idle";
                });
            },
            
            reset() {
                this.status = "idle";
            }
        }
    };
</script>

<style>

</style>
