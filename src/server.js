require("dotenv").config();
require('./persistence/store/firebase/connection');
const express = require("express");
const session = require("express-session");
const path = require("path");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true, }

require("./config/passport.js")(passport);
const { url } = require("./config/database.js");
const productsDB = require('./persistence/productPersistence.js');
const chatDB = require('./persistence/chatPersistence.js');

const PORT = 8080;

mongoose.set("strictQuery", false);
mongoose.connect(url, advancedOptions);

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mirkoNodeJSBackend',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 120 * 60 * 60 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    console.log(app.locals);
    next();
});

async function sockets(socket) {
    console.log("Conexión establecida con sockets");
    const dbProducts = await productsDB.getAllProducts();
    io.sockets.emit("products", dbProducts);
    const dbMessages = await chatDB.getAllMessages();
    io.sockets.emit("messages", dbMessages);

    socket.on("product", async (product) => {
        productsDB.addProduct(product);
        const dbProducts = await productsDB.getAllProducts();
        io.sockets.emit("products", dbProducts);
    });

    socket.on("message", async (message) => {
        chatDB.addMessage(message);
        const dbMessages = await chatDB.getAllMessages();
        io.sockets.emit("messages", dbMessages);
    });
}

require("./routes/index.js")(app, passport);
require("./routes/others.js")(app);


io.on('connection', sockets);
httpServer.listen(PORT, console.log(`Server corriendo en el puerto: ${PORT} - PID(${process.pid}) - (${new Date().toLocaleString()})`));
