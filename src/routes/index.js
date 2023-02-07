const { graphqlHTTP } = require("express-graphql");

const logger = require("../middlewares/logger.js")
const chatController = require('../controllers/chatController.js')
const productController = require('../controllers/productController.js')
const Cart = require("../models/cart.js");
const cartController = require("../controllers/cartController.js");
const productGraphqlController = require("../controllers/productGraphqlController.js");

module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.get('/login', (req, res) => {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/signup', (req, res) => {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isAuthenticated, (req, res) => {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    app.get('/form', isAuthenticated, (req, res) => {
        res.render('form.ejs', {
            user: req.user
        });
    });

    app.get('/chat', chatController.getAllMessages)
    app.post('/chat/', chatController.postMessage)
    app.get('/chat/test/normalized', chatController.getTestMessages)


    app.post('/products/', productController.postProduct)
    app.get('/products/test', productController.getProductsTest)

    app.post('/api/products/', productController.postProduct)
    app.get('/api/products/test', productController.getProductsTest)
    app.get('/api/products', productController.getProducts)
    app.get('/api/products/:id', productController.getProduct);
    app.get('/api/products/image/:id', productController.getProductImage)
    app.delete('/api/products/:id', productController.deleteProduct)
    app.put('/api/products', productController.updateProduct)

    app.get('/store', isAuthenticated, (req, res) => {
        res.render('store.ejs', {
            user: req.user,
        });
    });

    app.get('/cart', (req, res) => {
        res.render('cart.ejs', {
            cart: Cart.getCart(),
            user: req.user
        })
    });

    app.post('/cart/add-to-cart/:id', cartController.addToCart);

    app.post('/cart/delete-in-cart/:id', cartController.deleteInCart);

    app.post('/cart/check-buy', cartController.checkBuy);

    app.use('/productsGraphql', graphqlHTTP(productGraphqlController));

    app.get('/logout', function (req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });

    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            logger.info("Ruta accedida");
            return next();
        }
        logger.info("Usuario no loggeado");
        res.redirect('/');
    }

    app.get('/*', (req, res) => {
        logger.info('Ruta no implementada')
    })
}