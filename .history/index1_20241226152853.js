const  express=require("express");
const app=express();
const port=3000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('welcom to my api');
});

app.listen(port,()=>{
    console.log(`app running at the port:${port}`);
});