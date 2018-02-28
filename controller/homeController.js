var Newuser = require('../model/user');
module.exports = {
  index : function(req,res){
          if (req.session.username) {
            Newuser.findOne({name : req.session.username },  function(err,data){
                if(err){
                  console.log(err);
                }
                else{
                  console.log(data);
                  res.render('home',{
                    'title':"nodepro | All User",
                    'user' :data,
                  });
                }
            });
      }else{
        console.log("no session found");
        res.redirect('/');
      }
    }

}
