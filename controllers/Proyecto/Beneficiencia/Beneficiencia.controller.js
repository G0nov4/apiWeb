const pool = require('../../../database/config');

module.exports = {
    getBeneficiencia: async (req,res)=>{
        const idProyect = req.params.id;
        const consultProyect = await pool.query('SELECT * FROM beneficiencia WHERE idProyecto = ?', [idProyect]);
        //console.log(consultProyect);

        res.send(consultProyect)
    },
    createProyectBeneficiencia: async (req,res) =>{
        const newProyect = {
            idProyecto: req.body.idProyecto,
            nombre_beneficiario: req.body.nombre_beneficiario,
            evento: req.body.evento,
            lugar: req.body.lugar,
            actividades: req.body.actividades,
        }
        const consultProyect = await pool.query('INSERT INTO beneficiencia SET ?',[newProyect]);
        res.send({
            Message: "El servicio/producto fue creado correctamente",
            status: 200,
            statusText: "OK",
            consultProyect
        })
    }
}