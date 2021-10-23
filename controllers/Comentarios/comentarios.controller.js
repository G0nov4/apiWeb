const pool = require('../../database/config');


module.exports = {
    createComentario: async (req,res)=>{
        const idCliente = req.token.userId;
        const newComentario = {
            idCliente: idCliente,
            idProyecto: req.params.id,
            comentario: req.body.comentario
        }

        //const consultProyect = await pool.query('INSERT INTO proyectos SET ?',[newProyect]);
        const consultComentario = await pool.query('INSERT INTO comentarios SET ?',[newComentario]);

        if(consultComentario.affectedRows){
            res.send({Message: "Comentario Hecho!",status: 200,ok:true, statusTest: "OK", idComentario: consultComentario.id})        
    
        }else{
            res.send({Message: "Algo salio mal al momento de crear el comentario, vuelva a intentarlo"})
        }
    },
    getComentarios: async (req,res)=>{
        const idProyect = req.params.id;

        const consultComment = await pool.query('SELECT * FROM comentarios WHERE idProyecto = ?',[idProyect]) 
        if(consultComment.length){
            res.send(consultComment)
        }else{
            res.send({
                Message :`No hay comentarios para el proyecto ${idProyect}`
            })
        }
    },
    deleteComentario: async (req,res)=>{
        const idComment = req.params.id;
        console.log("eliminando: ", req.params)
        const consultComentario = await pool.query('DELETE FROM comentarios WHERE idComentario = ?',[idComment]);

        if(consultComentario.affectedRows){
           res.send({Message: "El comentario fue eliminado exitosamente..!"})
       }else{
           res.send({Message: `El comentario con el Id: ${idComment} no se encuetra`})
       }
       
    }
}