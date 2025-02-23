const { log } = require("console");
const express = require("express");
const fs = require("fs");

const PORT = 4000;


const app = express();

app.set('view engine', 'ejs');

// middlewares
app.use(express.static("public")); // for css
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use((req, res, next) => {
    const logData = {
        method: req.method,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        query: req.query,
        body: req.method === "GET" ? {} : req.body,
    };
    console.log('\nLogs');
    console.log(logData);
    next();
})


app.get('/', (req, res) => {
    res.redirect('/posts');
})
app.get('/posts', (req, res) => {
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            res.send(500).send('Error reading posts.');
            return;
        }
        const posts = JSON.parse(data);
        res.render("home", { posts });
    });
});
app.get('/post', (req, res) => {
    const postId = req.query.id;

    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading posts.');
            return;
        }
        const posts = JSON.parse(data);
        const post = posts.find(p => p.id == postId);
        if (!post) {
            res.send("Post not Found!");
            return;
        }
        res.render('post', { post });
    })
})
app.get('/add-post', (req, res) => {
    res.render('addPost');
})
app.post('/add-post', (req, res) => {
    const reqData = req.body;
    if (!reqData.title || !reqData.content || !reqData.author) {
        res.status(400).send('Incomplete Data');
        return;
    }
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Sever Error');
            return;
        }
        reqData.id = 0;
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
        reqData.date = formattedDate;
        if (data) {
            data = JSON.parse(data);
            reqData.id += data.length;
            data.push(reqData);
        }
        else {
            data = [reqData];
        }
        
        // Writing to posts.json file
        fs.writeFile('posts.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing data');
                return;
            }
            res.redirect('/posts');
        })
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})