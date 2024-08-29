/*
 * URL Routeをindex.jsに直接書き方
 * ＜実行方法＞
 * node index_tutorial1.js
 * http://localhost:8000/api/people
 * http://localhost:8000/api/people/123
 */
const express = require("express");
const app = express();

// Static URL 例
app.get("/api/people", function(req, res) {
    const data = [
    { name: "Bobo", age: 22 },
    { name: "Nini", age: 23 },
    ];
    return res.status(200).json(data);
});

// Dynamic URL 例
app.get("/api/people/:id", function(req, res) {
    const id = req.params.id;

    return res.status(200).json({ id });
});

// http://localhost:8000/test?sort[name]=1&filter[from]=Yangon&filter[to]=Yangon&page=2
app.get("/test", function(req, res) {
    return res.json(req.query);
});

app.listen(8000, function() {
 console.log("Server running at port 8000...");
});

