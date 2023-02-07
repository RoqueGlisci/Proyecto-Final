const open = require("open");
const nodemailer = require("nodemailer");

const Cart = require('../models/cart.js');


exports.addToCart = (req, res, next) => {
    const { id, name, price, img } = req.body;
    Cart.save({ id, name, price, img })
    res.redirect('/cart');
}

exports.deleteInCart = (req, res, next) => {
    const { id } = req.params
    Cart.deleteProductInCart(id);
    res.redirect('/cart');
}

async function buy() {
    const cart = Cart.getCart().products;
    const productos = cart.map((element) => {
        console.log(element);
        let nuevoElemento = {
            title: element.name,
            picture_url: element.img,
            quantity: Number(element.qty),
            currency_id: "ARS",
            unit_price: Number(element.price),
        };
        return nuevoElemento;
    });
    const response = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
            method: "POST",
            headers: {
                Authorization: "Bearer TEST-2004336226964797-011621-8af45d2f304340f63094770a87458a35-178503961",
            },
            body: JSON.stringify({
                items: productos,
            }),
        }
    );
    const data = await response.json();
    open(data.init_point);
}

function createSendMail(mailConfig) {
    const transporter = nodemailer.createTransport(mailConfig);

    return function sendMail({ to, subject, text, html }) {
        const mailOptions = {
            from: mailConfig.auth.user,
            to,
            subject,
            text,
            html,
        };

        return transporter.sendMail(mailOptions);
    };
}

const MY_EMAIL = process.env.MY_EMAIL;

function createSendMailGmail() {
    return createSendMail({
        service: "gmail",
        port: 587,
        auth: {
            user: MY_EMAIL,
            pass: process.env.NODEMAILER_PASS,
        },
    });
}

const sendMail = createSendMailGmail();

const emailCheckout = (cart) => sendMail({
    to: process.env.TO_EMAIL,
    subject: "Productos Enviados",
    html: `Productos Enviados y monto total: ${JSON.stringify(cart)}`
});


exports.checkBuy = (req, res, next) => {
    const orden = {
        buyer: {
            email: req.user.email
        },
        items: Cart.getCart().products,
        date: new Date().toLocaleString(),
        total: Cart.getCart().totalPrice
    }
    buy();
    emailCheckout(Cart.getCart());
    res.redirect('/store');
}