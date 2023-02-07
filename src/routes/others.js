const compression = require("compression");

const logger = require("../middlewares/logger.js");
const randomData = require("../middlewares/faker.js");
const getSystemInformation = require("../middlewares/info.js");
const { getRandoms } = require('../middlewares/randomNumbers.js');


const fakerData = randomData();
const infoSystem = getSystemInformation();


module.exports = (app) => { // recordar aplicar la dependencia logger

    app.get("/api/products-test", async (req, res) => {
        console.log("Conexión establecida a faker");
        logger.info("Ruta accedida");
        res.send(fakerData);
    });

    app.get("/info", (req, res) => {
        logger.info("Ruta accedida");
        res.json(infoSystem);
    });

    app.get("/info/gzip", compression(), (req, res) => {
        logger.info("Ruta accedida");
        res.json(infoSystem);
    });

    app.get('/api/randoms', getRandoms);
}

