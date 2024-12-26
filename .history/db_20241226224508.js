const mongoose = require("mongoose");

// Replace <connection_string> with your MongoDB connection string
const mongoURI = "mongodb+srv://pwskills:pwskills@cluster.mongodb.net/pwskills?retryWrites=true&w=majority";

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = mongoose;
