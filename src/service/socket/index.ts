import { Server } from "socket.io";
import { getLastDataPoint, readData } from "@/service/influx";
import { chartData } from "~/socket";

const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on("connection", (socket: any) => {
    console.log("Socket connected")
});

export function sendDataToFrontEnd() {
    getLastDataPoint().then((data) => { // Assuming readData() returns an array of chartData
        const finalData = data.map((item) => {
            let {_time, _value, _field, _measurement, deviceId} = item as unknown as chartData;
            return {_time, _value, _field, _measurement, deviceId};
        });
        io.emit("latestData", finalData);
    });
}

io.listen(3009);