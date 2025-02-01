const  express=require("express");

const postsroutes = require('./routes/routes.js'); 
const cors = require('cors');
// const mongoose=require('mongoose');
const mysql = require('mysql2');


const app=express();
app.use(cors());


const connection = mysql.createConnection({
    host: 'localhost',        
    user: 'root',             
    password: '@naveen04m',  
    database: 'insurance' 
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/pwskills', {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   }).then(() => {
//     console.log('Connected to MongoDB');
//   }).catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });
// mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/pwskills', {
   
//   }).then(() => {
//     console.log('Connected to MongoDB');
//   }).catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

const port=3001;

app.use(express.json());


app.use('/api', postsroutes)



app.listen(port,()=>{
    console.log(`app running at the port:${port}`);
});
