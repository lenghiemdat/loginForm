const express = require('express');
const multer = require('multer');
const cors = require('cors')
const fs = require('fs');
const db = require('./config/db')


const app = express();

const PORT = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());

// Route to get all posts
app.get("/api/get", (req, res) => {
    db.query("SELECT * FROM blogs", (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    }
    );
});

// Route to get one post
app.get("/api/getFromId/:id", (req, res) => {

    const id = req.params.id;
    db.query("SELECT * FROM blogs WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    }
    );
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/api/image/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

app.post('/api/image/create', upload.single('image'), (req, res, err) => {
    if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' })
    } else {

        console.log('File: ', req.file)

        const img = fs.readFileSync(req.file.destination + req.file.filename);
        const caption = req.file.originalname;
        db.query("INSERT INTO picture (caption, img) VALUES (?,?)", [caption, img], (err, result) => {
            if (err) {
                console.log(err)
            }
            console.log(result)
        });
    }

});

app.get('/api/image/read', (req, res, err) => {

    db.query("SELECT * FROM picture", (err, result) => {
        if (err) {
            console.log(err)
        };

        if (result) {
            res.send(result)
        };
    });

});






// Route for creating the post
app.post('/api/create', (req, res) => {

    const title = req.body.title;
    const context = req.body.context;
    const author = req.body.author;

    console.log(title, context, author)

    db.query("INSERT INTO blogs (title, context, author) VALUES (?,?,?)", [title, context, author], (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
    });
})

app.post('/api/create/image', upload.single('image'), (req, res, err) => {
    if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' })
    } else {

        console.log('File: ', req.file)

        const readFile = (req) => {
            return new Promise((resolve, reject) => {
                if (req) {
                    const img = fs.readFileSync(req.file.destination + req.file.filename);
                    resolve(img);
                } else {
                    console.log(console.error());
                    reject();
                }
            });
        }


        readFile(req)
            .then((result) => {
                db.query("UPDATE blogs SET link = ? WHERE id = (SELECT max(id) FROM blogs) AND link IS null", [result], (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                });

            })
            .catch(error => console.log(error));
    }

});










// Route for like
app.post('/api/like/:id', (req, res) => {

    const id = req.params.id;
    db.query("UPDATE blogs SET likes = likes + 1 WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
    }
    );
});

// Route to delete a post

app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM blogs WHERE id= ?", id, (err, result) => {
        if (err) {
            console.log(err)
        }
    })
})


app.get("/services/get", (req, res) => {
    db.query("SELECT * FROM services", (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    }
    );
});

app.post('/services/accesses/:id', (req, res) => {

    const id = req.params.id;
    db.query("UPDATE services SET accesses = accesses + 1 WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
    }
    );
});

app.get("/services/get/:search", (req, res) => {

    const search = req.params.search;
    db.query("SELECT * FROM services WHERE description LIKE ?", "%" + search + "%", (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    }
    );
});



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

