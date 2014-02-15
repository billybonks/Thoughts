//require
var express = require('express');
var request = require('request');
var neo4j = require('neo4j-js')
var fbgraph = require('fbgraph')
var settings = require('./settings.js')
var passport = require('passport')
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

var FacebookRoute = require('./Routes/FacebookRoute')(settings);
var GoogleRoute = require('./Routes/GoogleRoute')(settings);
//Route Requires
var LinksRoute = require('./Routes/LinkRoute')(settings);
var CardsRoute = require('./Routes/CardsRoute')(settings);
var ApplicationRoute = require('./Routes/ApplicationRoute')(settings);
var UserRoute = require('./Routes/UserRoute')(settings);
var AttachmentRoute = require('./Routes/AttatchmentRoute')(settings);
var TagsRoute = require('./Routes/TagsRoute')(settings);
var SectionRoute = require('./Routes/SectionsRoute')(settings);
var SettingsRoute = require('./Routes/SettingsRoute')(settings);
var Proessor = require('./Routes/AttachmentProcessor')(settings);
//
/* ========================================================================================================
 *
 * Http Setup - Keep in alphabetical order
 *
 * ===================================================================================================== */
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);
/* ========================================================================================================
 *
 * OAuth Setup - Keep in alphabetical order
 *
 * ===================================================================================================== */
passport.use('facebook', new OAuth2Strategy({
  authorizationURL: settings.variables.facebook_authorization_url,
  tokenURL: settings.variables.facebook_token_url,
  clientID: settings.variables.facebook_client_id,
  clientSecret: settings.variables.facebook_client_secret,
  callbackURL: settings.variables.facebook_callback_url
},function(accessToken, refreshToken, profile, done){FacebookRoute.OnAccessToken(accessToken, refreshToken, profile, done)}
                                           ));


/* ========================================================================================================
 *
 * HTTP Methods
 * - Keep in alphabetical order
 * - Keep in url order
 * ===================================================================================================== */

/* ========================================================================================================
 *
 * Authentication Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'email'] }));

app.get('/auth/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook',
                        function(err, user, info) {
                          if (err) { console.log(err); return next(err); }
                          if (user)
                          {
                            console.log("http://"+settings.variables.domain+"/?token="+user.session_token)
                            return res.redirect("http://"+settings.variables.domain+"/?token="+user.session_token);
                          }
                        })(req, res, next)
});

/* ========================================================================================================
 *
 * Application Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

app.get('/applications/:id',function (req,res){
  var response = ApplicationRoute.GetApplication(req.headers['authorization'])
  response.on('data',function(results){
    response =CardsRoute.GetTemplates(req.headers['authorization'])
    response.on('data',function(templates){
      res.json({applications:results,templates:templates})
    })

  })
})

app.get('/settings/:id',function(req,res){
  SettingsRoute.GetSettings(req.headers['authorization']).on('data',function(settings){
    console.log('about to respond')
    res.json({settings:settings})
  })
})

/* ========================================================================================================
 *
 * Cards Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */
app.delete('/cards/:id',function (req,res){
  var response = CardsRoute.DeleteCard(req.headers['authorization'],req.params.id)
  response.on('data',function(results){
    res.json({})
  })
});

app.get('/cards',function (req,res){
  console.log('getting')
  var response = CardsRoute.GetAllCards(req.headers['authorization']);
  response.on('data',function(results){
    res.json({cards:results})
  })//res.json(ret);
});
app.get('/cards/:id',function (req,res){
  var response = CardsRoute.GetCard(req.headers['authorization'],req.params.id);
  response.on('data',function(results){
    res.json(results)
  })// UpdateCard
});

app.post('/cards',function (req,res){
  console.log(req.body.card.tagsIn)
  var card = req.body.card
  console.log(card);
  var tagsIn = card.tagsIn;
  delete card['attachments'];
  delete card['tags'];
  delete card['tagsIn'];
  var response
  if(card.template){
    response = CardsRoute.CreateCardFromTemplate(req.headers['authorization'],card,tagsIn,card.template)
  }else{
    response = CardsRoute.CreateCard(req.headers['authorization'],card,tagsIn)
  }
  response.on('data',function(results){
    res.json({card:results})
  })
});

app.put('/cards/:id',function (req,res){
  var response = CardsRoute.UpdateCard(req.body.card,req.params.id)
  response.on('data',function(results){
    res.json({})
  })
});

