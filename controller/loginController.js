const basicxss = require('basicxss');

// var io = require('socket.io')(server);
var Newuser = require('../model/user');
var bcrypt = require('bcrypt');
var multer = require('multer');

var upload = multer({dest : './public/profileImages/'});
module.exports = {
login : function(req,res){
  req.checkBody('email').trim();
  req.checkBody('password').escape();
  req.sanitizeBody('email',"NO XSS");
  req.sanitizeBody('password',"NO XSS");
  req.checkBody('email','enter the email correctly').isEmail();
  req.checkBody('password','enter the password correctly').notEmpty().isAlpha();
  var errors = req.validationErrors();
  req.body.email = basicxss.basicxss(req.body.email);
  req.body.password = basicxss.basicxss(req.body.password);
  if(errors){
    res.render('loginpage',{
         'title':"nodepro",
         'errors':errors,
       });
    }else{

        Newuser.findOne({email : req.body.email},function(err,data){
          if(err){
            console.log(err);
          }else{

            if(data){
              bcrypt.compare(req.body.password,data.password,function(err,islogin){
                if(err){
                  console.log(err);
                }else{
                  // console.log(data);
                  if(islogin == true){

                    var io = req.app.get('io');

                    req.session.username = data.name;
                    console.log("succes loging " + req.session.username);
                    res.redirect('/user');
                  }else{

                      console.log("wrong password");
                      res.redirect('/log');
                  }

                }
              });
            }else {

              console.log("no user found" );
              res.redirect('/log');
            }


          }
        });
      }

},
register : function(req,res){

  req.checkBody('name').trim();
  req.checkBody('password').escape();
    req.sanitizeBody('name',"NO XSS");
    req.sanitizeBody('email',"NO XSS");
  req.sanitizeBody('password',"NO XSS");
  req.checkBody('email','enter the email correctly').isEmail();
  req.checkBody('password','enter the password correctly').notEmpty().isAlpha();

var errors = req.validationErrors();
  req.body.name = basicxss.basicxss(req.body.name);
  req.body.email = basicxss.basicxss(req.body.email);
  req.body.password = basicxss.basicxss(req.body.password);
if(errors){
  res.render('loginpage',{
       'title':"nodepro",
       'errors':errors,
  });
  console.log(errors);
}else{

      if(req.file.mimetype == 'image/jpg' || req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png' ){

                  var type = req.file.mimetype.replace(/image/i, "");
                  var type = type.replace(/\//g,"");
                  var newuser = new Newuser();
                  req.body.password = bcrypt.hashSync(req.body.password,10);
                  newuser.email =  req.body.email;
                  newuser.password = req.body.password;
                  newuser.name = req.body.name;
                  newuser.dp_originalName = req.file.originalname;
                  newuser.dp_contenttype = req.file.mimetype;
                  newuser.dp_type = type;
                  newuser.dp_name = req.file.filename;
                  newuser.save(function(err,user){
                    if(err){
                      console.log(err);
                    }else{

                      res.redirect('/log');
                    }
                  })
      }else{
                  var errors = "invalid image type. MUST BE PNG/JPG/JPEG";
                  res.render('loginpage',{
                       'title':"nodepro",
                       'errors':errors,
                  });
      }



}
},
logout : function(req,res){
  if(req.session.username){
    req.session.destroy(function(err){
      if (err) {
        console.log(err);
      }else{
        res.redirect('/');
      }
    });
  }
}
}
