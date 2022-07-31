/**
 * Tool for send command and receive updates from D-Link DSP-W215 Home Smart Plug via MQTT.
 *
 * Usage: enter your PIN code to LOGIN_PWD, change value of HNAP_URL according to your device settings.
 *
 * @type {exports|module.exports}
 */

var soapclient = require('./js/soapclient');
var fs = require('fs');

var OUTPUT_FILE = "result.txt";
var LOGIN_USER = "admin";
var LOGIN_PWD = "<PIN CODE>";
var HNAP_URL = "http://192.168.1.128/HNAP1";
var POLLING_INTERVAL = 60000;
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
