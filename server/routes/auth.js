const express = require('express')
const path = require('path')
const { Product, User } = require('../db');
const jwt = require('jsonwebtoken');

const app = express.Router();

app.post('/', async(req, res, next)=> {
  try{
    res.send(await User.authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/register', async(req, res, next)=> {
  try{
    res.send(await User.register(req.body)); 
  }
  catch(ex){
    next(ex);
  }
});

app.put('/:token', async(req, res, next)=> {
  try{
    const user = await User.findByToken(req.params.token);
    await user.update({ luckyNumber: req.body.luckyNumber });
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/github', async(req, res, next)=> {
  try{
    const { token } = await User.authenticateGithub(req.query.code);
    res.send(`
      <script>
        window.localStorage.setItem('token', '${ token }');
        window.location = '/';
      </script>
    `);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/facebook', async(req, res, next)=> {
  try{
    const { token } = await User.authenticateFacebook(req.query.code);
    res.send(`
      <script>
        window.localStorage.setItem('token', '${ token }');
        window.location = '/';
      </script>
    `);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/:token', async(req, res, next)=> {
  try{
    res.send(await User.findByToken(req.params.token));
  }
  catch(ex){
    next(ex);
  }
});


module.exports = app;

