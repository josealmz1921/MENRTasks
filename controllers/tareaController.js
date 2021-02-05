const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyectos');
const {validationResult} = require('express-validator');
const router = require('../routes/usuarios');
const { findByIdAndRemove } = require('../models/Tarea');

// Crea una nueva tarea

exports.crearTarea = async(req,res)=>{

     // Revisar si hay errores
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
     }

     try {

        // Extraer elproyecto y comprobar si existe
        const {proyecto} = req.body;

        const exiteProyecto = await Proyecto.findById(proyecto);
        if(!exiteProyecto){
            res.status(404).json({msg:'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        // Crear la tarea

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
         
     } catch (error) {
         console.log(error);
         res.status(500).send('Hubo un error');
     }
}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async(req, res) => {
    
    try {
        // Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        console.log(proyecto);

        const exiteProyecto = await Proyecto.findById(proyecto);
        if(!exiteProyecto){
            res.status(404).json({msg:'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1 });
        res.json({tareas})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// Actualizar una Tarea

exports.actualizarTarea = async (req, res) => {
    try {

        // Extraer el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        // Si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg:'No exite esa tarea'});
        }

        // Extraer proyecto
        const exiteProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        // crear objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar proyecto
        
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new:true});

        res.json({tarea})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Elimina una tarea 

exports.eliminarTarea = async (req, res) => {
    try {

        // Extraer el proyecto y comprobar si existe
        const {proyecto} = req.query;

        // Si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg:'No exite esa tarea'});
        }

        // Extraer proyecto
        const exiteProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(exiteProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        // Eliminar

        await Tarea.findByIdAndRemove({_id : req.params.id});

        res.json({msg:'Tarea Eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

