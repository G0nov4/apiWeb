
const pool = require('../../database/config');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');




module.exports = {
    getAllPatroncinadores: async (req,res)=>{
        try {
            const consultarPatrocinadores =  await  pool.query('SELECT * FROM patrocinadores')
            if(consultarPatrocinadores.length){
                return res.status(200).send(consultarPatrocinadores);
            }
            return res.status(404).send({message: "no hay patrocinadores para mostrar"});
        } catch (error) {
            res.send({Message : "Hubo un error en la consulta, vuelva a intentarlo"});
            console.error(error);
        }
    },
    getPatroncinador:async (req,res)=>{
        const  { id } = req.params;
         try {
            const consultarPatrocinador =  await  pool.query('SELECT * FROM patrocinadores WHERE idPatrocinador = ?',[id]);
            if(consultarPatrocinador.length){
                return res.status(200).send(consultarPatrocinador[0]);
            }
            return res.status(404).send({message: `El patrocinador con el ID:${id} no existe`});
        } catch (error) {
            console.error(error);
        }
    },
    createPatrocinador: async (req,res)=>{d
       
        try {
            const consultPatrocinador = await pool.query('SELECT * FROM patrocinadores WHERE nombre = ?',[req.body.nombre]);
            if(consultPatrocinador.length){
                return res.status(409).send({Message: "El patrocinador ya existe"})
            }
            cloudinary.config({
                cloud_name: 'dym8fu7ox',
                api_key:'315343359263361',
                api_secret: 'EStgfBjTriGrqTNBujx1xYlQn_I'
            })
            console.log(req.file)
            const imagenSubida = await cloudinary.uploader.upload(req.file.path , function(error, result) {console.log(result, error)});
            const newPatrocinador = {
                nombre: req.body.nombre,
                Descripcion: req.body.descripcion,
                logotipo: imagenSubida.url
            }
            fs.unlink(req.file.path);
            const insertPatrocinador = await pool.query('INSERT INTO patrocinadores SET ?',[newPatrocinador]);
            return res.status(201).send({ Message: 'se creó correctamente!', patrocinador: insertPatrocinador });

        } catch (error) {
            console.log(error)
        }
    },
    updatePatrocinador:async (req,res)=>{
        const {id} = req.params;
 
        const imagenSubida = await cloudinary.uploader.upload(req.file.path , function(error, result) {console.log(result, error)});
        const Patrocinador = {
            nombre: req.body.nombre,
            Descripcion: req.body.descripcion,
            logotipo: imagenSubida.url
        }
        await fs.unlink(req.file.path);
        try {
            const consultarPatrocinador =  await  pool.query('SELECT * FROM patrocinadores WHERE idPatrocinador = ?',[id]);
            if(consultarPatrocinador.length){
                await pool.query('UPDATE  patrocinadores SET ? WHERE idPatrocinador = ?',[Patrocinador,id])
                return res.status(201).send({Message: "Actualizado correctamente..!"});
            }
            return res.status(404).send({message: `El patrocinador con el ID:${id} no existe`});
        } catch (error) {
            console.error(error);
        }
    },
    deletePatrocinador:async (req,res)=>{
        const {id}= req.params;
        try{
            const consultarPatrocinador =  await  pool.query('SELECT * FROM patrocinadores WHERE idPatrocinador = ?',[id]);
            if(consultarPatrocinador.length){
                await pool.query('DELETE FROM  patrocinadores WHERE idPatrocinador = ?',[id])
                return res.status(201).send({Message: "Se elimino el patrocinador correctamente..!"});
            }
            return res.status(404).send({message: `El patrocinador con el ID:${id} no existe`});
        } catch (error){
            console.error(error);
        }
    }

}