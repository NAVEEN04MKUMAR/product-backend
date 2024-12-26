const  express=require("express");
// const bodyparser = require('body-parser');
const postsroutes = require('./routes/routes.js'); 
const cors = require('cors');
const mongoose=require('mongoose');


const app=express();
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const port=3001;

app.use(express.json());

// app.use(bodyparser.json());  // Parse incoming JSON requests

app.use('/api', postsroutes)

// app.get('/',(req,res)=>{
//     res.send('welcom to my api');
// });

app.listen(port,()=>{
    console.log(`app running at the port:${port}`);
});