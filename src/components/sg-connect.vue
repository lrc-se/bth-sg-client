<template>
    <div id="sg-connect">
        <h3>Anslut till server</h3>
        <form @submit.prevent="connect">
            <div>
                <label class="line" for="sg-connect-server">Adress:</label>
                <input id="sg-connect-server" type="text" required autofocus v-model="server">
            </div>
            <div>
                <label class="line" for="sg-connect-port">Port:</label>
                <input id="sg-connect-port" type="number" required v-model="port">
            </div>
            <br>
            <sg-button :text="(status == 'connecting' ? 'Ansluter...' : 'Anslut')" :disabled="status == 'connecting'"></sg-button>
        </form>
        <footer v-if="contact.title || contact.email || contact.website">
            <p>Denna S&G-klient tillhandahålls av</p>
            <div>
                <span v-if="contact.title">{{ contact.title }}</span>
                <span v-if="contact.email"><a :href="'mailto:' + contact.email">{{ contact.email }}</a></span>
                <span v-if="contact.website"><a :href="contact.website" target="_blank">{{ contact.website }}</a></span>
            </div>
        </footer>
    </div>
</template>

<script>
    import axios from "axios";
    import defaults from "../defaults";
    import Client from "../client";
    import SgButton from "./sg-button";
    
    export default {
        name: "sg-login",
        
        components: {
            "sg-button": SgButton
        },
        
        data() {
            return {
                status: "idle",
                server: defaults.server,
                port: defaults.port,
                contact: defaults.contact || {}
            };
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
    #sg-connect {
        text-align: center;
    }
    
    #sg-connect footer {
        margin-top: 3em;
        color: #888683;
    }
    
    #sg-connect footer::before {
        content: "";
        width: 75%;
        height: 1px;
        margin: 0 auto 1.5em;
        background-image: linear-gradient(to right, transparent, rgba(51, 49, 46, .25), transparent);
        display: block;
    }
    
    #sg-connect footer p {
        margin-bottom: .5em;
    }
    
    #sg-connect footer div {
        font-size: .875em;
    }
    
    #sg-connect footer span {
        display: block;
    }
</style>
