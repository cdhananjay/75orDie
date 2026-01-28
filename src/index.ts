import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import subjectRouter from './routes/subject.routes.js';
import { drizzle } from 'drizzle-orm/neon-http';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/sub', subjectRouter);

app.use(express.static(path.resolve(path.resolve(), 'client', 'dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(path.resolve(), 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`server listening on port: ${port}`);
});

export default db;
