const mongodb = require('mongodb')
const MongoClient =  mongodb.MongoClient

const mongoConnect = () => {
    MongoClient.connect(
        'mongodb+srv://eleonorakazakova89_db_user:O39rkbvgKMmUs4SR@cluster0.wangstz.mongodb.net/?appName=Cluster0'
    )
    .then(client => {
        console.log('Connected!')
        callback(client)
    })
    .catch(err => console.err(err))
}

module.exports = mongoConnect
