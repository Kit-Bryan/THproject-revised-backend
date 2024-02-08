import { InfluxDB, Point } from '@influxdata/influxdb-client';
import config from "config";
import { influxConfig } from "~/influx";

const {url, token, org, bucket} = config.get<influxConfig>("influx");
const writeApi = new InfluxDB({url, token}).getWriteApi(org, bucket, 'ns', {flushInterval: 1});
const queryApi = new InfluxDB({url, token}).getQueryApi(org)

export function writeData(deviceId: string, humidity: number, temperature: number) {
    const point = new Point('environment')
        .tag('deviceId', deviceId)
        .floatField('humidity', humidity)
        .floatField('temperature', temperature)

    writeApi.writePoint(point);
    console.log(`writing ${point}`)
}

export async function readData(duration?: number) {
    // Todo: add different values
    let range = 5;
    let window = 2;
    if (duration == 5) {
        range = 5;
        window = 2;
    }

    const fluxQuery = `
        from(bucket:"${bucket}") 
        |> range(start: -5m) 
        |> filter(fn: (r) => r._measurement == "environment")
        |> aggregateWindow(every: 2m, fn: mean)
    `
    const data = await queryApi.collectRows(
        fluxQuery //, you can also specify a row mapper as a second argument
    )
    return data;
    // data.forEach((x) => console.log(JSON.stringify(x)))
    // console.log('\nCollect ROWS SUCCESS')
}

readData()

// writeData("dummy-temp-1", 3, 25);