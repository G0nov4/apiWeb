const pool = require('../../../database/config');

module.exports = {

    getSerProd: async (req,res)=>{
        const idProyect = req.params.id;
        const consultProyect = await pool.query('SELECT * FROM serprod WHERE idProyecto = ?', [idProyect]);
        //console.log(consultProyect);

        res.send(consultProyect)
    },
    createProyectSerProd:async (req,res)=>{
        const newProyect= {
            idProyecto: req.body.idProyecto,
            nombre: req.body.nombre,
            tipo: req.body.tipo,
            categoria: req.body.categoria,
            precio: req.body.precio,
            stock: req.body.stock
        }
        const consultProyect = await pool.query('INSERT INTO serprod SET ?',[newProyect]);
        res.send({
            Message: "El servicio/producto fue creado correctamente",
            status: 200,
            statusText: "OK",
            consultProyect
        })

    }
}