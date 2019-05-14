const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);
// alternative: const KnexSessionStore = require('connect-session-knex')
// and then: KnexSessionsStore(session)
//(Using a capital 'K' in the Variable name)


const sessionConfig = {
 name: 'monkey', // defaul is sid, but would reveal stack to hackers
 secret: 'keep it secret, keep it safe', // to encrypt/decrypt the cookie
 cookie: {
   maxAge: 1000 * 60 * 60, // how long the session is valid for, in milliseconds
   secure: false, // this makes sure session/cookie can only be accessed by https (not http) only and not JS. Should be true in production.
 },
 httpOnly: true, // cannot access the cookie from JS suing document.cookie - security feature
 //keep true unless a good reason to give JS access
 resave: false, // keep it false to avoid recreating sessions that have not changed
 saveUninitialized: false, //GDPR laws again setting cookies automatically

 // we add this to configure the way sessions are stored
 store: new KnexSessionStore({
   knex: require('../database/dbConfig'), // configured instance of knex
   tablename: 'session', //table that will store sessions inside the db, name it anything you want
   sidfieldname: 'sid', // column that will hold the session id, name anything you want
   createtable: true, // if table does not exist, it will create it automatically
   clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database for clean up
 })
}

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});

module.exports = server;
