const express = require("express");
const router = express.Router();

const userRoute = require('./user/userRoute');
const messageRoute = require('./message/messageRoute')


router.use('/user', userRoute);
router.use('/message', messageRoute);


module.exports = router;