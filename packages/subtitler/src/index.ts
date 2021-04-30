import express from 'express';
import cors from 'cors';
import { GetSubtitlesRoute } from './app/routes/generic.routes';
import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import pino from 'pino-http';
const app = express();
app.use(express.json());
app.use(pino({ level: 'info', prettyPrint: false }));

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
	provider: Joi.string().valid('subdivx', 'subscene', 'opensubtitles').optional(),
	query: Joi.string().required(),
	releases: Joi.array().items(Joi.string()).optional(),
	quality: Joi.array().items(Joi.string()).optional(),
	year: Joi.number().optional(),
	season: Joi.number().optional(),
	episode: Joi.number().optional(),
});

app.get('/', (req, res) => {
	res.json({ message: 'Nope ;D' });
});
//app.get(`/${process.env.APP_NAME}/providers`, GetProvidersRoute);
app.post(`/${process.env.APP_NAME}/search`, validator.body(validatorSearchSchema), GetSubtitlesRoute);

app.listen(Number(process.env.PORT) || 3001, process.env.HOST, () => {
	// eslint-disable-next-line no-console
	console.log(`Server started at ${process.env.PORT || 3001}`);
});
