export type ChartData = {
    _time: string;
    _value: number;
    _field: string;
    _measurement: string;
    deviceId: string;
};

export type SocketConfig = {
    port: number;
}