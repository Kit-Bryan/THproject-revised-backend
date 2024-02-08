require('dotenv').config();

const mqtt = require('mqtt');
const Simulator = require('./simulator');

const {
  MQTT_HOST = 'localhost',
  PUBLISH_FREQ = 5,
  TEMP_DEVICE_COUNT = 3,
  TEMP_MAX = 30,
  TEMP_MIN = 20,
  HUMID_MAX = 80,
  HUMID_MIN = 55,
} = process.env;

const client = mqtt.connect(`mqtt://${MQTT_HOST}`);
let publishTask;

const devices = [];

for (let i = 1; i <= TEMP_DEVICE_COUNT; i += 1) {
  devices.push({
    deviceId: `dummy-temp-${i}`,
    temp: new Simulator((TEMP_MAX + TEMP_MIN) / 2, 1, TEMP_MIN, TEMP_MAX, 2),
    humid: new Simulator((HUMID_MAX + HUMID_MIN) / 2, 5, HUMID_MIN, HUMID_MAX, 2),
  });
}

function generateData() {
  // get current epoch timestamp in seconds
  const timestamp = Math.round(Date.now() / 1000);
  devices.forEach(({ deviceId, temp, humid }) => {
    const temperature = temp.generate();
    const humidity = humid.generate();

    client.publish(
      `site-a/data/${deviceId}/ambient`,
      JSON.stringify({
        timestamp,
        deviceId,
        temperature,
        humidity,
      }),
    );
  });
}

client.on('connect', () => {
  console.log('MQTT Connected');
  publishTask = setInterval(generateData, PUBLISH_FREQ * 1000);
});

client.on('close', () => {
  console.log('MQTT disconnected');
  if (publishTask) clearInterval(publishTask);
});

console.log('Simulator has started');
