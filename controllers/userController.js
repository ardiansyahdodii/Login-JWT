import { db } from '../config/koneksi.js';
//import bcrypt from 'bcrypt';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

export const getUsers = (req, res) => {
    const sql = "SELECT id_user, nama_user, email_user FROM tb_users"

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        } else {

            res.json(result)
            console.log(result)
        }
    })
}

export const getUserById = (req, res) => {
    const idUser = req.params.id_user

    const sql = "SELECT * FROM tb_users where id_user = ?"

    db.query(sql, idUser, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
            console.log(result)
        }
    })
}

export const addUser = (req, res) => {
    const nama_user = req.body.nama_user
    const email_user = req.body.email_user
    const password_user = md5(req.body.password_user)
    const confPassword = md5(req.body.confPassword)

    //const {nama_user, email_user, password_user, confPassword} = req.body

    if (password_user !== confPassword) {
        res.json({ msg: "password dan confirm password tidak sesuai" })
    } else {
        //const salt = bcrypt.genSalt()
        //const hashPassword = bcrypt.hash(password_user, salt)
        //const hashPW = md5(req.body.password_user)

        const sql = "INSERT INTO tb_users (nama_user, email_user, password_user) VALUES (?, ?, ?)"

        db.query(sql, [nama_user, email_user, password_user], (err, result) => {
            if (err) {
                res.json({ msg: "Gagal menginput data" })
                console.log(err)
            } else {
                res.json({ msg: "berhasil menginput data" })
                console.log(result)
            }
        })
    }

}

export const login = (req, res) => {
    const email_user = req.body.email_user
    const passwordUser = md5(req.body.password_user)

    const sql = "SELECT * FROM tb_users where email_user = ?"

    db.query(sql, email_user, (err, result) => {
        if (err) {
            console.log(err)
        } else if (!result[0] || passwordUser !== result[0].password_user) {
            res.json({ msg: "Email atau password salah" })
        } else {
            const idUser = result[0].id_user
            const namaUser = result[0].nama_user
            const emailUser = result[0].email_user

            const accessToken = jwt.sign({ idUser, namaUser, emailUser }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            })
            const refreshToken = jwt.sign({ idUser, namaUser, emailUser }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '1d'
            })
            const sql2 = "UPDATE tb_users SET refresh_token = ? WHERE id_user = ?"
            db.query(sql2, [refreshToken, idUser])

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({ accessToken })
            console.log(`login sebagai ${namaUser}`)
        }
    })
}

export const logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.sendStatus(204)
    } else {
        const sql = "SELECT * FROM tb_users WHERE refresh_token = ?"

        db.query(sql, refreshToken, (err, result) => {
            if (err) {
                console.log(err)
            } else if (!result[0]) {
                res.sendStatus(403)
            } else {
                const idUser = result[0].id_user

                const sql2 = "UPDATE tb_users SET refresh_token = ? WHERE id_user = ?"

                db.query(sql2, [null, idUser], (err, result)=>{
                    if (err) {
                        console.log(err)
                    }else{
                        res.clearCookie('refreshToken')
                        res.sendStatus(200)
                    }
                })
            }
        })
    }
}