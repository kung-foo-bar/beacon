// imports
import express, { json } from 'express';
import bodyParser from 'body-parser';
import expressLayouts  from 'express-ejs-layouts';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import 'dotenv/config';
import process from 'node:process';

import * as db_host from './db_host.js';
import * as issue_server from './routes/issues/issues_server.js';

import * as db_common from './db_common.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;
let pool = db_host.open_db();

let json_parser = bodyParser.json();
// Static Files
app.use(express.static('public'));
app.use('/img', express.static(__dirname + 'public/img'));

// Set Views | Templating Engine
app.use(expressLayouts);
app.set('layout', './pages/_landing');
app.set('view engine', 'ejs');

// Navigation | Route to pages
app.get('', (req, res) => {
  res.render('landing', { layout:'./pages/_landing',title: 'Homepage'});
})
app.get('/about', (req, res) => {
  res.render('about', { layout: './pages/_about', title: 'About' })
})
app.get('/rr', (req, res) => {
  res.render('rr', { layout: './pages/_rr', title: 'R/R' })
})
app.get('/forum', (req, res) => {
  res.render('forum', { layout: './pages/_forum', title: 'Forum' })
})
app.get('/donate', (req, res) => {
  res.render('donate', { layout: './pages/_donate', title: 'Donate' })
})
app.get('/faq', (req, res) => {
  res.render('faq', { layout: './pages/_faq', title: 'FAQs' })
})

// app.get('/report', (req, res) => {
//   res.render('report', { layout:'./pages/_report',  title: 'Report/Request'});
// })
// -------- any other pages should be set below here --------

// app.get('/about', (req, res) => {
//   res.render('about', { layout: './layouts/_about', title: 'About' })
// })
// app.get('/contact', (req, res) => {
//   res.render('contact', { layout: './layouts/_contact', title: 'Contact Page' })
// })

app.post('/issues',json_parser,(req,res) => {
  let oldest = new Date();
  oldest.setTime(req.body.after);
  let db_res = issue_server.get_within_period(pool,oldest);
  db_res.then(rows => {
     res.send(JSON.stringify(rows.data));
     rows.client.release();
  })
  .catch((err) => {
     db_common.log_pg_err(err);
     let json_err = {status: 500, err: 'internal server error'};
     res.send(JSON.stringify(json_err));
  });
});

// Listen on port 8000
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// npm start
