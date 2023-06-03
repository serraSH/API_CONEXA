import express, { ErrorRequestHandler, Request, Response } from "express";
import { initializeDbConnection, getDbConnection } from './src/db';
import cors from 'cors';
import bodyParser from "body-parser";
import jwt, { VerifyOptions, VerifyErrors } from 'jsonwebtoken';

const port = 4000;

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());

const JWT_SECRET:string = "bvgtrikgmn534gfdeghtrhbvc543&$%gfd";

initializeDbConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on port.. ${port}`);
        });
    });

app.get('/', async (req: Request, res: Response) => {
    res.sendFile(__dirname + '/public/login.html');
});    

app.get('/profile', async (req: Request, res: Response) => {
    res.sendFile(__dirname + '/public/profile.html');
});  

app.post('/api/signup', bodyParser.json(), async (req: Request, res: Response) => {
    let { email, password } = req.body;
    email = email.toUpperCase();
    const db = getDbConnection('apiDb');

    const user = await db.collection('users').findOne({ email });
    if (user) {
        res.sendStatus(409);
        console.log("Email already exists.");
    } else if(!user){
        const result = await db.collection('users').insertOne({
            email,
            password
        });
        res.sendStatus(200);
    } else{
        res.sendStatus(409);
        console.log("There has been an issue. Please try again.");
    }
});

app.post('/api/login', bodyParser.json(), async (req: Request, res: Response) => {
    let { email, password } = req.body;
    email = email.toUpperCase();
    const db = getDbConnection('apiDb');
    const user = await db.collection('users').findOne({ email, password });

    if (user) {
        console.log("Signed in successful");
        jwt.sign({ email, password }, JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                res.status(500).json(err);
            }
            res.set('Access-Control-Allow-Origin', 'http://localhost:4000');
            res.status(200).json({ token });
        });
    } else if(!user){
        res.sendStatus(409);
        console.log("Email or Password is incorrect.");
    } else{
        res.sendStatus(409);
        console.log("There has been an issue. Please try again.");
    }
});

app.post('/api/list', bodyParser.json(), async (req: Request, res: Response) => {
    let { email, token } = req.body;
    email = email.toUpperCase();
    const db = getDbConnection('apiDb');
    try{
        jwt.verify(token, JWT_SECRET);
        var userList:any = '';
        if(email != ''){
            userList = await db.collection('users').find({email}).project({email:1}).toArray();
        }else{
            userList = await db.collection('users').find({}).project({email:1}).toArray();
        }
        res.status(200).json(userList);
    } catch {
        res.status(403).json({msg: "Invalid token."});
    }
});



