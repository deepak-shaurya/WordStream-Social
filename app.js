const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');
const userModel = require('./models/userAcc');
const postmodal = require('./models/post');
const uplode = require('./configs/multerconfig')

app.use(cookieparser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static (path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard/uplode', auth ,(req, res) => {
    res.render('profileuplode');
});

app.post('/uplode', auth , uplode.single("image"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email});
    user.profilepic = req.file.filename;
    await user.save();
    console.log(req.file);
    res.redirect('/dashboard');
  

});

app.get('/login', (req, res) => { 
    res.render('login');
});

app.get('/dashboard', auth , async (req, res) => {
    try {
        const user = await userModel
            .findOne({ email: req.user.email })
            .populate('posts'); // Populate associated posts
        const posts = await postmodal.find().populate('user');
        res.render('dashboard', { user, posts});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
    // let posts = await postmodal.find();
});

app.post('/post', auth , async (req, res) => {
    const user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;
    let post = await postmodal.create({ 
        user : user._id,
        content
    })
    user.posts.push(post._id);
    user.save();
    res.redirect('/dashboard');
});



function auth(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.redirect('/');
    }
    try{
        const decoded = jwt.verify(token, "abcdfg");
        req.user = decoded;
        next();
    }
    catch(err){
        console.error("JWT verification failed:", err.message);
        return res.redirect('/');
    }
}

app.post('/register', async (req, res) =>{
    const {name, age, password, email, username} = req.body;
    let user = await userModel.findOne({email});
    if(user){
        return res.status(500).send("user registered alredy..")
    }else{
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash( password, salt, async (err, hash)=>{
                const newuser = await userModel.create({
                    name,
                    email,
                    age,
                    password : hash,
                    username
                })

                const token = jwt.sign({email:email , userid:newuser._id}, "abcdfg");
                res.cookie("token", token);
                res.redirect('/dashboard');
            })
        })
    }
})

app.post('/login', async (req, res) =>{
    const {password, email} = req.body;
    let user = await userModel.findOne({email});
    if(!user){
        return res.status(500).send("Invalid Details");
    }else{      
        bcrypt.compare(password, user.password, (err, result)=>{
            if (err) {
                return res.status(500).send("Error comparing passwords.");
            }
            if(result){
                const token = jwt.sign({email:email , userid:user._id}, "abcdfg");
                res.cookie("token", token);
                res.redirect('/dashboard');
            }
        });
    }
});

app.get('/logout', (req, res) =>{
    res.clearCookie("token");
    res.redirect('/login');
});



app.listen(3000);