var express = require('express')
var fs = require('fs')
var https = require('https')
var path = require('path');
var app = express()
var multer  = require('multer')
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const bodyParser = require('body-parser')
const session = require('express-session')
const { home } = require('./home');

var maxSize = 4 * 1000 * 1000;

const upload = multer({
  limits:{
	fileSize:maxSize 
	},
  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png/
    var mimetype = filetypes.test(file.mimetype)
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname && file.originalname === escape(file.originalname)) {
      return cb(null, true)
    }
    cb("Error: File upload not valid")
  },
  dest: './uploads'
})

app.use(upload.single('avatar'))

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ['*'],
      upgradeInsecureRequests: true,
    },
  })
);
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(
  helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true })
);
app.use(helmet.ieNoOpen());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(csrf({ cookie: true }))

app.get('/', function(req, res) {
  res.send(
    home({
      csrfToken: req.csrfToken()
    })
  )
})


app.post('/upload', upload.single('avatar'), function (req, res, next) {
  fs.chmodSync(`./uploads/${req.file.filename}`, '666')
  res.redirect(`/display?image=${req.file.filename}`)
})

app.get('/display', function(req, res, next) {
  fs.readFile(`./uploads/${req.query.image}`, function(err, data){
    if(err) throw err
    res.header('Content-Type', 'image/jpg')
    res.send(data)
 })
})



https.createServer(
  {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
  app
).listen(process.env.PORT);