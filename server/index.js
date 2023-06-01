try {
  require('../env.js');
}
catch(ex){
  console.log('running locally? add an env.js file with client_id and client_secret');
  console.log('deploying? add a client_id and client_secret environment variable');
  console.log(ex);
}
const port = process.env.PORT || 3000;
const app = require('./app');
app.engine('html', require('ejs').renderFile);
const { conn, Product, User } = require('./db');

app.listen(port, async()=> {
  try {
    console.log(`listening on port ${port}`)
    //seed data
    await conn.sync({ force: true });
    await Promise.all([
      Product.create({ name: 'foo' }),
      Product.create({ name: 'foop', inStock: false }),
      Product.create({ name: 'bar', inStock: false }),
      Product.create({ name: 'bazz'}),
      Product.create({ name: 'quq'}),
      Product.create({ name: 'quq!!', inStock: false}),
      User.create({ username: 'moe', password: 'm', luckyNumber: 8}), 
      User.create({ username: 'lucy', password: 'l' }), 
    ]);
    console.log('seeded');
  }
  catch(ex){
    console.log(ex);
  }
});
