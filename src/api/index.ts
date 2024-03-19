import express from 'express';
import cors from "cors";

import { readData } from "@/service/influx";
import { chartData } from "~/socket";

const app = express()
app.use(cors());


app.get('/api/data', function (req: any, res: any) {
    let {range} = req.query;
    readData(range).then((data) => { // Assuming readData() returns an array of chartData
        const finalData = data.map((item) => {
            let {_time, _value, _field, _measurement, deviceId} = item as unknown as chartData;
            return {_time, _value, _field, _measurement, deviceId};
        });
        res.json(finalData);
    });
})

app.listen(3000);