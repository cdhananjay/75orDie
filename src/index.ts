import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from "./routes/auth.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import { drizzle } from 'drizzle-orm/neon-http';
import {usersTable} from "./db/schema.js";

const app = express()
const port = 3000

const db = drizzle(process.env.DATABASE_URL!);

(async ()=> {
    try {
        const users = await db.select().from(usersTable);
        console.log(users);
        console.log("DB CONNECTED")
    } catch (e) {
        if (e instanceof Error) console.error(e);
        console.log("ERROR CONNECTING TO DB");
        process.exit(1);
    }
})()

app.use(cookieParser())
app.use(express.json())
app.use('/api/auth' , authRouter);
app.use('/api/sub' , subjectRouter);

app.get('/', (req, res) => {
    res.send("hello world");
})
app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
})

export default db;