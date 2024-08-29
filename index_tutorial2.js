/*
 * URLルートをroutes.jsファイルに分けて記述し、index.jsで呼び出す書き方
 * ＜実行方法＞
 * node index_tutorial2.js
 * http://localhost:8000/api/people
 * http://localhost:8000/api/people/123
 */
const express = require("express");
const app = express();

const routes = require("./routes");
app.use("/api", routes);

app.listen(8000, function() {
    console.log("Server running at port 8000...");
});