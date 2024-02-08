import express from 'express';
import { readData } from "@/service/influx";

const app = express()

app.get('/api/data/:param1', function (req: any, res: any) {
    readData().then((data) => {
        res.json(data)
    })
})

app.listen(3000)