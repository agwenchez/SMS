const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.API_KEY;
const UserName = process.env.username;

app.post(`/create-contacts`, (req, res) => {
	const data = new ContactsModel(req.body);
	console.log(req.body);
	data.save().then((result) => {
		res.status(200).json(result);
	}).catch((err) => {
		res.status(500).send({ message: 'could not save the data into the database' })
	});
})

app.get('/contacts', (req, res) => {
	ContactsModel.find().then((result) => {

		res.json(result);
	}).catch((err) => {
		res.json(err.stack);
	});

})

app.post('/send_sms', (req, res) => {
    const {tel_number,smsMessage}=req.body


    console.log(tel_number);
    
    const credentials = {
        apiKey: `${API_KEY}`,
        username: `${UserName}`
    }
    
    // Initialize the SDK
    const AfricasTalking = require('africastalking')(credentials);
    
    // Get the SMS service
    const sms = AfricasTalking.SMS;
    
    function sendMessage() {
        const options = {
            // Set the numbers you want to send to in international format
            to: tel_number,
            // Set your message
            message: smsMessage,
            // Set your shortCode or senderId
            // from: 'XXYYZZ'
        }
    
        // That’s it, hit send and we’ll take care of the rest
        sms.send(options)
            .then(console.log)
            .catch(console.log);
    }
    sendMessage();
    res.status(200).send('Message sent successfully');


});

mongoose
	.connect('mongodb://localhost:27017/sms-app', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
	.then(() => {
		app.listen(port, () => console.log(`Server running on port ${port}`));
	})
	.catch(error => {
		console.log({
			message: `Unable to establish a connection to the server ${error}`
		});
	});
