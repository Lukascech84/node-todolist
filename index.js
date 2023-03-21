const express = require("express");
const csvtojson = require('csvtojson');
const bodyParser = require("body-parser"); 
const moment = require("moment"); 
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
csvtojson({headers: ['ukol','predmet','zadani','odevzdani']})
.fromFile(path.join(__dirname, "data/ukoly.csv"))
.then( data =>{ 
    res.render('index', {nadpis: "Seznam úkolů", ukoly: data});
})
.catch( error => { 
console.log(error);
})});

app.get('/about', (req,res) => {
res.render('index', {nadpis: 'Seznam úkolů'});
});


app.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}`);
});