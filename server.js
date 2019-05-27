// https://developers.google.com/docs/api/pricing

const express = require("express");
const app = express();
const router = require("./router");
const port = 3334;
app.use("/", router);
app.listen(port, () => console.log(`Welcome. Listening on port ${port}`));
