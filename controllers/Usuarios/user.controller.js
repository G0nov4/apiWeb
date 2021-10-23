const pool = require('../../database/config');
const bcrypt  =require('bcryptjs');
const jwt =require('jsonwebtoken');



module.exports = {
    listUsersClient: async (req,res,next)=>{
        await pool.query('SELECT idCliente, nombre, apellido,username,email,tipo FROM usuario_cliente', (error,result)=>{
            if(error){
                console.log('Hubo un error al pedir el recurso')
                res.send({Message: "hubo un error al pedri el recuurso"})
            }
            res.json({
                Message: "OK",
                status: 200,
                users: result
            });
        });  
    },
    listUsersGerencial: async (req,res,next)=>{
        await pool.query('SELECT idGerencial, nombre, apellido,username,email,tipo FROM usuario_gerencial', (error,result)=>{
            if(error) throw error;
            res.json({  
                Message: "OK",
                status: 200,
                users: result
            });
        });  
    },
    createUserGerencial: async (req,res)=>{
        let newUserGerencial = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            tipo: "gerencial"
        };
        try {
            const consultUser = await pool.query('SELECT * FROM usuario_gerencial WHERE username = ?;', [newUserGerencial.username]);
           
            if(consultUser.length){
                return res.send({status: 409, Message: 'El usuario ya existe!' });
            }
            
            const hash = await bcrypt.hash(newUserGerencial.password,  10);
            newUserGerencial.password = hash;
            
            console.log("New user gerencial: ",newUserGerencial)
            // Si el usuario no existe el usuario se crea
            const insertarUsuario = await pool.query('INSERT INTO usuario_gerencial SET ?',[newUserGerencial]);
            return res.status(201).send({
                Mensaje: "Se creo el usuario gerencial correctamente",
                user: insertarUsuario
            })
        } catch (error) {
            console.error(error)
        }

    },
    createUserCliente: async (req,res)=>{
        let newUserClient = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            tipo: "usuario"
        };

        try {
            const consultUser = await pool.query('SELECT * FROM usuario_cliente WHERE username = ?;', [newUserClient.username]);
         
            if(consultUser.length){
                return res.status(409).send({ Message: 'El usuario ya existe!' });
            }
            
            const hash = await bcrypt.hash(newUserClient.password,  10);
            newUserClient.password = hash;
            
            console.log(newUserClient)
            // Si el usuario no existe el usuario se crea
            const insertarUsuario = await pool.query('INSERT INTO usuario_cliente SET ?',[newUserClient]);
            console.log(insertarUsuario)
            return res.status(201).send({
                Mensaje: "Se creo el usuario correctamente",
                user: insertarUsuario
            })
        } catch (error) {
            console.error(error)
        }
    },
    getGerencial:async (req,res)=>{
        const {id} = req.params;

        try {
            const userGerencial = await pool.query('SELECT idGerencial, nombre, apellido,username,email,tipo FROM usuario_gerencial WHERE idGerencial = ?',[id]);  
            
            if(userGerencial.length){
                return res.send({
                    Message: "OK",
                    status: 200,
                    user: userGerencial[0]
                })
            }
            return res.send({
                Message: "EL usuario no se ha encontrado",
                status: 404
            })
        } catch (error) {
            console.error(error)
        }

    },
    updateGerencial: async(req,res) => { 
        const { id } = req.params;
        const userGerencial = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            username: req.body.username,
            email: req.body.email
        }
        try {
            const consultaUsuarioGerencial =  await  pool.query('SELECT * FROM usuario_gerencial WHERE idGerencial = ?',[id]);
            console.log(consultaUsuarioGerencial)
            if(consultaUsuarioGerencial.length){
                await pool.query('UPDATE  usuario_gerencial SET ? WHERE idGerencial = ?',[userGerencial,id])
                return res.send({status:201, Message: "usuario Gerencial actualizado correctamente..!"});
            }
            return res.status(404).send({message: `El usuairo Gerencial con el ID: ${id} no existe`});
        } catch (error) {
            console.error(error);
        }
        
    },
    deleteGerencial :async (req,res)=>{
        const { id } = req.params;

        try {
            const consultaUsuarioGerencial =  await  pool.query('SELECT * FROM usuario_gerencial WHERE idGerencial = ?',[id]);
            console.log(consultaUsuarioGerencial)
            if(consultaUsuarioGerencial.length){
                console.log(consultaUsuarioGerencial)
                if(consultaUsuarioGerencial[0].tipo == "Artisitico/Cultural"){
                    await pool.query('DELETE FROM artcul WHERE idProyecto = ?',[id]);
                }
                if(consultaUsuarioGerencial[0].tipo == "Beneficiencia"){
                    await pool.query('DELETE FROM beneficiencia WHERE idProyecto = ?',[id]);
                }
                if(consultaUsuarioGerencial[0].tipo == "Servicio/Producto"){
                    await pool.query('DELETE FROM serprod WHERE idProyecto = ?',[id]);
                }
                await pool.query('DELETE FROM proy_t_pat WHERE idProyecto = ?',[id])
                await pool.query('DELETE FROM us_reg_proy WHERE idProyecto = ?',[id])
                await pool.query('DELETE FROM comentarios WHERE idProyecto = ?',[id])
                await pool.query('DELETE FROM proyectos WHERE idProyecto = ?',[id]);


                await pool.query('DELETE FROM  usuario_gerencial WHERE idGerencial = ?',[id])
                return res.send({status:201, Message: "usuario se elimino correctamente..!"});
            }
            return res.status(404).send({message: `El usuario con el ID:${id} no existe`});
        } catch (error) {
            console.error(error);
        }
    },
    Ingreso: async (req,res,next)=>{
        const { username, password } = req.body;
        console.log("Ingresa: ",username,password)
        try {

            const usersAdmin = await pool.query('SELECT * FROM usuario_root WHERE username = ?;', [username]);
            if(usersAdmin.length > 0){

                const passwordIsValidate = await bcrypt.compare(password, usersAdmin[0].password);
                if(passwordIsValidate)
                {
                    console.log(usersAdmin[0])
                    const token = jwt.sign(
                        {
                            username: usersAdmin[0].username,
                            userId: usersAdmin[0].idRoot,
                            rol: usersAdmin[0].tipo
                        },
                        '_secret_|_proyect_',
                        {
                            expiresIn: '1d'
                        }
                    );
                    console.log(token)
                    return res.status(200).send({ Message: 'Logged Admin!', token, rol: usersAdmin[0].tipo});
                }
                return res.status(200).send({Message: "Contraseña incorrecta..",status: 401, statusText: "ERROR"})
            }

            const usersGerencial = await pool.query('SELECT * FROM usuario_gerencial WHERE username = ?;', [username]);
            if(usersGerencial.length > 0){
                const passwordIsValidate = await bcrypt.compare(password, usersGerencial[0].password);
                if(passwordIsValidate)
                {
                    const token = jwt.sign(
                        {
                            username: usersGerencial[0].username,
                            userId: usersGerencial[0].idGerencial,
                            rol: usersGerencial[0].tipo
                        },
                        '_secret_|_proyect_',
                        {
                            expiresIn: '1d'
                        }
                    );
                    return res.status(200).send({ Message: 'Logged Gerente!', token, rol: usersGerencial[0].tipo});
                }
                return res.status(200).send({Message: "Contraseña incorrecta..",status: 401, statusText: "ERROR"})
            }

            const userClient = await pool.query('SELECT * FROM usuario_cliente WHERE username = ?;', [username]);
            if(userClient.length > 0){
                const passwordIsValidate = await bcrypt.compare(password, userClient[0].password);
                if(passwordIsValidate)
                {
                    const token = jwt.sign(
                        {
                            username: userClient[0].username,
                            userId: userClient[0].idCliente,
                            rol: userClient[0].tipo
                        },
                        '_secret_|_proyect_',
                        {
                            expiresIn: '1d'
                        }
                    );
                    return res.status(200).send({ Message: 'Logged Client!', token, rol: userClient[0].tipo});
                }
                return res.status(200).send({Message: "Contraseña incorrecta..", statusText: 'ERROR'})
            }

            res.send({statusText: "ERROR", status: 401, Message: 'No se encontro el usuario' });
        } catch (error) {
            console.log("Error en consulta de usuarios")
            res.status(200).send({Message: "Hubo un error de conexion, vuelva a ingresar los datos."})
        }
    },
    deleteUser: async (req,res)=>{
        const { id } = req.params;

        try {
            const consultaUsuarioGerencial =  await  pool.query('SELECT * FROM usuario_cliente WHERE idCliente = ?',[id]);
            console.log(consultaUsuarioGerencial)
            if(consultaUsuarioGerencial.length){



                await pool.query('DELETE FROM  usuario_cliente WHERE idCliente = ?',[id]);



                return res.send({status:201, Message: "usuario se elimino correctamente..!"});
            }
            return res.status(404).send({message: `El usuario con el ID:${id} no existe`});
        } catch (error) {
            console.error(error);
        }
    }

}