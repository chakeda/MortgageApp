'use strict';

var express = require('express');
var controller = require('./email.controller');

var router = express.Router();
var nodemailer = require('nodemailer');

// email api routes
router.post('/', handleEmailPrimaryApplicant); 
function handleEmailPrimaryApplicant(req, res) {
    
    // protip: you have to absolutely destroy your account email security to get this to work
    var transporter = nodemailer.createTransport('smtps://noreply%40uxweb.io:mypushcart@smtp.gmail.com');

    var mailOptions = {
        from: 'noreply@uxweb.io',
        to: req.body.email, 
        subject: req.body.subject,
        html: req.body.text 
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        res.send(200);
    });

}

router.get('/', controller.index);
router.get('/:id', controller.show);
//router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
