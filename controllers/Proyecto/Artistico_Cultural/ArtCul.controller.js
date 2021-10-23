const pool = require('../../../database/config');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');


module.exports = {
    getArtCul: async (req,res)=>{
        const idProyect = req.params .id;
        const consultProyect = await pool.query('SELECT * FROM artcul WHERE idProyecto = ?', [idProyect]);
        res.send(consultProyect)
    },
    createProyectArtCul: async(req,res)=>{
   
       
        const newProyect = {
            idProyecto: req.body.idProyecto,
            lugar: req.body.lugar,
            fecha: req.body.fecha,
            hora: req.body.hora,
            Descripcion: req.body.Descripcion,
            imagen: req.body.imagen
        }
        const consultProyect = await pool.query('INSERT INTO artcul SET ?',[newProyect]);
        res.send({
            Message: "El servicio/producto fue creado correctamente",
            status: 200,
            statusText: "OK",
            consultProyect
        })
    }
}