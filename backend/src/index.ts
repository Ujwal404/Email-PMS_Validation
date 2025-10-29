import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import api from './routes/index.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.use('/v1', api);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`API listening on :${port}`);
});
