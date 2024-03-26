import mqtt from "mqtt";
import config from "config";
import { CronJob } from "cron";

import { deviceData, mqttConfig } from "~/mqtt";
import { writeData } from "@/service/influx";
import { sendDataToFrontEnd } from "@/service/socket";
import bot from "@/service/telegram";


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

    let deviceData: deviceData = {}

    client.on("message", (topic: string, message: any) => {
        let {timestamp, deviceId, temperature, humidity} = JSON.parse(message.toString())
        deviceData[deviceId] = {humidity, temperature}
        console.log(deviceData)
        // console.log(timestamp, deviceId, temperature, humidity);
        writeData(deviceId, humidity, temperature);
        counter++
        if (counter === 3) {
            sendDataToFrontEnd();
            counter = 0;
        }
        // client.end();
    });

    new CronJob("0 * * * * *", () => {
        console.log("Cron check for abnormalities")
        Object.entries(deviceData).forEach(value => {
            if ((value[1].humidity ?? 0) > 75) {
                let msg = `🔴 [${value[0]}]\nAbnormal humidity: ${value[1].humidity}%`
                // bot.sendMessage(-4155021618, msg)
            }
            if ((value[1].temperature ?? 0) > 26.9) {
                let msg = `🔴 [${value[0]}]\nAbnormal temperature: ${value[1].temperature}°C`
                // bot.sendMessage(-4155021618, msg)
            }
        })
        deviceData = {};
    }, null, true)
}