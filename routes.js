const express = require('express')
const routes = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken")
const encryp = require('bcryptjs')
routes.use(express.json())
const bcryptjs = require('bcryptjs')
routes.use(express.urlencoded({ extended: false }))
const cors = require('cors')
routes.use(cors({
    origin: '*'
}));


// const{SignJWT} = require('jose')
const { Router } = require('express')

// const {isAdmin} = require('./checkRol')
//TRAER USUARIO por id
// routes.get('/', async (req, res) => {
//     const id = req.body.id
//     const get = await prisma.usuarios.findUnique({
//         where: {
//             ID_USUARIOS: id
//         }
//     })
//     res.send(get)
// })

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.status(403).json({ message: 'No token provided' })
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, "Secret_word")
        const user = await prisma.usuarios.findMany({

            where: {
                "ID_USUARIOS": decoded.id
            }
        })
        if (!user) return res.status(404).json({ message: 'User not found' })
        req.user = user;
        next()
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const isSalesman = async (req, res, next) => {

    if (req.user.rol === "COSTUMER") {
        next()
        return;
    }

    res.status(401).json({ message: 'Costumer rol is required' })
}

const isAdmin = async (req, res, next) => {

    if (req.user.rol === "ADMIN") {
        next()
        return;
    }

    res.status(401).json({ message: 'Admin rol is required' })
}

const hasAnyRol = async (req, res, next) => {

    if (req.user.rol === "COSTUMER" || req.user.rol === "ADMIN") {
        next()
        return;
    }

    res.status(401).json({ message: 'Salesman or Admin rol is required' })
}
//traer usuario por nombre
routes.get('/name', [verifyToken], async (req, res) => {
    const name = req.body.name
    const get = await prisma.usuarios.findMany({
        where: {
            NAME: name
        }
    })
    res.send(get)
})

//traer usuario por correo
routes.get('/mail', [verifyToken], async (req, res) => {
    const mail = req.body.name
    const get = await prisma.usuarios.findMany({
        where: {
            "EMAIL": mail
        }
    })
    res.send(get)
})

// //INSTERAR NUEVO 
// routes.post('/', async (req, res) => {
//     const { NAME, LAST_NAME, TYPE_DOCUMENT, DOCUMENT, STATE } = req.body
//     const post = await prisma.usuarios.create({
//         data: {
//             NAME, LAST_NAME, TYPE_DOCUMENT, DOCUMENT, STATE, CREATION_DATE: new Date()
//         }
//     })
//     console.log(post)
// })


//INSTERAR NUEVO usuario con contraseña 
routes.post('/', async (req, res) => {
    console.log('llega')
    const { NAME, LAST_NAME, EMAIL, TYPE_DOCUMENT, DOCUMENT, STATE, PASSWORD } = req.body
    const post = await prisma.usuarios.create({
        data: {
            NAME, LAST_NAME, EMAIL, TYPE_DOCUMENT, DOCUMENT, STATE, CREATION_DATE: new Date()
        }
    })
    let passwordhash = await bcryptjs.hash(PASSWORD, 8)
    let id = post.ID_USUARIOS
    const postpass = await prisma.autentication.create({
        data: {
            ID_USUARIO: id, CREDENTIAL: "a", HASH: passwordhash, STATE: "a"
        }
    })
    console.log(post)
    console.log(postpass)
})

//Actualizar usuario
// routes.patch('/:id', async (req, res) => {
routes.patch('/:id', [verifyToken], async (req, res) => {
    const { NAME, LAST_NAME, EMAIL, TYPE_DOCUMENT, DOCUMENT, STATE } = req.body
    const id = parseInt("" + Number(req.params.id), 10)

    const update = await prisma.usuarios.update({
        where: {
            ID_USUARIOS: id,
        },
        data: {
            NAME, LAST_NAME, EMAIL, TYPE_DOCUMENT, DOCUMENT, STATE, CREATION_DATE: new Date(),
        }
    })
    console.log(update)
})

//Agregar log de cambios
routes.post('/changes/:id', [verifyToken], async (req, res) => {
    // routes.patch('/:id',async (req, res) => {
    const { PREV_DATA, CURRENT_DATA } = req.body
    const id = parseInt("" + Number(req.params.id), 10)

    const ip = req.socket.remoteAddress.split("::ffff:");

    const post = await prisma.historic_usuario.create({
        data: {
            ID_USUARIOS: id, DATE: new Date(), IP: ip[1],
            PREV_DATA: PREV_DATA, CURRENT_DATA: CURRENT_DATA,
        }
    })
    console.log(post)

    return res
})

//Eliminar usuario
routes.patch('/delete', [verifyToken, isAdmin], async (req, res) => {
    // routes.patch('/delete/:id', async (req, res) => {

    // const id = 0
    // if (req.body) {
    const id = parseInt("" + req.body, 10)
    // } else {
    //     id = parseInt(req.params.id)
    // }
    const ip = req.socket.remoteAddress.split("::ffff:");
    const update = await prisma.usuarios.update({
        where: {
            ID_USUARIOS: id,
        },
        data: {
            STATE: "d"
        }
    })
    console.log(update)
})

