const express = require('express');
const router = express.Router();

const messageController = require('./messageController');

router.get('/', messageController.getMessages);

router.get('/receiver/:uid', messageController.viewRecieverMessage);

router.post('/send', messageController.sendMessage);

router.post('/view', messageController.viewMessage);

module.exports = router;