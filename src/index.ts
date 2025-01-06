import express from "express";

const app = express();

app.use("/", () => {
  console.log("HELLO SWAPNIL!");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
