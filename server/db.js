const Sequelize = require('sequelize');
const { STRING, BOOLEAN, INTEGER } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_products_search_db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

const Product = conn.define('product', {
  name: {
    type: STRING
  },
  inStock: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

const User = conn.define('user', {
  username: {
    type: STRING,
    unique: true
  },
  facebook_id: {
    type: STRING,
    unique: true
  },
  facebook_username: {
    type: STRING,
    unique: true
  },
  luckyNumber: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 7
  },
});


User.prototype.generateToken = function(){
  return {
    token: jwt.sign({ id: this.id }, process.env.JWT) 
  };
}

User.authenticateGithub = async function(code){
  let response = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      code
    },
    {
      headers: {
        accept: 'application/json'
      }
    }
  );
  if(response.data.error){
    const error = Error(response.data.error);
    error.status = 401;
    throw error;
  }
  response = await axios.get(
    'https://api.github.com/user',
    {
      headers: {
        Authorization: `Bearer ${ response.data.access_token}`
      }
    }
  );
  const login = response.data.login;
  let user = await User.findOne({
    where: {
      username: login
    }
  });
  if(!user){
    user = await User.create({
      username: login
    });
  }
  return user.generateToken();
}

User.authenticateFacebook = async function(code){
  let response = await axios.get(
    `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${process.env.facebook_client_id}&client_secret=${process.env.facebook_client_secret}&code=${code}&redirect_uri=${process.env.facebook_redirect_uri}/api/auth/facebook`
  );
  if(response.data.error){
    const error = Error(response.data.error);
    error.status = 401;
    throw error;
  }
  response = await axios.get(
    `https://graph.facebook.com/me?access_token=${response.data.access_token}`);
  const id = response.data.id;
  let user = await User.findOne({
    where: {
      facebook_id: id
    }
  });
  if(!user){
    user = await User.create({
      facebook_id: id,
      facebook_username: response.data.name 
    });
  }
  return user.generateToken();
}

User.register = async function(credentials){
  const user = await this.create(credentials);
  return user.generateToken();
}

User.findByToken = async function(token){
  const { id } = jwt.verify(token, process.env.JWT);
  const user = await this.findByPk(id);
  if(!user){
    const error = Error('bad token!');
    error.status = 401;
    throw error;
  }
  return user;
}

User.authenticate = async function(credentials){
  const { username, password } = credentials;
  const user = await this.findOne({
    where: {
      username
    }
  });
  if(!user || !(await bcrypt.compare(password, user.password))){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  return user.generateToken();
}

module.exports = {
  Product,
  User,
  conn
};
