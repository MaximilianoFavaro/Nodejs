import express from 'express'
import * as dotenv from 'dotenv'
import {router} from './routes/routesServer.js'


dotenv.config()

const app = express()

app.listen(process.env.PORT,console.log('Escuchando en puerto: '+process.env.PORT));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',router)

app.use('*', async(req,res)=>{
    res.json({
        error:-1,
        descripcion:'La ruta solicitada es invalida'
    })
})
