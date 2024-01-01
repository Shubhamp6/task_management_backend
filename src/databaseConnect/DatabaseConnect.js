const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://vibenr:1234@cluster0.0cpfzke.mongodb.net/?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("connected");
	})
	.catch((err) => {
		console.log(err);
	});
