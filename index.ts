import express from "express";
import { rutasUsuarios } from "./Rutas/rutasUsuarios";
const multer = require('multer');
const upload = multer();

const app = express();

const puerto = 3000;

app.get("", (req, res) => res.send("Bienvenido a mi api"));

app.listen(puerto, () => console.log("Escuchando en el puerto: " + puerto));

app.use("/usuarios", upload.none(), rutasUsuarios);