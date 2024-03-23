
export default async function loader() {
    console.log("Loading device simulator");
    await import("../../device-simulator/index.js" as string);
    console.log("Device simulator loaded");

    console.log("Loading apis");
    await import("@/api");
    console.log("API loaded");

    console.log("Loading subscribers");
    await (await import("@/subscribers")).default();
    console.log("Subscribers loaded");
}
