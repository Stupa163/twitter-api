const express = require('express');
const router = express.Router();
const fs = require('fs');
const aws = require('aws-sdk');
require('dotenv').config();
const axios = require('axios')

router.get('/', (req, res) => {
    const s3 = new aws.S3({
        signatureVersion: 'v4',
        region: 'eu-west-3'
    });
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: 'tweets.json',
        Expires: 60,
    };

    s3.getSignedUrl('getObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.json({error: err});
        }
        axios.get(data)
            .then((result) => {
                res.json(result.data)
            })
            .catch((error) => {
                console.log(error);
            })
    });
})

router.post('/', (req, res) => {
    const userImage = req.body.userImage;
    const pseudo = req.body.pseudo;
    const image = req.body.image;
    const content = req.body.content;

    const s3 = new aws.S3({
        signatureVersion: 'v4',
        region: 'eu-west-3'
    });
    const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: 'tweets.json',
        Expires: 60,
    };

    s3.getSignedUrl('getObject', s3Params, (err, data) => {
        if(err){
            console.log('1', err);
            return res.json({error: err});
        }
        axios.get(data)
            .then((result) => {
                const existing = result.data;
                existing.push({userImage, pseudo, image, content});

                const params = {Bucket: process.env.S3_BUCKET_NAME, Key: 'tweets.json', Body: JSON.stringify(existing) };

                s3.putObject(params, (error, data) => {
                    if (error) {
                        console.log('2', error);
                        res.json({error})
                    }

                    res.json({status: 'ok'})
                })

            })
            .catch((error) => {
                console.log('3', error);
            })
    });
})

// router.post('/', (req, res) => {
//     const userImage = req.body.userImage;
//     const pseudo = req.body.pseudo;
//     const image = req.body.image;
//     const content = req.body.content;
//
//     const existing = JSON.parse(fs.readFileSync(`${__rootDir}/files/tweets.json`, 'utf8')) || [];
//     existing.push({userImage, pseudo, image, content});
//
//     fs.writeFile(`${__rootDir}/files/tweets.json`, JSON.stringify(existing), (err) => {
//         if (err) {
//             res.json({error: err})
//         }
//
//         res.json({status: 'ok'})
//
//     })
// })

module.exports = router;
