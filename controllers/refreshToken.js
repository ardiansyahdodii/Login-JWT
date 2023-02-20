import jwt from "jsonwebtoken";
import { db } from "../config/koneksi.js";

export const refreshToken = (req, res)=>{
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.sendStatus(401)
    }else{
        const sql = "SELECT * FROM tb_users WHERE refresh_token = ?"

        db.query(sql, refreshToken, (err, result)=>{
            if (err) {
                console.log(err)
            }else if(!result[0]){
                res.sendStatus(403)
            }else{
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode)=>{
                    if (err) {
                        res.sendStatus(403)
                        console.log(err)
                    }else{
                        const idUser = result[0].id_user
                        const namaUser = result[0].nama_user
                        const emailUser = result[0].email_user

                        const accessToken = jwt.sign({idUser, namaUser, emailUser}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'
                    })
                        res.json({ accessToken })
                        console.log(namaUser)
                    }
                })
            }
        })
    }
}