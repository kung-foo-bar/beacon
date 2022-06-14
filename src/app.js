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
import * as issues_query from './db_query/issues/query_db.js';
import * as users_query from './db_query/users/query_db.js';
import * as db_common from './db_common.js';
import * as db_err from './db_err.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8000;

let jsonParser = bodyParser.json();

let pool = db_host.open_db();

let json_parser = bodyParser.json();
// Static Files
app.use(express.static('public'));
app.use('/img', express.static(__dirname + 'public/img'));

// Set Views | Templating Engine
app.use(expressLayouts);
app.set('layout', './pages/_landing');
app.set('view engine', 'ejs');

function report_err(err,res,msg){
   db_common.log_pg_err(err);
   let res_msg = (msg) ? msg : 'internal server error';
   let json_err = {status: 500, err: res_msg};
   res.send(JSON.stringify(json_err));
}

function db_resolve(db_res,express_res){
   db_res.then(rows =>{
      //console.log(rows);
      express_res.send(JSON.stringify(rows.data));
      rows.client.release();
   })
   .catch(err => {
      report_err(err,express_res);
   });
}

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

app.get('/users',json_parser,(req,res) => {
   let db_res = users_query.select_users(pool);
   db_resolve(db_res,res);
});

app.post('/users/posts',json_parser,(req,res) => {
   let db_res = users_query.created_issues(pool,req.body.user_id);
   db_resolve(db_res,res);
});

app.post('/users/votes',json_parser,(req,res) => {
   let db_res = users_query.voted_issues(pool,req.body.user_id); 
   db_resolve(db_res,res);
});

app.put('/users',json_parser,(req,res) => {
   let db_res = users_query.insert_users(req.body.user_id,req.body.num);   
   db_res.then(rows => {
      res.send(JSON.stringify(rows.data));
      res.client.release();
   })
   .catch((err) => {
      let msg = 'internal server error';
      if(db_err.get_db_err(err) === db_err.PG_ERR_DUP) msg = 'user already exists within database';
      report_err(err,res,msg);
   });
});

app.delete('/users',json_parser,(req,res) => {
   let db_res = users_query.delete_users(pool,req.body.user_id);
   db_resolve(db_res,res);
});

app.put('/issues',json_parser,(req,res) => {
   let new_issue = {
      title: req.body.title,
      msg: req.body.msg,
      type: req.body.type,
      creator_id: req.body.creator_id,
      asignee_id: req.body.asignee_id
   };
   
   let db_res = issues_query.insert_issues(pool,new_issue);
   db_res.then( rows => {
      res.send(JSON.stringify(rows.data));
      rows.client.release();
   })
   .catch((err) => {
      let msg = 'internal server error';
      if(db_err.get_db_err(err) === db_err.PG_ERR_DUP) msg = 'issue is not unique';
      report_err(err,res,msg);
   });
});

app.post('/issues',json_parser,(req,res) => {
   let db_res = issue_server.filter_issues(pool,req.body.issue_type);
   db_resolve(db_res,res);
});

app.delete('/issues',json_parser,(req,res) =>{
   let issue = {
      title: req.body.title, 
      creator_id: req.body.creator_id, 
      asignee_id: req.body.asignee_id
   };

   let db_res = issues_query.delete_issue(pool,issue);
   db_resolve(db_res,res);
});

app.put('/votes',json_parser,(req,res) => {
   let v_id  = req.body.voter_id;
   let issue = {
      title: req.body.title, 
      creator_id: req.body.creator_id, 
      asignee_id: req.body.asignee_id
   };

   let db_res = issues_query.add_votes(pool,issue,v_id);
   db_res.then(rows => {
      res.send(JSON.stringify({vote_obj: rows.data[0]}));
      rows.client.release();
   })
   .catch((err) => {
      let msg = 'internal server error';
      if (db_err.get_db_err(err) === db_err.PG_ERR_DUP) msg = "cannot vote twice on the same issue";
      report_err(err,res,msg);
   });
});

app.get('/votes',json_parser,(req,res) => {
   let issue = {
     title: req.body.title, 
     creator_id: req.body.creator_id, 
     asignee_id: req.body.asignee_id 
   }; 

   let db_res = issues_query.count_votes(pool,issue);
   db_resolve(db_res,res);
});

app.delete('/votes',json_parser,(req,res) => {
   let v_id = req.body.voter_id;
   let issue = {
      title: req.body.title,
      creator_id: req.body.creator_id,
      asignee_id: req.body.asignee_id
   };
   let db_res = issues_query.remove_vote(pool,issue,v_id);
   db_resolve(db_res,res);
});
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
