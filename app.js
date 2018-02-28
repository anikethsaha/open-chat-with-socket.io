var express = require('express');
var csrf = require('csurf');
var app = express();
var server = app.listen(8080,function(){
  console.log("listening to port 8080");
})
var io = require('socket.io')(server);
var bodyparser= require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
const sanitizeBody = require('express-validator/filter');

var bcrypt = require('bcrypt');
var session = require('express-session');
var mongoose = require('mongoose');
var cookieParse = require('cookie-parser');

var multer = require('multer');
var upload = multer({dest : './public/profileImages/'});
//database connectio
mongoose.connect('mongodb://localhost/nodepro');


var expressControllers = require('express-controller');




//controller ASSIGNMENT
//setting up the controller
expressControllers.setDirectory(path.join(__dirname,'/controller')).bind(app);
var loginController = require('./controller/loginController');
var homeController = require('./controller/homeController');

//body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));




//static path
app.use(express.static(path.join(__dirname,'public')));


//session type


app.use(cookieParse());
var sessionSecrect = bcrypt.hashSync('nodepro',7);
app.use(session({
  secret : sessionSecrect,
  resave : false,
  saveUninitialized : true,
   signed: true,
  // store : true,


}))
app.use(csrf());


var csrfProtect = csrf();


//global error var as null  //this method to create a local var use it for session
app.use(function(req,res,next){
  res.locals.errors= null;
  res.locals.user= null;
  res.locals.username = req.session.username;
  res.locals.pageViews = req.session.views;
  res.locals._csrf = req.csrfToken();

  next();
});


//validator
app.use(expressValidator());


app.set('io',io);


//view engine and path

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname,'views'));
var user;






//authentication middleware
 function checkAuth(req, res, next) {
  if (!req.session.username) {
    res.send('You are not authorized to view this page');

  } else {
    next();
  }
}
function loginPageAuth(req,res,next){
  if(req.session.username){
      res.redirect('/user');
  }else{
    next();
  }
}



//socket.io and chatcon data base part here
var ChatCon = require('./model/chatCon');
io.on('connection',function(client){

  console.log("user connected " + client.id);

  client.on('userConnectedsendData',function(uname){
    console.log("userConnected server ");
      io.emit('userConnected',uname);
  });

        client.on('sendMsg',function(dataToSave){
                    //saving to database
                    var chatCon = new ChatCon();
                    chatCon.msgBody = dataToSave.Msg;
                    chatCon.senderName = dataToSave.name;
                    chatCon.createAt = new Date;
                    chatCon.save(function(err,chat){
                      if(err){
                        console.log(err);

                      }else{
                        console.log(chat.msgBody);
                        io.sockets.emit('getMsg',chat);
                      }
                    })

                  });
  io.on('disconnect',function(){
    console.log("disconnect");
  })
});
app.get('/',function(req,res){
  if(req.session.views){
    req.session.views++;
  }else{
    req.session.views = 1;

  }
 console.log(req.session.views);
 res.render('index');
})
app.get('/log',loginPageAuth,function(req,res){



                      res.render('loginpage',{

                    'title':"nodepro",
                    'pageViews' : req.session.views,
                      });
            })


 app.post('/register',csrfProtect,upload.single('dp'),loginController.register);

app.post('/login',csrfProtect,loginController.login);
app.get('/logout',loginController.logout);
  app.get('/user',checkAuth,homeController.index);
