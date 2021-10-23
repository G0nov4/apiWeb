const pool = require('../../database/config');
const cloudinary = require('../../config/cloudinary');
const fs = require('fs-extra')

module.exports = {
    getProyectos: async (req,res)=>{
    const idGerente = req.token.userId;

        const consultProyect = await pool.query('SELECT * FROM proyectos WHERE idGerencial = ? AND isValidate = 0',[idGerente])
        res.send(consultProyect)
    },
    getProyectosValidados: async (req,res)=>{
        const consultProyect = await pool.query('SELECT * FROM proyectos WHERE isValidate = 1')
        res.send(consultProyect)
    },
    getProyectosNoValidados: async (req,res)=>{
        const consultProyect = await pool.query('SELECT * FROM proyectos WHERE isValidate = 0')
        res.send(consultProyect)
    },
    getProyecto: async (req,res)=>{
        const idProyecto = req.params.id;

        const consultProyect = await pool.query('SELECT * FROM proyectos WHERE idProyecto = ?',[idProyecto])
        let tipo;
   
        if(consultProyect[0].tipo == "Artisitico/Cultural"){
            console.log("this is a proyect Artisitico/Cultural");
            tipo = await pool.query('SELECT * FROM artcul WHERE idProyecto = ?',[idProyecto]);
        }
        if(consultProyect[0].tipo == "Beneficiencia"){
            console.log("this is a proyect Beneficiencia");
            tipo = await pool.query('SELECT * FROM beneficiencia WHERE idProyecto = ?',[idProyecto]);
        }
        if(consultProyect[0].tipo == "Servicio/Producto"){
            console.log("this is a proyect Servicio / Producto");
            tipo = await pool.query('SELECT * FROM serprod WHERE idProyecto = ?',[idProyecto]);
        }
        const Patrocinadores =await pool.query('SELECT * FROM patrocinadores ')
        res.send({
            Message: "Proyecto encontrado con exito",
            proyecto: consultProyect[0],
            data :tipo

        })
    },
    createProyecto: async (req,res,next)=>{
        const idGerente = req.token.userId;
        try {
            if(req.file != undefined){
                const imagenSubida = await cloudinary.uploader.upload(req.file.path);
                console.log(imagenSubida)
         
                const newProyect = {
                    idGerencial: idGerente,
                    nombre: req.body.titulo,
                    objetivo: req.body.objetivo,
                    mision: req.body.mision,
                    vision: req.body.vision,
                    logotipo: imagenSubida.url,
                    tipo: req.body.tipo,
                    isValidate: false
                }
                //const consultProyect = await pool.query('INSERT INTO proyectos SET ?',[newProyect]);
                const consultProyect = await pool.query('INSERT INTO proyectos SET ?',[newProyect]);
                await fs.unlink(req.file.path);
                res.send({Message: "Proyecto creado Exitosamente!",status: 200,ok:true, statusTest: "OK", idProyecto: consultProyect.insertId})
            }else{
                res.send({
                    Message: 'No seleccionaste ninguna imagen'
                })
            }
        } catch (error) {
            res.send({
                Message: "Error al crear el archivo vuelva a intentarlo"
            })
            console.log(error)
        }
      
     
    },
    validateProyect: async (req,res)=>{

        await pool.query('UPDATE proyectos SET isValidate = TRUE WHERE idProyecto = ?',[req.params.id]);
        res.send({
            Message: "El proyecto fue validado correctamente!"
        })
    },
    updateProyecto:async (req,res)=>{
        const imagenSubida = await cloudinary.uploader.upload(req.file.path , (result, error)=>{
            if(error){s
                res.send({
                    Message : 'Hubo un error al subir la imagen'
                })
            }});
        const newProyect = {
            nombre: req.body.titulo,
            objetivo: req.body.objetivo,
            mision: req.body.mision,
            vision: req.body.vision,
            logotipo: imagenSubida.url
        }
        const idProyecto = req.params.id;
        await pool.query('UPDATE proyectos SET ? WHERE idProyecto = ?',[newProyect,idProyecto])
        await fs.unlink(req.file.path);
        res.send({
            Message: "El recurso ha sido actualizado"
        })
    },
    deleteProyecto:async (req,res)=>{
        const idProyecto = req.params.id;

        const consultProyect = await pool.query('SELECT * FROM proyectos WHERE idProyecto = ?',[idProyecto])
        console.log(consultProyect)
        if(consultProyect[0].tipo == "Artisitico/Cultural"){
            console.log("this is a proyect Artisitico/Cultural");
            await pool.query('DELETE FROM artcul WHERE idProyecto = ?',[idProyecto]);
        }
        if(consultProyect[0].tipo == "Beneficiencia"){
            console.log("this is a proyect Beneficiencia");
            await pool.query('DELETE FROM beneficiencia WHERE idProyecto = ?',[idProyecto]);
        }
        if(consultProyect[0].tipo == "Servicio/Producto"){
            console.log("this is a proyect Servicio / Producto");
            await pool.query('DELETE FROM serprod WHERE idProyecto = ?',[idProyecto]);
        }
        await pool.query('DELETE FROM proy_t_pat WHERE idProyecto = ?',[idProyecto])
        await pool.query('DELETE FROM comentarios WHERE idProyecto = ?',[idProyecto])
        await pool.query('DELETE FROM proyectos WHERE idProyecto = ?',[idProyecto]);
        res.send({
            Message: `Se elimino el Proyecto con ID: ${idProyecto}`
        });
    }

}