const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		console.log('Connecting to database...');
		await mongoose.connect(
            "mongodb+srv://salehgovahi:salehgovahi@taskmanagercluster.ge4vktg.mongodb.net/?retryWrites=true&w=majority",
            {
                writeConcern: {
                    w: "majority",
                    wtimeout: 2500,
                },
            }
        );
		console.log('MongoDB Connected...');
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;