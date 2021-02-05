const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult}=require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticacionUsuario = async (req,res) => {
     //Revisar si hay errores
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
     }

     // Extraer el email y password
     const {email,password}=req.body;

     try {
         // Revisar que sea un usuario registrado
         let usuario = await Usuario.findOne({ email });
         if(!usuario){
             return res.status(400).json({msg: 'El usurio no existe'});
         }

         // Revisar password

         const passCorrecto = await bcryptjs.compare(password,usuario.password);
         if(!passCorrecto){
             return res.status(400).json({msg: 'Password Incorrecto'});
         }

         // Si todo es correcto Crear y firmar el JWT
            const payload = {
                usuario:{
                    id:usuario.id
                }
            };

            // Firmar JWT
            jwt.sign(payload,process.env.SECRETEA,{
                expiresIn:3600//1 hora
            },(error,token)=>{
                if(error) throw error;

                // Mensaje de confirmacion
                res.send({token});

            });

     } catch (error) {
        console.log(error);
     }

}

// Obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}