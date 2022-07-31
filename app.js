/**
 * Tool for send command and receive updates from D-Link DSP-W215 Home Smart Plug via MQTT.
 *
 * Usage: enter your PIN code to LOGIN_PWD, change value of HNAP_URL according to your device settings.
 *
 * @type {exports|module.exports}
 */

var soapclient = require('./js/soapclient');
var fs = require('fs');
const mqtt = require('mqtt')

var OUTPUT_FILE = "result.txt";
var LOGIN_USER = "admin";
var LOGIN_PWD = "<PIN_CODE>";
var HNAP_URL = "http://<IP_OF_DSP-W215>/HNAP1";
var POLLING_INTERVAL = 60000;

//Parametri MQTT
const host = '<IP_OF_MQTT_BROKER>'
const port = '1883'
const clientID = 'DSP-W215'
const subTopic = 'cmnd/DSP-W215'

//Connessione MQTT
const connectURL = `mqtt://${host}:${port}`

const client = mqtt.connect(connectURL, {
        clientID,
        clean: true,
        connectTimeout: 4000,
        username: 'DSP-W215',
        password: 'null',
        reconnectPeriod: 1000,
})

//Sub Topic
client.on('connect', () => {
        console.log('Connected')
        client.subscribe([subTopic], () => {
                console.log(`Subscribe to topic '${subTopic}'`)
        })
})

//Ricezione Messaggi MQTT
var messaggio = "null";

client.on('message', (topic, payload) => {
//      console.log('Received Message:', topic, payload.toString())
        messaggio = payload.toString();
        console.log(`Var impostata a '${messaggio}'`)

        //Accensione
        if(messaggio == "ON") {
                soapclient.on();
        }

        //Spegnimento
        if(messaggio == "OFF") {
                soapclient.off();
        }
})

var args = process.argv.slice(2);

soapclient.login(LOGIN_USER, LOGIN_PWD, HNAP_URL).done(function (status) {
        if (!status) {
                throw "Login failed!";
        }

        if (status != "success") {
                throw "Login failed!";
        }

        //Accensione
        if(args == "ON") {
                soapclient.on();
        }

        //Spegnimento
        if(args == "OFF") {
                soapclient.off();
        }

        //Stato Presa
        if(args == "STATE") {
                soapclient.state().done(function(state) {
                        if(state == "true") {
                                console.log("ON");
                        } else {
                                console.log("OFF");
                        }
                });
        }

        //Consumo Attuale
        if(args == "POWER") {
                soapclient.consumption().done(function(power) { console.log(power); });
        }

        //Consumo Totale
        if(args == "TOTAL_POWER") {
                soapclient.totalConsumption().done(function(power) { console.log(power); });
        }

        //Temperatura Presa
        if(args == "TEMP") {
                soapclient.temperature().done(function(temperature) { console.log(temperature); });
        }
});
