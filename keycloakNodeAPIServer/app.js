const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();
const app = express();

var keycloakConfig = {
    clientId: 'bit-client',
    bearerOnly: true,
    serverUrl: 'http://localhost:8082',
    realm: 'bit-realm',
    credentials: {
        secret: 'BqF4KumpFU8XyhuS4LKjv8zU8wjUjJhh'
    }
};
app.use(
    session({
      secret: 'mySecret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

const keycloak = new Keycloak({ store: memoryStore },keycloakConfig);
app.use(keycloak.middleware());
app.listen(3000, function () {
    console.log('App listening on port 3000');
});
app.get('/', (req,res)=>{
    res.json({
        result:'ok',path:'root',login:keycloak.loginUrl()
        ,logout:keycloak.logoutUrl()
        ,account:keycloak.accountUrl()
    });
});
function hasUserRole(token, request) {
    console.log(JSON.stringify(token));
    console.log(token.content.sid,token.content.preferred_username,token.content.name,token.content.email_verified);
    request.preferred_username=token.content.preferred_username;
    return token.hasRole('USER');
  }
app.get('/all', keycloak.protect(), (req,res)=>{
    res.json({result:'ok'});
});

app.get('/test1', keycloak.protect(hasUserRole), (req,res)=>{
    res.json({result:'ok',name:req.preferred_username});
});

app.get('/key',(req,res)=>{
    res.json({});
})

