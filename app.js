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
var pubTopicStat = 'stat/DSP-W215'
var pubTopicPower = 'stat/DSP-W215/POWER'
var pubTopicTotPower = 'stat/DSP-W215/TOT_POWER'
var pubTopicTemperature = 'stat/DSP-W215/TEMPERATURE'

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
        client.subscribe(subTopic, () => {
                console.log(`Subscribe to topic '${subTopic}'`)
        })
})

//Ricezione Messaggi MQTT
var messaggio = "null";

client.on('message', (topic, payload) => {
//      console.log('Received Message:', topic, payload.toString())
        messaggio = payload.toString();
        console.log(`Ricevuto Comando: '${messaggio}'`)

        //Soap Login
        soapclient.login(LOGIN_USER, LOGIN_PWD, HNAP_URL).done(function (status) {
                if(!status) {
                        console.log("Login Failed!")
                }

                if(status != "success") {
                        console.log("Login Failed!")
                }

                if(status == "success") {
                        console.log("Login OK")
//              }
//      });

                        //Accensione
                        if(messaggio == "ON") {
                                soapclient.on();
                        }

                        //Spegnimento
                        if(messaggio == "OFF") {
                                soapclient.off();
                        }

                        //Aggiorna Stato se il comando è ON o OFF
                        if(messaggio == "ON" || messaggio == "OFF") {
                                setTimeout(function(){
                                        soapclient.state().done(function(state) {
                                                if(state == "true") {
                                                        client.publish(pubTopicStat, "ON")
                                                        console.log("Inviato Stat ON")
                                                } else {
                                                        client.publish(pubTopicStat, "OFF")
                                                        console.log("Inviato Stat OFF")
                                                }
                                        });
                                }, 1000);
                        }

                        //Richiesta Aggiornamento Generale
                        if(messaggio == "UPDATE_DATA"){
                                //Stato
                                soapclient.state().done(function(state) {
                                        if(state == "true") {
                                                client.publish(pubTopicStat, "ON")
                                                console.log("Stato: ON")
                                        } else {
                                                client.publish(pubTopicStat, "OFF")
                                                console.log("Stato: OFF")
                                        }
                                });

                                //Consumo Attuale
                                soapclient.consumption().done(function(power) {
                                        client.publish(pubTopicPower, power)
                                        console.log('Consumo Attuale: ', power);
                                });

                                //Consumo Totale
                                soapclient.totalConsumption().done(function(power) {
                                        client.publish(pubTopicTotPower, power)
                                        console.log('Consumo Totale Periodo: ', power);
                                });

                                //Temperature Presa
                                soapclient.temperature().done(function(temperature) {
                                        client.publish(pubTopicTemperature, temperature)
                                        console.log('Temperatura Attuale: ', temperature);
                                });
                        }
                }
        });
})

//soapclient.login(LOGIN_USER, LOGIN_PWD, HNAP_URL).done(function (status) {
//      if (!status) {
//              throw "Login failed!";
//      }
//
//      if (status != "success") {
//              throw "Login failed!";
//      }
//});
