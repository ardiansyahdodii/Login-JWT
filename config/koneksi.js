import mysql from 'mysql';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auth'
})

// db.connect( (err) =>{
//     if (err) {
//         console.log(err)
//     }else{
//         console.log('connect...')
//     }
// })
