import mqtt from "mqtt"; // import namespace "mqtt"
import config from "config";
import { mqttConfig } from "~/mqtt";
import { writeData } from "@/service/influx";

const {host, port} = config.get<mqttConfig>("mqtt");

let client = mqtt.connect(`mqtt://${host}:${port}`); // create a client

client.on("connect", () => {
    console.log("Connected to MQTT")
    client.subscribe("site-a/data/#", (err) => {
        console.log(`Subscribed to site-a/data/#`);
    });
});

client.on("message", (topic: any, message: any) => {
    let {timestamp, deviceId, temperature, humidity} = JSON.parse(message.toString())
    console.log(timestamp, deviceId, temperature, humidity);
    writeData(deviceId, humidity, temperature);
    // client.end();
});