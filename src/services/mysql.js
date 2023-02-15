const mysql = require('mysql')


const db = mysql.createConnection({
    host : 'localhost',
    user:'root',
    password:'',
    database: 'leverance_demo_db'
})


async function mysqlConnect () {
    await db.connect((err) => {
        if (err) throw err
        console.log('mySQL is now connected')
    })
}

module.exports = {
    db,
    mysqlConnect
};