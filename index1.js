const  express=require("express");

const postsroutes = require('./routes/routes.js'); 
const cors = require('cors');
const mongoose=require('mongoose');


const app=express();
app.use(cors());

mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/pwskills', {
   
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const port=3001;

app.use(express.json());


app.use('/api', postsroutes)



app.listen(port,()=>{
    console.log(`app running at the port:${port}`);
});
