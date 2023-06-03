"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./src/db");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const port = 4000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
const JWT_SECRET = "bvgtrikgmn534gfdeghtrhbvc543&$%gfd";
(0, db_1.initializeDbConnection)()
    .then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port.. ${port}`);
    });
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(__dirname + '/public/login.html');
}));
app.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(__dirname + '/public/profile.html');
}));
app.post('/api/signup', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    email = email.toUpperCase();
    const db = (0, db_1.getDbConnection)('apiDb');
    const user = yield db.collection('users').findOne({ email });
    if (user) {
        res.sendStatus(409);
        console.log("Email already exists.");
    }
    else if (!user) {
        const result = yield db.collection('users').insertOne({
            email,
            password
        });
        res.sendStatus(200);
    }
    else {
        res.sendStatus(409);
        console.log("There has been an issue. Please try again.");
    }
}));
app.post('/api/login', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    email = email.toUpperCase();
    const db = (0, db_1.getDbConnection)('apiDb');
    const user = yield db.collection('users').findOne({ email, password });
    if (user) {
        console.log("Signed in successful");
        jsonwebtoken_1.default.sign({ email, password }, JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                res.status(500).json(err);
            }
            res.set('Access-Control-Allow-Origin', 'http://localhost:4000');
            res.status(200).json({ token });
        });
    }
    else if (!user) {
        res.sendStatus(409);
        console.log("Email or Password is incorrect.");
    }
    else {
        res.sendStatus(409);
        console.log("There has been an issue. Please try again.");
    }
}));
app.post('/api/list', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, token } = req.body;
    email = email.toUpperCase();
    const db = (0, db_1.getDbConnection)('apiDb');
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        var userList = '';
        if (email != '') {
            userList = yield db.collection('users').find({ email }).project({ email: 1 }).toArray();
        }
        else {
            userList = yield db.collection('users').find({}).project({ email: 1 }).toArray();
        }
        res.status(200).json(userList);
    }
    catch (_a) {
        res.status(403).json({ msg: "Invalid token." });
    }
}));
