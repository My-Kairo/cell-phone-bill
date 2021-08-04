const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');


// use moments for timestamp and use function fromnow
// round off to two decimal point

const app = express();
const SettingsBil = SettingsBill();

app.engine('handlebars', exphbs({defaultLayout: 'main',layoutsDir: 'views/layouts'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

app.get('/', function(req, res){ // this '/' means the default route
    res.render('index', {
        settings: SettingsBil.getSettings(),
        totals: SettingsBil.totals(), level: SettingsBil.returnLevels()
    });
});

app.post('/settings', function(req, res){
    console.log(req.body);

    SettingsBil.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
    console.log(SettingsBil.getSettings());
    res.redirect('/');

})

app.post('/action', function(req, res){

    SettingsBil.recordAction(req.body.actionType);

    res.redirect('/');
});

app.get('/actions', function(req, res){
    res.render('actions', {actions: SettingsBil.actions()});
})

app.get('/actions/:actionType', function(req, res){
    const actionType = req.params.actionType;
    res.render('actions', {actions: SettingsBil.actionsFor(actionType)});
});

let PORT = process.env.PORT || 3011;

app.listen(PORT, function(){
    console.log('App started at port', PORT) //add PORT to console to make the port configurable 
})
