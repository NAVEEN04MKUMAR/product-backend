const  express=require("express");
const bodyparser = require('body-parser');
const postsroutes = require('./routes/routes.js'); 

const app=express();
const port=3001;

app.use(express.json());

app.use(bodyparser.json());  // Parse incoming JSON requests

app.use('/', postsroutes)

// app.get('/',(req,res)=>{
//     res.send('welcom to my api');
// });

app.listen(port,()=>{
    console.log(`app running at the port:${port}`);
});