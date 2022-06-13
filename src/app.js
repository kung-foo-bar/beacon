// imports
import express, { json } from 'express';
import expressLayouts  from 'express-ejs-layouts';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import 'dotenv/config';
import process from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;

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

app.get('/report', (req, res) => {
  res.render('report', { layout:'./pages/_report',  title: 'Report/Request'});
})
// -------- any other pages should be set below here --------

// app.get('/about', (req, res) => {
//   res.render('about', { layout: './layouts/_about', title: 'About' })
// })
// app.get('/contact', (req, res) => {
//   res.render('contact', { layout: './layouts/_contact', title: 'Contact Page' })
// })

// Listen on port 8000
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// npm start
