const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true
});

const postSchema = {
  title: String,
  content: String
}

const personsSchema = {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }

};
const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", personsSchema);



app.get("/", function(req, res) {

  Post.find({}, function(err, foundPosts) {
    if (!err) {
      res.render("home", {
        StartingContent: homeStartingContent,
        Posts: foundPosts,
        Postby:postbyuser
      });
    } else {
      console.log(err);
    }
  });


});

app.get("/login", function(req, res) {

  res.render("login",{Bad:""});

});




app.get("/about", function(req, res) {
  res.render("about", {
    aboutContentStarting: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    ContactContentStarting: contactContent
  });
});






app.get("/signup", function(req, res) {

  res.render("signup",{Good:""});

});
let postbyuser = "";
app.post("/login", function(req, res) {

  if (req.body.btn === "SignIn") {
    User.findOne({
      username: req.body.userName
    }, function(err, FoundUser) {

      if (!err) {
        if(FoundUser){


        if (FoundUser.password === req.body.Password) {
          postbyuser = req.body.userName;
          res.render("compose");
        } else {
          console.log("wrong username or password!");
          res.render("login",{Bad:"wrong username or password!"});
        }
        }
        else{
          console.log("wrong username or password!");
          res.render("login",{Bad:"wrong username or password!"});
        }
      } else {
        console.log(err);
      }
    });

  } else {
    res.redirect("/signup");
    app.post("/signup", function(req, res) {

      User.findOne({
        username: req.body.enteruserName
      }, function(err, FoundUser) {
        if (!err) {
          if (FoundUser) {
            console.log("User name is Used Enter another UserName!")
            res.render("signup",{Good:"User name is Used Enter another UserName!"});
          } else {
            const user = new User({
              username: req.body.enteruserName,
              password: req.body.enterPassword
            });
            user.save(function(err) {
              if (!err) {
                console.log("Added New User");
                res.redirect("/login");
              }
            });

          }
        } else {
          console.log(err);
        };

      });


    });
  };


});

app.post("/compose", function(req, res) {

  const post = new Post({
    title: _.lowerCase(req.body.title),
    content: req.body.post
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});
app.post("/delete", function(req, res) {
  Post.deleteMany({}, function(err) {
    if (!err) {
      console.log("Delete All News Successfuly!");
      res.redirect("/");

    }

  });


});



app.get("/posts/:postId", function(req, res) {
  const requestedPostId = _.lowerCase(req.params.postId);
  Post.findOne({
    title: requestedPostId
  }, function(err, FoundPost) {
    if (!err) {
      res.render("post", {
        title_: _.capitalize(FoundPost.title),
        content_: FoundPost.content,
        Postby:postbyuser
      });

    } else {
      console.log("Not Matched!");
    }
  });

});

app.listen(3000, function() {
  console.log("successfuly Connnected to port 3000");
});
