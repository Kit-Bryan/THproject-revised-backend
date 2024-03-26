export type mqttConfig = {
    host: string,
    port: number,
}

export type deviceData =
    {
        [key: string]: {
            humidity: number;
            temperature: number;
        }
    }
