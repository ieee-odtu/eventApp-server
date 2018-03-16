import express from 'express';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import db_config from './config/db';
import server_config from './config/server';

import _jwt from './middleware/jwt';

import {rlog_mw, _EUNEXP} from './util';

import route_users from './routes/users';
//import route_sess from './routes/sessions';
//import route_locs from './routes/locations';
import route_auth from './routes/auth';

const package_json_parsed = JSON.parse(fs.readFileSync('package.json'));
const API_NAME = package_json_parsed.name;
const API_VER = package_json_parsed.version;
const API_AUTHOR = package_json_parsed.author;

let _api_port = process.env.API_PORT || server_config.port || 3000;

mongoose.Promise = bluebird.Promise;

mongoose.connect(db_config.database)
	.then(() => {
		let app = express();

		// Helmet middleware for base HTTP/S header security
		app.use(helmet({
			noCache: true
		}));

		app.use(helmet.hsts({
			maxAge: 63072000,
			includeSubDomains: false
		}));

		app.use(helmet.referrerPolicy({
			policy: 'same-origin'
		}));

		var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
		app.use(morgan('combined', {stream: accessLogStream}));

		// Cors middlware for cross-origin resource sharin
		// TODO: This configuration of CORS is not safe
		app.use(cors());

		app.use(bodyParser.json());

		// Nginx (or shitty Apache) reverse-proxy
		app.set('trust proxy', '127.0.0.1');

		// Changing the response header 'X-Powered-By' for security reasons
		app.use((req, res, next) => {
			res.set('X-Powered-By', 'IEEE METU | Computer Society');
			next();
		});

		app.use(rlog_mw);

		app.get('/', (req, res, next) => {
			return res.status(200).json({
				success: true,
				api: API_NAME,
				api_version: API_VER,
				api_author: API_AUTHOR
			});
		});

		app.use('/u', route_users);
		//app.use('/s', route_sess);
		//app.use('/loc', route_locs);
		app.use('/auth', route_auth);

		app.use('*', (req, res) => {
			return res.status(404).end('Unimplemented or unknown API endpoint');
		});

		app.use((err, req, res, next) => {
			console.error('\x1b[1m\x1b[31m[ERROR]', err.name + '\x1b[0m');
			if (!res.headersSent) {
				switch (err.name) {
					case 'JsonWebTokenError':
						res.status(401).json({
							code: 'JV_ERR',
							err: err,
							middleware: 'JV'
						});
						break;
					default:
						_EUNEXP(res, err);
				}
			}
		});

		app.listen(_api_port, (err) => {
			if (!err)
				console.log('[+] Server has started on port', _api_port);
		});
	});
