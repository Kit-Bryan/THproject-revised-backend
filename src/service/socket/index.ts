import config from "config";
import { Server } from "socket.io";

import { getLastDataPoint, readData } from "@/service/influx";
import { ChartData, SocketConfig } from "~/socket";
import { frontEndConfig } from "~/project";

const frontEndConfig = config.get<frontEndConfig>("frontEnd")
const socketConfig = config.get<SocketConfig>("socket")

const io = new Server({
    cors: {
        origin: `http://${frontEndConfig.host}:${frontEndConfig.port}`
    }
});

io.listen(socketConfig.port);
io.on("connection", (socket: any) => {
    console.log("Socket connected")
});

export function sendDataToFrontEnd() {
    getLastDataPoint().then((data) => { // Assuming readData() returns an array of chartData
        const finalData = data.map((item) => {
            let {_time, _value, _field, _measurement, deviceId} = item as unknown as ChartData;
            return {_time, _value, _field, _measurement, deviceId};
        });
        io.emit("latestData", finalData);
    });
}

