import { startServer } from "./server";
import { connect } from './config/typeorm';

async function main() {
    connect()
    const port = 4000;
    const app = await startServer();
    app.listen(port);
    console.log("App running on port", port);
}

main();