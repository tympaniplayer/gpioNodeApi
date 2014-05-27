// server.js
// Base Setup
// =========================================================================
// call the packages we need
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    gpio        = require('pi-gpio'),
    GpioPin     = require('./models/GpioPin'),
connectionHelper = require('./connection.js');

connectionHelper.createConnection();




// Functions 
// ========================================================================


// configure app to use bodyParser()
// this will let us get data from POST body
app.use(bodyParser());

var port = process.env.PORT || 8080;

// ROUTES
// =========================================================================
var router = express.Router();

router.get('/', function(req, res){
    res.json({message: 'usage /gpio get pin state or update pin state'});
});
router.route('/gpio')
.post(function(req, res){
    var pin = new GpioPin();
    pin.pin = req.body.pin;
    pin.status = "off";
    pin.save(function(err){
        if(err){
            res.send(err);
        }
        res.json({message: 'Pin Created'});
    });
});
// Single pin routes
// ==========================================================================
router.route('/gpio/:pin_id')
.put(function(req, res){
       GpioPin.findOne({ pin: req.params.pin_id }, function(err, pin){
            if(err){
                if(err.type != "ObjectId"){
                    res.send(err);
                    return;
                }
                
            }
            var write = parseInt(req.body.write);
            console.log(pin.pin);
            console.log(write);
            gpio.open(pin.pin, "output", function(err){

                gpio.write(pin.pin, write, function(){
                    debugger;
                    if(write == 1){
                        pin.status = 'on';
                    }
                    else{
                        pin.status = 'off';
                    }
                    gpio.close(pin.pin);
                    // Update or insert new pin
                    pin.save(function(err){
                        if(err){
                            res.send(err);
                        }
                        res.json(pin);
                    });
                });
            });
       });
    })
    .get(function(req, res){
        GpioPin.find(function(err, gpioPins){
            if(err){
                res.send(err);
            }
            res.json(gpioPins);
        });
    });

// Register Routes
app.use('/api', router);


// Start the Server
//=========================================================================
app.listen(port);

console.log('Server started on ' + port);
