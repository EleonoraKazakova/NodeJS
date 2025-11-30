const mongodb = require('mongodb')
const MongoClient =  mongodb.MongoClient

let _db

const mongoConnect = () => {
    MongoClient.connect(
        'mongodb+srv://eleonorakazakova89_db_user:O39rkbvgKMmUs4SR@cluster0.wangstz.mongodb.net/?appName=Cluster0'
    )
    .then(client => {
        console.log('Connected!')
        _db = client.db()
        callback(client)
    })
    .catch(err => {
        console.error(err)
        throw err
    })
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
