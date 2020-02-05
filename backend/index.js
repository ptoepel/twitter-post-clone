const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI ||'localhost/denverwesties');

const shouts = db.get('shouts');
const filter = new Filter();

app.use(cors());

app.use(express.json());


app.get('/', (req,res) =>{
    res.json({
      message:"Chuck-a-khan"  
    });
});

app.get('/shouts', (req,res) => {
    shouts
    .find()
    .then(shouts => {
        res.json(shouts);
    });
});

function isValidShout(shout){
 return shout.name && shout.name.toString().trim() != '' &&
  shout.content && shout.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs:5 * 1000,
    max:1
}));

app.post('/shouts', (req,res) =>{
    if(isValidShout(req.body)){
        const shout = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created:new Date()
        };

        shouts
        .insert(shout)
        .then(createdShout => {
            res.json(createdShout);
        });
    }else{
        res.status(422);
        res.json({
            message: "hey! Fields cannot be left blank"
        })
    }
});

app.listen(5000,() => {
    console.log('listening');
});
