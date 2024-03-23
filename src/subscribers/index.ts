import mqtt from "mqtt";
import config from "config";

import { mqttConfig } from "~/mqtt";
import { writeData } from "@/service/influx";
import { sendDataToFrontEnd } from "@/service/socket";

const {host, port} = config.get<mqttConfig>("mqtt");

let client = mqtt.connect(`mqtt://${host}:${port}`);

export default async function subscribers() {
    let counter = 0;

    client.on("connect", () => {
        console.log("Connected to MQTT")
        client.subscribe("site-a/data/#", (err) => {
            console.log(`Subscribed to site-a/data/#`);
        });
    });

    client.on("message", (topic: string, message: any) => {
        let {timestamp, deviceId, temperature, humidity} = JSON.parse(message.toString())
        console.log(timestamp, deviceId, temperature, humidity);
        writeData(deviceId, humidity, temperature);
        counter++
        if (counter === 3) {
            sendDataToFrontEnd();
            counter = 0;
        }
        // client.end();
    });
}