// //ACTUALIZAR ESTADO de un atributo
// routes.patch('/:id',[verifyToken], (req, res) => {
//     let id = Number(req.params.id)
//     req.getConnection((err, conn) => {
//         if (err) return res.send(err)
//         conn.query('UPDATE user set estado ="i" WHERE id = ?', [req.params.id], (err, rows) => {
//             if (err) return res.send(err)
//             res.send('update inactive user')
//         })
//     })
// })

//Obtener páginas de usuarios
routes.get('/page/:num', [verifyToken], async (req, res) => {
    const page = req.params.num
    const min = ((page - 1) * 100)
    const get = await prisma.usuarios.findMany({
        // take: 10,
        // skip: min
    })
    res.send(get)
})

//Obtener página de usuario activo
routes.get('/pageActive/:num', [verifyToken], async (req, res) => {
    const page = req.params.num
    const min = ((page - 1) * 100)
    const get = await prisma.usuarios.findMany({
        take: 100,
        skip: min,
        where: { STATE: "a" }
    })
    res.send(get)
})

//Agregar rol
routes.post('/rol', [verifyToken], async (req, res) => {
    const { NAME, DESCRIPTION, STATE } = req.body
    const post = await prisma.rol.create({
        data: {
            NAME, DESCRIPTION, STATE, CREATION_DATE: new Date()
        }
    })
    console.log(post)
})

//obtener todos los roles
routes.get('/rols', [verifyToken], async (req, res) => {
    const get = await prisma.rol.findMany()
    res.send(get)
})

//obtener rol por id
routes.get('/rol', [verifyToken], async (req, res) => {
    const { ID_ROL } = req.body
    const get = await prisma.rol.findMany({
        where: { ID_ROL: ID_ROL }
    })
})

//editar rol
routes.patch('/rol', [verifyToken], async (req, res) => {
    const { ID_ROL, NAME, DESCRIPTION, STATE } = req.body
    const set = await prisma.rol.update({
        where: { ID_ROL: ID_ROL },
        data: {
            NAME, DESCRIPTION, STATE
        }
    })
})

//agregar rol a un usuario
routes.post('/userRol', [verifyToken], async (req, res) => {
    const { ID_USUARIOS, ID_ROL, STATE } = req.body
    const post = await prisma.ussers_rol.create({
        data: {
            CREATION_DATE: new Date(), STATE, ID_USUARIOS, ID_ROL,
        }
    })
    console.log(post)
})

//ver roles de un usuario
routes.get('/userRol', [verifyToken], async (req, res) => {
    const { ID_USUARIOS } = req.body
    const get = await prisma.ussers_rol.findMany({
        where: { ID_USUARIOS: ID_USUARIOS }
    })
    res.send(get)
})

//SIGN
routes.post('/login', async (req, res) => {
    const { EMAIL, PASSWORD } = req.body;
    const get = await prisma.usuarios.findMany({

        where: {
            "EMAIL": EMAIL
        }
    })
    const getPassword = await prisma.autentication.findMany({
        where: {
            "ID_USUARIO": get[0].ID_USUARIOS
        }
    })
    if (get.length > 0 && await bcryptjs.compare(PASSWORD, getPassword[0].HASH)) {
        const token = jwt.sign({ id: get[0].ID_USUARIOS }, "Secret_word", {
            expiresIn: "1h"
        })

        const rol = await prisma.rol.findMany({
            where: {
                "ID_ROL": get[0].ID_ROL
            }
        })

        res.status(200).json(
            {
                token: token, rol: rol[0].NAME, name: get[0].NAME
            })
    }
    // if (!EMAIL || !PASSWORD) return res.sendStatus(400)
    //res.status(200).json({token:token})
    // try {
    //     const { guid } = authByEmailPwd(EMAIL, PASSWORD)
    //     const jwt = jwtConstructor.setProtectedHeader({ alg: 'hs256', typ: 'jwt' })
    //         .setIssuedAt()
    //         .setExpirationTime('1h').sign(procces.HASH)

    // } catch (error) {
    //     return res.sendStatus(401)
    // }
})


// //Authorizacion: Bearer <token>
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorizacion']
//     if (typeof bearerHeader != 'undefined') {
//         const bearerToken = bearerHeader.split(" ")[1]
//         req.token = bearerToken
//         next()
//     } else {
//         res.sendStatus(403)
//     }
// }

// routes.post("/api/posts", verifyToken, (req, res) => {
//     jwt.verify(req.token, 'secretKey', (error, authData) => {
//         if (error) {
//             res.sendStatus(403)
//         } else {
//             res.json({
//                 authData
//             })
//         }
//     })
// })


/*
routes.post("/login"),(req,res)=>{
const{EMAIL,PASSWORD}=req.body;
if(!EMAIL||!PASSWORD)return res.sendStatus(400)
try {
    const{guid} = authByEmailPwd(EMAIL,PASSWORD)
    const jwt = jwtConstructor.setProtectedHeader({alg: 'hs256',typ:'jwt'})
    .setIssuedAt()
    .setExpirationTime('1h').sign(procces.HASH)

} catch (error) {
    return res.sendStatus(401)
}
}
*/
module.exports = routes