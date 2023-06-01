const express = require('express')
const path = require('path')
const { Product, User } = require('./db');
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json());

// static middleware
app.use('/dist', express.static(path.join(__dirname, '../dist')))


app.get('/', (req, res) => {
  res.render(
    path.join(__dirname, '../public/index.html'),
    {
      client_id : process.env.client_id,
      facebook_client_id : process.env.facebook_client_id,
      facebook_redirect_uri : process.env.facebook_redirect_uri,

    });
}); 

app.get('/api/products', async(req, res, next)=> {
  try{
    res.send(await Product.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.use('/api/auth', require('./routes/auth'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err });

});


module.exports = app;

