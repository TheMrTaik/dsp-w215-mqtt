# DSP-W215 MQTT 
Tool to Allow control of D-Link DSP-W215 Smart Plug via MQTT.

You must change the authentication credentials (PIN written behind the plug and IP address) of the smart plug present in the app.js file and the connection parameters to the MQTT broker, always present in the same file.

To receive an update of the information on the smart plug via MQTT, the "UPDATE_DATA" command must be sent to the topic set for receiving the commands (default "cmnd/DSP-W215")

Tested with hardware version B1 and firmware version 2.24.



Thanks to bikerp for the initial release, this is a fork from https://github.com/bikerp/dsp-w215-hnap
