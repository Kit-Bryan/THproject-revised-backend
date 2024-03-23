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

export async function readData(duration?: string) {
    // Todo: add different values
    let range = "5m";
    let window = "2m";
    if (duration === "5m") {
        range = "5m";
        window = "1m";
    } else if (duration === "30m") {
        range = "30m";
        window = "5m";
    } else if (duration === "1hr") {
        range = "1h";
        window = "10m";
    } else if (duration === "12hr") {
        range = "12h";
        window = "2h";
    } else if (duration === "24hr") {
        range = "24h";
        window = "4h";
    }

    const fluxQuery = `
        from(bucket:"${bucket}") 
        |> range(start: -${range}) 
        |> filter(fn: (r) => r._measurement == "environment")
        |> aggregateWindow(every: ${window}, fn: mean)
    `
    const data = await queryApi.collectRows(
        fluxQuery //, you can also specify a row mapper as a second argument
    )

    return data;
    // data.forEach((x) => console.log(JSON.stringify(x)))
    // console.log('\nCollect ROWS SUCCESS')
}

export async function getLastDataPoint(duration?: string) {
    const fluxQuery = `
        from(bucket:"${bucket}") 
        |> range(start: -1m) 
        |> filter(fn: (r) => r._measurement == "environment")
        |> aggregateWindow(every: 2m, fn: mean)
        |> last()
    `
    const data = await queryApi.collectRows(
        fluxQuery //, you can also specify a row mapper as a second argument
    )

    return data;
    // data.forEach((x) => console.log(JSON.stringify(x)))
    // console.log('\nCollect ROWS SUCCESS')
}
