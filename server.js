#!/bin/env node

var express = require('express');

//JSX Transpiler
//require("node-jsx").install({harmony: true});

var fs      = require('fs');
var bodyParser = require('body-parser');
//var contactme = require('./routes/contactMe');
var React = require('react');
//var LandingScreen = React.createFactory(require('./lib/components/landing'));
//var AboutMeScreen = React.createFactory(require('./lib/components/home'));
var http = require('http');
var i18next = require('i18next');
//var fileName = __dirname + '/css/style.css', CSS = '<link href="/css/style.css" rel="stylesheet" type="text/css" />';

// fs.exists(fileName, function(exists) {
//   if (exists) {
//     fs.stat(fileName, function(error, stats) {
//       fs.open(fileName, "r", function(error, fd) {
//         var buffer = new Buffer(stats.size);
//
//         fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
//           var data = buffer.toString("utf8", 0, buffer.length);
//           CSS = '<style type="text/css" rel="stylesheet">'+data+'</style>';
//           fs.close(fd);
//         });
//       });
//     });
//   }
// });

//i18N Initialization
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['fr', 'en'],
  resGetPath: 'resources/locales/__lng__/__ns__.json'
});

/**
 *  Define the application.
 */
var Nodeapp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8081;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.setupCORS = function(req, res, next){
      res.header('Access-Control-Allow-Origin', '*.jsfoobar.com');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    };

    // self.setupLocalization = function(req, res, next) {
    //   req.i18next = new i18next();
    //   next();
    // };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        // self.createRoutes();
        self.app = express();

        //Static Resources
        self.app.use('/css', express.static('css'));
        self.app.use('/resources', express.static('resources'));

        // self.app.use(i18next.handle);
        // i18next.registerAppHelper(self.app);

        //Body Parser
        self.app.use(bodyParser.json());
        self.app.use(bodyParser.urlencoded({ extended: false }));

        //Allow CORS
        // self.app.use(self.setupCORS);

        //Routes
        //self.app.post('/contactMe', contactme.save);

        //Connecting a different domain/port using http-proxy
        /*self.app.all('/contactme', function(client_req, client_res){
          console.log('Listening to /contactme');
          var options = {
            hostname: 'localhost',
            port: 8446,
            path: client_req.url,
            method: client_req.method
          };
          var proxy = http.request(options, function (res) {
            res.pipe(client_res, {
              end: true
            });
          });
          client_req.pipe(proxy, {
            end: true
          });
        });*/
    };


    /**
     *  Initializes the application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the  application).
     */
    self.start = function() {

        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), self.ipaddress, self.port);
        });

        self.app.get('/', function (req, res) {
             res.render('index.ejs');
            // var i18n = {
            //   h1: i18next.t('app.landing.header.h1'),
            //   aboutme: i18next.t('app.landing.links.aboutme'),
            //   myblog: i18next.t('app.landing.links.myblog'),
            //   footer: i18next.t('app.landing.footer'),
            //   lang: {
            //     en: i18next.t('app.landing.lang.en'),
            //     fr: i18next.t('app.landing.lang.fr'),
            //     es: i18next.t('app.landing.lang.es')
            //   }
            // },
            // contentLanding = React.renderToString(LandingScreen({ssr: true, translate: i18n})),
            // HTML = '<!doctype html><html><head><meta name="description" content="Javascript Blog of Jyoti Kaustuv Nanda"><meta name="keywords" content="javascript blog, javascript experiences, react js examples, server site rendering examples, web component examples"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"><title>jsfoobar - a javascript blog</title>'+ CSS +'</head><body class="landing"><div id="container">'+ contentLanding +'</div><link href="http://fonts.googleapis.com/css?family=Pontano+Sans" rel="stylesheet" type="text/css" /><script type="text/javascript" src="/resources/js/bundle-landing.js"></script></body></html>';
            // res.send(HTML);
        });

        // self.app.get('/aboutme', function (req, res) {
        //   // res.render('aboutme/index.ejs', {});
        //     var i18n = {
        //       h1: i18next.t('app.header.h1'),
        //       h2: i18next.t('app.header.h2'),
        //       headerLink1: i18next.t('app.header.links.link1'),
        //       headerLink2: i18next.t('app.header.links.link2'),
        //       headerLink3: i18next.t('app.header.links.link3'),
        //       headerLink4: i18next.t('app.header.links.link4'),
        //       nm: i18next.t('app.aboutme.name'),
        //       para1: i18next.t('app.aboutme.para1'),
        //       para2: i18next.t('app.aboutme.para2'),
        //       para3: i18next.t('app.aboutme.para3'),
        //       link1: i18next.t('app.aboutme.links.link1'),
        //       link2: i18next.t('app.aboutme.links.link2'),
        //       link3: i18next.t('app.aboutme.links.link3'),
        //       copyright: i18next.t('app.footer.copyright'),
        //       section1: i18next.t('app.footer.section1'),
        //       section2: i18next.t('app.footer.section2'),
        //       section3: i18next.t('app.footer.section3'),
        //       dayphone: i18next.t('app.footer.dayphone'),
        //       evephone: i18next.t('app.footer.evephone'),
        //       emailid: i18next.t('app.footer.emailid')
        //     },
        //     contentAboutMe = React.renderToString(AboutMeScreen({ssr: true, translate: i18n})),
        //     HTML = '<!doctype html><html><head><meta name="description" content="Profile of Jyoti Kaustuv Nanda"><meta name="keywords" content="about jyoti kaustuv nanda, profile of jyoti kaustuv nanda, ui developer profile, web component developer, web developer, user interface developer, javascript developer, node js developer, fullstack ui developer"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"><title>About Jyoti</title>'+ CSS +'</head><body class="aboutme"><div id="container" class="container">'+ contentAboutMe +'</div><link href="http://fonts.googleapis.com/css?family=Pontano+Sans" rel="stylesheet" type="text/css" /><script type="text/javascript" src="/resources/js/bundle-profile.js"></script></body></html>';
        //     res.send(HTML);
        // });

        // self.app.get('/myblog', function (req, res) {
        //   res.render('myblog/index.ejs', {});
        // });
    };

};   /*  Application.  */

/**
 *  main():  Main code.
 */
var app = new Nodeapp();
app.initialize();
app.start();
