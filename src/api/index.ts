import express from 'express';
import cors from "cors";
import config from "config";

import { readData } from "@/service/influx";
import { ChartData } from "~/socket";
import { APIConfig } from "~/api";

const {port} = config.get<APIConfig>("api");

const app = express()
app.use(cors());


app.get('/api/data', function (req: any, res: any) {
    let {range} = req.query;
    readData(range).then((data) => { // Assuming readData() returns an array of chartData
        const finalData = data.map((item) => {
            let {_time, _value, _field, _measurement, deviceId} = item as unknown as ChartData;
            return {_time, _value, _field, _measurement, deviceId};
        });
        res.json(finalData);
    });
})

// app.get('/bot', function (req: any, res: any) {
//     let {msg} = req.query;
//     bot.sendMessage(-4155021618, msg)
//     res.send("ok")
// })

app.listen(port, () => {
    console.log(`API Server started @${port}`);
});

export default app
