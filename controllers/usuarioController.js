const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult}=require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req,res) => {

    //Revisar si hay errores
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    // Extraer email y password
    const {email,password} = req.body;

    try{
        // Revisar que el usuario sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({msg:'El usuario ya existe'});
        }

        // crear el nuevo usuario
        usuario = new Usuario(req.body);

        // Hasehar el paswsord

        const salt = await bcryptjs.genSalt(10);
        
        usuario.password = await bcryptjs.hash(password, salt);

        // guardar usuario
        await usuario.save();

        // Crear y firmar el JWT

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


    }catch(error){
        console.log(error);
        res.status(400).send({msg:'Hubo un error'});
    }
}