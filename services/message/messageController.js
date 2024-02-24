const Message = require("./messageModel");
const HttpError = require("../../utils/http-error");
const User = require("../user/userModel");

const emailUsertoUserID = async (email, errorMessage) => {
    try {
        const existingUser = await User.findOne({ email: email });
        return existingUser;
    } catch (err) {
        console.log(err);
        const error = new HttpError(errorMessage, 500);
        throw error;
    }
};

const checkMessageIsExisting = async (messageId, errorMessage) => {
    try {
        const existingMessage = await Message.findById(messageId);
        return existingMessage;
    } catch (err) {
        console.log(err);
        const error = new HttpError(errorMessage, 500);
        throw error;
    }
};

const getMessages = async (req, res, next) => {
    let messages;

    try {
        messages = await Message.find({}, "-password");
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Fetching messages failed, please try again later.",
            500
        );
        return next(error);
    }

    res.json({
        messages: messages.map((message) =>
            message.toObject({ getters: true })
        ),
    });
};

const sendMessage = async (req, res, next) => {
    let newMessage;
    let savedMessage;

    try {
        const { sender, receiver, text } = req.body;

        if (!sender || !receiver) {
            const error = new HttpError(
                "Sender and receiver fields are required.",
                400
            );
            return next(error);
        }

        const senderUser = await emailUsertoUserID(
            sender,
            "Sender email is not existing"
        );
        const receiverUser = await emailUsertoUserID(
            receiver,
            "Receiver email is not existing"
        );

        newMessage = new Message({
            sender: senderUser._id,
            receiver: receiverUser._id,
            info: {
                text: text,
            },
        });

        savedMessage = await newMessage.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Sending failed, please try again later.",
            500
        );
        return next(error);
    }

    res.json({ message: savedMessage });
};

const viewMessage = async (req, res, next) => {
    try {
        const { messageId, receiver } = req.body;

        if (!receiver) {
            const error = new HttpError("Receiver fields are required.", 400);
            return next(error);
        }
        let existingMessage = await checkMessageIsExisting(
            messageId,
            "This message id is not existing"
        );
        const receiverUser = await emailUsertoUserID(
            receiver,
            "Receiver email is not existing"
        );

        if (
            existingMessage.receiver &&
            existingMessage.receiver.equals(receiverUser._id)
        ) {
            existingMessage.info.viewed = true;
            await existingMessage.save();
            res.json({ message: existingMessage });
        } else {
            const error = new HttpError(
                "This message receiver is not this user",
                500
            );
            throw error;
        }
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Viewing message failed, please try again later.",
            500
        );
        return next(error);
    }
};

const getMessagesByUserId = async (userId) => {
    try {
        const messages = await Message.find({ receiver: userId })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ "info.sentAt": "desc" })
            .exec();

        return messages;
    } catch (err) {
        console.log(err);
        throw new HttpError(
            "Fetching messages failed, please try again later.",
            500
        );
    }
};

const viewRecieverMessage = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        console.log(userId);

        const messages = await getMessagesByUserId(userId);

        res.json({
            messages: messages.map((message) =>
                message.toObject({ getters: true })
            ),
        });
    } catch (err) {
        console.log(err);
        const status = err.statusCode || 500;
        const error = new HttpError(
            err.message || "Fetching messages failed, please try again later.",
            status
        );
        return next(error);
    }
};

exports.getMessages = getMessages;
exports.sendMessage = sendMessage;
exports.viewMessage = viewMessage;
exports.viewRecieverMessage = viewRecieverMessage;
