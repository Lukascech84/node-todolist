/* Připojení modulu frameworku Express (https://expressjs.com/) */
const express = require("express");

 /* Připojení externího modulu body-parser (https://www.npmjs.com/package/body-parser) -middleware pro parsování těla požadavku */
const bodyParser = require("body-parser"); 

/* Připojení externího modulu moment (https://momentjs.com/) -knihovna pro formátování datových a časových údajů */
const moment = require("moment"); 

/* Připojení vestavěných modulů fs (práce se soubory) a path (cesty v adresářové struktuře) */
const fs = require("fs");
const path = require("path");

/* Vytvoření základního objektu serverové aplikace */
const app = express();

/* Nastavení portu, na němž bude spuštěný server naslouchat */
const port = 3000;

app.use(express.static("public"));
/* Spuštění webového serveru */

/* Identifikace složky obsahujícístatické soubory klientské části webu */
app.use(express.static("public"));/* Nastavení typu šablonovacího engine na pug*/
app.set("view engine", "pug");/* Nastavení složky, kde budou umístěny šablony pug */
app.set("views", path.join(__dirname, "views"))

const urlencodedParser = bodyParser.urlencoded({extended: false});

let date = moment().format('YYYY-MM-DD')

app.post("/savedata", urlencodedParser, (req, res) => {

    let data = `"${req.body.ukol}","${req.body.predmet}","${date}","${req.body.odevzdani}"\n`

    fs.appendFile(path.join(__dirname, "data/ukoly.csv"), data, (err) => {
        if(err){
        console.log('Nastala chyba: ', err);
        return res.status(400).json({
            success: false,
            message: "Nastala chyba při zapisu do souboru!"
        });
        };
        res.redirect(301, '/');
    });
});

app.get('/todolist', (req,res) => {
fs.readFile(path.join(__dirname, "data/ukoly.csv"), (err, data) => {
res.send(data);
});
});

app.get('/pokus', (req,res) => {
res.render('index', {nadpis: 'Seznam úkolů'});
});


app.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}`);
});