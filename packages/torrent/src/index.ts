import express from 'express';
import cors from 'cors';
import Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import pino from 'pino-http';
import { Provider } from '@paranoids/torrente-types';
import { GetTorrentRoute } from './app/routes/generic.route';

const app = express();
app.use(express.json());
// app.use(pino({ level: 'info', prettyPrint: true }));

const whiteList = ['http://labs.paranoids.us', 'https://api.paranoids.us'];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
};
app.use(cors(corsOptions));

const validator = createValidator();
const validatorSearchSchema = Joi.object({
	provider: Joi.array()
		.items(
			Joi.string()
				.valid(...Object.values(Provider))
				.required()
		)
		.optional(),
	query: Joi.string().required(),
	category: Joi.string().valid('All', 'Video', 'Movies', 'Top100', 'TV').default('All').optional(),
	torrentLimit: Joi.number().optional(),
});

app.get('/', (req, res) => {
	res.json({ message: 'Nope ;D' });
});

app.post(`/${process.env.APP_NAME}/search`, validator.body(validatorSearchSchema), GetTorrentRoute);

app.listen(Number(process.env.PORT) || 3001, process.env.HOST || '127.0.0.1', () => {
	// eslint-disable-next-line no-console
	console.log(`Server started at ${process.env.PORT || 3001}`);
});
