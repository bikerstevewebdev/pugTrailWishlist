const AWS    = require('aws-sdk')
    , bcrypt = require('bcrypt')
    , db     = require('./db')
require('dotenv').config()
const {
      SALT_ROUNDS
    , AWS_ACCESSKEY
    , AWS_REGION
    , AWS_S3_BUCKET
    , AWS_SECRETKEY
} = process.env

AWS.config.update({
      accessKeyId: AWS_ACCESSKEY
    , secretAccessKey: AWS_SECRETKEY
    , region: AWS_REGION
})

const S3 = new AWS.S3()

module.exports = {
    uploadPhoto: (req, res) => {
        const { photo, type } = req.body
        bcrypt.hash(photo.filename, SALT_ROUNDS/1).then(hash => {
            let newFileName = hash + `${Date.now()}`
                , buf       = new Buffer(photo.file.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                , params    = {
                      Bucket: AWS_S3_BUCKET
                    , Body: buf
                    , Key: newFileName
                    , ContentType: photo.filetype
                    , ACL: 'public-read'
                }            
            S3.upload(params, (err, data) => {
                console.log(err, data)
                if (err) {
                    res.status(500).send(err)
                } else {
                    db.query(`UPDATE users SET profile_pic = ? WHERE user_id = ?`, [data.Location, req.user.user_id], (err, photos) => {
                        if(err){
                            console.log('Error inserting photo to DB: ', err)
                        }else{
                            res.status(200).send(photos)
                        } 
                    })
                }
            })
        }).catch(err => {
            console.log('Bcrypt ERROR For Hashing the Filename: ', err, 'SALT_ROUND are as follows: ', SALT_ROUNDS, 'Photo.Filename is as follows: ', photo.filename )
        })
    }
}