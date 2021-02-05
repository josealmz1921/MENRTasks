const Proyecto = require('../models/Proyectos');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req,res) => {

     // Revisar si hay errores
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
     }

    try{
        // Crear nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via jwt
        proyecto.creador = req.usuario.id;

        // Guardar proyecto
        proyecto.save();
        res.json(proyecto);

    }catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req,res) => {
    try {
        const proyectos = await Proyecto.find({ creador:req.usuario.id }).sort({creado:-1});
        res.json(proyectos);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualiza un proyecto

exports.actualizarProyecto = async (req,res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {nombre} =req.body;
    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // revisar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }

        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, { $set:nuevoProyecto }, {new:true});
        res.json(proyecto);
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarProyecto = async (req,res) => {

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // revisar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }

        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg:'No autorizado'})
        }

        // eliminar el proyecto
        await Proyecto.findOneAndRemove({_id : req.params.id});
        res.json({msj:'Proyecto eliminado'});
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}