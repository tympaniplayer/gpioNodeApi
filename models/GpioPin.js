var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var PinSchema   = new Schema({
    pin: Number,
    status: String
});

module.exports  = mongoose.model('GpioPin', PinSchema); 
