import { Router } from "express";
import { MongoClient } from "mongodb";
import { AccesoUsuario } from "../accesosBases/accesoUsuario";
import { Usuario } from "../Clases/Usuario";

//Regex
const mailRegex: RegExp = new RegExp("[A-Za-z0-9]+@[a-z]+\.[a-z]{2,3}");
const contraRegex: RegExp = new RegExp("[a-z0-9A-Z]");
const fotoRegex: RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");

export let rutasUsuarios = Router();

const url: string = "mongodb://localhost:27017/Apuestas";
const client = new MongoClient(url);
const database = client.db("Apuestas");

var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Usuario"))

rutasUsuarios.post("/registro", (req, res) => {
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

    if(!fotoRegex.test(usuario.fotoDoc.valueOf())){
        res.status(400).send("Imagen invalida");
        return;
    }
    
    accesoUsuario.getUsuario(usuario.DNI).then((v) => {
        if(v == undefined){
            accesoUsuario.getUsuario(usuario.mail.valueOf()).then((v) => {
                if(v == undefined){
                    accesoUsuario.subirDatos(usuario);
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

rutasUsuarios.post("/inicoSesion", (req, res) => {

})

rutasUsuarios.delete("/borrarPendiente/:nombre", (req, res) => {

})