import express from 'express';
import cors from "cors";

import { readData } from "@/service/influx";

const app = express()
app.use(cors());

type chartData = {
    _time: string;
    _value: number;
    _field: string;
    _measurement: string;
    deviceId: string;
};

app.get('/api/data', function (req: any, res: any) {
    readData().then((data) => { // Assuming readData() returns an array of chartData
        const finalData = data.map((item) => {
            let {_time, _value, _field, _measurement, deviceId} = item as unknown as chartData;
            return {_time, _value, _field, _measurement, deviceId};
        });
        res.json(finalData);
    });
})

app.listen(3000)