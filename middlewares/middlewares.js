const jwt = require('jsonwebtoken');

module.exports = {
    validarRegistro: (req,res,next)=>{
        // username min length 3
        if (!req.body.username || req.body.username.length < 6) {
            return res.status(400).send({ Message: 'Por favor ingresa nombre de usuario, minimo 6 caracteres.' });
        }
        // contraseña min 6 chars
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).send({ Message: 'Por favor ingrese una contraseña, minimo 8 caracteres' });
        }
        next();
    },
    isLoggedIn: (req,res,next)=>{
        // SIN LA PALABRA Bearer ANTES DEL token
        let token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).send({ ok: false, Message: 'Token invalido' });
        }
        else {
            token = token.replace('Bearer', '');
            jwt.verify(token, '_secret_|_proyect_', (err, token) => {
                if (err) {
                    return res.status(401).send({ ok: false, Message: 'No se pudo verificar el token' });
                } else {
                    req.token = token
                    
                    next();
                }
            });
        }
    },
    isAdmin: (req,res,next)=>{
        const rol = req.token.rol;
        if (rol == "administrador")
            return next();
        res.status(401).send({ Message: 'Usted no tiene permiso!' });
    },
    isGerente: (req,res,next)=>{
        const rol = req.token.rol;
     /*    console.log(req.token)  */    
        if (rol === "gerencial")
            return next();
        res.status(401).send({ Message: 'Usted no tiene permiso!' }); 
    },
    isCliente: (req,res,next)=>{
        const rol = req.token.rol;
        console.log(req.token) 
        if (rol === "usuario")
            return next();
        return res.status(401).send({ Message: 'Usted no tiene permiso!' }); 
    }
}