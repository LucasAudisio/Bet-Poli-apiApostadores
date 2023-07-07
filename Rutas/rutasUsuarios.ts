import { Router } from "express";
import { MongoClient } from "mongodb";
import { AccesoUsuario } from "../accesosBases/accesoUsuario";
import { AccesoVerify } from "../accesosBases/accesoVerify";
import { Usuario } from "../Clases/Usuario";
import { generarClave } from "../jwt";
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

//Regex
const mailRegex: RegExp = new RegExp("[A-Za-z0-9]+@[a-z]+\.[a-z]{2,3}");
const contraRegex: RegExp = new RegExp("[a-z0-9A-Z]");
const fotoRegex: RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");

export let rutasUsuarios = Router();

const url: string = "mongodb://localhost:27017/Apuestas";
const client = new MongoClient(url);
const database = client.db("Apuestas");
var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Usuario"))

var accesoVerify: AccesoVerify = new AccesoVerify(url, database, database.collection("UsuarioVerify"))

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
       auth: {
            user: 'pedrothedeveloper@gmail.com',
            pass: 'vwltcggubmcxserj',
         },
    secure: true,
});

function sendMail(to: String, subject: String, text: String){
    const mailData = {
        from: "pedroTheDeveloper@gmail.com",
        subject: subject,
        to: to,
        text: text,
        html: '<b>Hola! </b> <br>' + text + ' <br/>',
    }

    transporter.sendMail(mailData, function (err: any, info: any) {
        if(err) console.log(err);
        else console.log(info);
    })
}

rutasUsuarios.post("/registro", (req, res) => {
    if(!req.body.contraseña || !req.body.nombre || !req.body.mail || !req.body.DNI
         || !req.body.fechaNac || !req.body.apellido /*|| !req.body.fotoDoc*/){
            res.status(400).send("No se proporcionaron todos los datos");
            return;
    }

    const usuario: Usuario = new Usuario(req.body.contraseña, req.body.nombre, req.body.mail,
        req.body.DNI, new Date(req.body.fechaNac), "pendiente", req.body.apellido, 
        req.body.fotoDoc);

    if(!mailRegex.test(usuario.mail.valueOf())){
        res.status(400).send("Mail invalido");
        return;
    }

    if(usuario.DNI.length != 8){
        res.status(400).send("DNI invalido");
        return;
    }

    if(usuario.contraseña.length < 8 || !contraRegex.test(usuario.contraseña.valueOf())){
        res.status(400).send("Contraseña insegura");
        return;
    }

    /*if(!fotoRegex.test(usuario.fotoDoc.valueOf())){
        res.status(400).send("Imagen invalida");
        return;
    }*/
    
    accesoUsuario.getUsuario(usuario.DNI).then((v) => {
        if(v == undefined){
            accesoUsuario.getUsuario(usuario.mail.valueOf()).then((v) => {
                if(v == undefined){
                    accesoUsuario.subirDatos(usuario);
                    const configOTP = {
                        lowerCaseAlphabets:false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    }
                    const OTP = otpGenerator.generate(4, configOTP);
                    console.log(OTP);
                    accesoVerify.subirOTP(usuario.mail.valueOf(), OTP);
                    sendMail(usuario.mail.valueOf(), "Verificacion del correo", 
                    "Tu codigo de verificacion es: " + OTP)
                    res.send(usuario);
                }
                else{
                    res.status(400).send("Mail ya en uso");
                }
            })
        }
        else{
            res.status(400).send("DNI ya en uso");
        }
    })
})

rutasUsuarios.post("/verify", (req, res) => {
    accesoVerify.getOTP(req.body.mail).then((v) => {
        if(v == undefined){
            res.status(404).send("Mail no encontrado");
            return;
        }
        else{
            if(v.otp == req.body.otp){
                accesoVerify.deleteOTP(req.body.mail);
                accesoUsuario.updateEstado(req.body.mail, "activo");
                res.send("Verificacion correcta");
            }
            else{
                res.status(400).send("Codigo incorrecto");
            }
        }
    })
})

rutasUsuarios.post("/inicioSesion", (req, res) => {
    accesoUsuario.getUsuario(req.body.mail).then((b) => {
        if (b) {
            accesoUsuario.login(req.body.mail, req.body.contraseña).then((v) => {
                if (v) {
                    if (v.estado) {
                        let respuesta: JSON = JSON.parse(JSON.stringify(b));
                        Object.assign(respuesta, { "claveJWT": generarClave(req.body.mail) });
                        res.json(respuesta);
                    }
                    else if(v.mensaje == "contraseña incorrecta") {
                        res.status(400).json(v);
                    }
                    else{
                        res.status(400).json(v)
                    }
                }
            });
        }
    })
})