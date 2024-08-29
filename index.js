// Express
const express = require('express');
const app = express();

// Mongo
// mangojs's first_para: database name, second_para: collection array
const mongojs = require('mongojs');
const db = mongojs('travel', [ 'records' ]);

// Body Parser
// HTTPリクエストのボディを解析し、
// JSONやURLエンコードされたデータとして取得するためのNode.jsミドルウェア
const bodyParser= require('body-parser');

// extended: false はURLEncode/DecodeにNode.js標準の querystring モジュールを使用し、
// extended: true はより複雑なオブジェクト構造をサポートする qs モジュールを使用
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Validator
const { body, param, validationResult } = require('express-validator');

// CORS
const cors = require('cors');
app.use(cors());

// JWT
const jwt = require("jsonwebtoken");
const secret = "horse battery staple";

// Auth Data
const users = [
    { username: 'Win', password: 'password', role: 'admin' },
    { username: 'Bob', password: 'password', role: 'user' },
];

// Auth Middlewares for checking Authentication with token
function auth(req, res, next) {
    // jwt Standard Header Value：　Authorization: Bearer [token]
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);

    const [ type, token ] = authHeader.split(' ');
    if(type !== "Bearer") return res.sendStatus(401);

    jwt.verify(token, secret, function(err, data) {
        if(err) return res.sendStatus(401);
        else next();
    });

    next();
}

// onlyAdmin Middlewares for checking Authorization with role
function onlyAdmin(req, res, next) {
    const [ type, token ] = req.headers['authorization'].split(' ');

    jwt.verify(token, secret, function(err, data) {
        if(data.role === "admin") next();
        else return res.sendStatus(403);
    });
    next();
}

// Login
app.post('/api/login', function(req, res) {
    const { username, password } = req.body;
    const auth = users.find(function(u) {
        return u.username === username && u.password === password;
    });

    if(auth) {
        // jwt.sign(User Data, Secret, Expire Time, Callback Function)
        jwt.sign(auth, secret, { expiresIn: '1h' }, function(err, token) {
            return res.status(200).json({ token });
        });
    } else {
        return res.sendStatus(401);
    }
});

// CRUD Create, Read, Update, Delete
// http://localhost:8000/api/records?filter[from]=Yangon&filter[to]=Bago&sort[name]=1&page=1
app.get('/api/records', function(req, res){

    const options = req.query;

    // validate options, send 400 on error

    const sort = options.sort || {};
    const filter = options.filter || {};
    const limit = 3;
    const page = parseInt(options.page) || 1;
    const skip = (page - 1) * limit;

    for(i in sort) {
        sort[i] = parseInt(sort[i]);
    }

    db.records.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit, function(err, data) {
            if(err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).json({
                    meta: {
                        skip,
                        limit,
                        sort,
                        filter,
                        page,
                        total: data.length,
                    },
                    data,
                    links: {
                        self: req.originalUrl,
                    }
                });
            }
        });
});

// Recordsを作成する
// POST - http://localhost:8000/api/records
app.post('/api/records', [

    body('name').not().isEmpty(),
    body('from').not().isEmpty(),
    body('to').not().isEmpty(),

], function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const record = {
        name: req.body.name,
        nrc: req.body.nrc,
        from: req.body.from,
        to: req.body.to,
        with: req.body.with,
    };

    db.records.insert(record, function(err, data) {
        if(err) {
            return res.status(500);
        }

        const _id = data._id

        res.append('Location', 'http://localhost:8000/api/records/' + _id);

        return res.status(201).json({ meta: { _id }, data });
    });
});

// Recordsがあれば、更新する。なければ、登録する
// PUT - http://localhost:8000/api/records/66d02a94c0cef81bb8cb704f
app.put('/api/records/:id', [

    param('id').isMongoId(),

], function(req, res) {
    const _id = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    db.records.count({
        _id: mongojs.ObjectId(_id)
    }, function(err, count) {
        const record = {
            _id: mongojs.ObjectId(_id),
            ...req.body
        };

        if(count) {
            db.records.save(record, function(err, data) {
                return res.status(200).json({
                    meta: { _id },
                    data
                });
            });
        } else{
            db.records.save(req.body, function(err, data) {
                return res.status(201).json({
                    meta: { _id: data._id },
                    data
                });
            });
        }
    });
});

// Recordsがあれば、更新する。なければ、登録する
// PATCH - http://localhost:8000/api/records/66d02a94c0cef81bb8cb704f
app.patch('/api/records/:id', [

    param('id').isMongoId(),

], function(req, res) {
    const _id = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    db.records.count({
        _id: mongojs.ObjectId(_id)
    }, function(err, count) {
        if(count) {
            db.records.update(
                { _id: mongojs.ObjectId(_id) },
                { $set: req.body },
                { multi: false },
                function(err, data) {
                    db.records.find({
                        _id: mongojs.ObjectId(_id)
                    },function(err, data) {
                        return res.status(200).json({ meta: { _id }, data });
                    });
                }
            )
        } else {
            return res.sendStatus(404);
        }
    });
});

// 権限があれば、Recordsを削除する
// DELETE - http://localhost:8000/api/records/66d02a94c0cef81bb8cb704f
app.delete('/api/records/:id', auth, onlyAdmin, function(req, res) {
    const _id = req.params.id;

    db.records.count({
        _id: mongojs.ObjectId(_id)
    }, function(err, count) {
        if(count) {
            db.records.remove({
                _id: mongojs.ObjectId(_id)
            }, function(err, data) {
                return res.sendStatus(204);
            });
        } else{
            return res.sendStatus(404);
        }
    });
});

// Serving API
app.listen(8000, function() {
    console.log('Server running at port 8000...');
});
