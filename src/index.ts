import express from "express";
import Routes from "./routes";
import connectMongoDB from "./services/mongodb";
import "./config/env";

const app = express();

app.use(express.json());

connectMongoDB();

new Routes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
