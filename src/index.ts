import express from "express";
import Routes from "./routes";

const app = express();

new Routes(app);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
