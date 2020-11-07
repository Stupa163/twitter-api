const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', (req, res) => {
    const content = JSON.parse(fs.readFileSync(`${__rootDir}/files/tweets.json`, 'utf8'));
    res.json({content});
});

router.post('/', (req, res) => {
    const userImage = req.body.userImage;
    const pseudo = req.body.pseudo;
    const image = req.body.image;
    const content = req.body.content;

    const existing = JSON.parse(fs.readFileSync(`${__rootDir}/files/tweets.json`, 'utf8')) || [];
    existing.push({userImage, pseudo, image, content});

    fs.writeFile(`${__rootDir}/files/tweets.json`, JSON.stringify(existing), (err) => {
        if (err) {
            res.json({error: err})
        }

        res.json({status: 'ok'})

    })
})

module.exports = router;
