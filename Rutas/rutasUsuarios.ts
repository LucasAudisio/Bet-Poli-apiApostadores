import { Router } from "express";
import { MongoClient } from "mongodb";
import { AccesoUsuario } from "../accesosBases/accesoUsuario";
import { Usuario } from "../Clases/Usuario";

export let rutasUsuarios = Router();

const url: string = "mongodb://localhost:27017/Apuestas";
const client = new MongoClient(url);
const database = client.db("Apuestas");

var accesoUsuario: AccesoUsuario = new AccesoUsuario(url, database, database.collection("Usuario"))

rutasUsuarios.post("/registro", (req, res) => {
    const usuario: Usuario = new Usuario(req.body.contraseña, req.body.nombre, req.body.mail,
        req.body.DNI, req.body.ciudad, new Date(req.body.fechaNac), "pendiente", req.body.apellido, 
        req.body.fotoDoc);
    
    accesoUsuario.getUsuario(String(usuario.DNI)).then((v) => {
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