/* ========================================================================================================
 *
 * Templates Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/

app.get('/templates/:id',function(req,res){
  var template = req.body.template
  template.isTempalte = true;
  console.log(template)
  // var response = CardsRoute.CreateCard(req.headers['authorization'],,req.body.template.tagsIn)

})

app.post('/templates',function(req,res){
  var template = req.body.template
  template.isTemplate = true;
  var sections = template.sectionsIn;
  var tags = template.tags;
  delete template.sections;
  delete template.sectionsIn;
  delete template.tags;

  var responseStream = SectionRoute.GetSections(sections);
  responseStream.on('data',function(results){
    responseStream = CardsRoute.CreateCard(req.headers['authorization'],template,[]);
    responseStream.on('data',function(card){
      var counter = 0
      for(var i =0;i<results.length;i++){
        resultStream = SectionRoute.DuplicateAndLink(results[i],card.id,req.headers['authorization'])
        resultStream.on('data',function(section){
          counter++;
          if(counter === results.length){
            console.log('done')
            res.json({})
          }
        })
      }
    })

  })
});


app.put('/templates/:id',function(req,res){

})
/* ========================================================================================================
 *
 * Tags Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/
app.get('/tags',function(req,res){
  var responseStream = TagsRoute.GetTags(req.query.ids);
  responseStream.on('data',function(results){
    res.json({tags:results})
  })
})
/* ========================================================================================================
 *
 * Attachments Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/
app.put('/attachments/:id',function(req,res){
  //proccsss Attachment
  var resultStream = AttachmentRoute.updateAttachment(req.body.attachment,req.params.id)
  resultStream.on('data',function(results){
    res.json({attachment:results});
  })
});

app.post('/attachments',function(req,res){
  var body = req.body.attachment;
  console.log(body);
  var resultStream;
  //proccsss Attachment

  var methodName = 'Process'+body.type
  console.log(methodName)
  if(Proessor[methodName]){
    var processResultStream = Proessor[methodName](body.data);
    processResultStream.on('data',function(results){
      console.log('p results = '+results)
      body.data = results;
      resultStream = AttachmentRoute.createAttachment(body.data,req.headers['authorization'],[],body.sectionid)
      resultStream.on('data',function(results){
        res.json(results);
      })
    })
  }else{
    resultStream = AttachmentRoute.createAttachment(body.data,req.headers['authorization'],[],body.sectionid)
    resultStream.on('data',function(results){
      res.json(results);
    })
  }
})



app.get('/attachments',function(req,res){
  var resultStream = AttachmentRoute.getAttachments(req.query['ids'])
  resultStream.on('data',function(results){
    console.log(results)
    res.json({attachments:results})
  })

});


/* ========================================================================================================
 *
 * Sections Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/

app.get('/sections',function(req,res){
  var resultStream = SectionRoute.GetSections(req.query['ids']);
  resultStream.once('data',function(results){
    res.json({sections:results})
  })
});

app.delete('/sections/:id',function(req,res){
  var resultStream = SectionRoute.DeleteSection(req.params.id);
  resultStream.on('data',function(results){
    res.json(results)
  })
});

app.post('/sections',function(req,res){
  var body = req.body.section
  console.log('CREATING Section')
  if(body.type == 'Card'){
    var card = {
      title:body.title,
      left: 0,
      top:  0}
    var responseStream = CardsRoute.CreateCard(req.headers['authorization'],card,[])
    responseStream.on('data',function(results){
      var data = {cardid : results.id}

      //console.log(results)
      var resultStream = SectionRoute.CreateSection(body.title,body.type,body.position,body.card)
      resultStream.on('data',function(results){
        var ret = results;
        //{ id: '9071', type: 'Card', position: 27, card: '9008' }
        resultStream =  AttachmentRoute.createAttachment(data,req.headers['authorization'],[],results.id)
        resultStream.on('data',function(results){
          resultStream = CardsRoute.LinkCardToSection(ret.id,data.cardid);
          resultStream.on('data',function(results){
            res.json(ret);
          })
        })
        //function(data,token,tags,sectionId){
      });
    })
  }else{
    console.log('new Section Plain')
    var resultStream = SectionRoute.CreateSection(body.title,body.type,body.position,body.card)
    resultStream.on('data',function(results){
      console.log('returning')
      var response = CardsRoute.GetCard(req.headers['authorization'],results.card);
      response.on('data',function(card){
        res.json({card:card.card,section:results})
      })
      // res.json({section:results});
    })
  }
});



app.put('/sections/:id',function(req,res){
  //req.params.id
  console.log(req.body.section)
  var resultStream = SectionRoute.UpdateSection(req.body.section,req.params.id);
  /* = SectionRoute.DeleteSection();*/
  resultStream.on('data',function(results){
    res.json(results)
  })
});






/*app.put('/sections',function(req,res){
  var section = req.body.section
  var resultstream = SectionRoute.UpdateSection(section)
})*/

/* ========================================================================================================
 *
 * Links Methods - Keep in alphabetical order
 *
 * =====================================================================================================*/
app.delete('/links/:id',function (req,res){
  var response = LinksRoute.deleteAttachment(req.params.id)
  response.on('data',function(results){
    res.json(results);
  })
})
app.get('/links',function (req,res){LinksRoute.GetAllLinks(req,res)})
app.get('/links/:id',LinksRoute.GetLink)
app.post('/links',function (req,res){
  var responseStream = LinksRoute.GetLinkTitle(req.body.link.href);
  responseStream.on('error',function(error){})
  responseStream.on('data',function(results){LinksRoute.createAttachment('Link',results,req.headers['authorization'])})
});
// app.update('/links/:id',LinksRoute.UpdateLink)

/* ========================================================================================================
 *
 * Users Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */
app.get('/users/:id',function (req,res){UserRoute.GetUser(req,res)})

/* ========================================================================================================
 *
 * Tags Methods - Keep in alphabetical order
 *
 * ===================================================================================================== */

/*app.get('/tags/:id')
  app.update('/tags/:id')
  app.delete('/tags/:id')
  app.get('/tags')
  app.post('/tags')*/

Object.defineProperty(Object.prototype, "clone", {
  enumerable: false,
  value: function(from) {
    var ret = {}
    for(var prop in from){
      ret[prop] = from[prop];
    }
    return ret;
  }
});

app.listen(process.env.PORT || 4730);