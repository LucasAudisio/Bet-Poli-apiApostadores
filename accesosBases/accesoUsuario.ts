
import { Collection, Db, Filter, FindCursor } from "mongodb";
import { Usuario } from "../Clases/Usuario";
import { createHash } from 'node:crypto';

function sha256(content: string) {
    return createHash('sha256').update(content).digest('hex')
}

export class AccesoUsuario {
    url: String;
    database: Db;
    collection: Collection;

    constructor(url: String, database: Db, collection: Collection) {
        this.url = url;
        this.database = database;
        this.collection = collection;
    }

    public async getUsuario(dato: String) {
        const filtro = { $or: [{ DNI: Number(dato) }, { mail: dato }] };
        const usuario = await this.collection.findOne(filtro);
        return usuario;
    }

    public async login(mail: string, contraseña: string) {
        const v = await this.getUsuario(mail);
        const response = {
            estado: false,
            mensaje: ""
        }

        if (v != undefined) {
            if (v.contraseña == sha256(contraseña)) {
                response.estado = true
                response.mensaje = "todo bien"
                return response;
            }
            else {
                response.estado = false
                response.mensaje = "contraseña incorrecta"
                return response;
            }
        }
        else {
            response.estado = false
            response.mensaje = "Usuario no encontrado"
            return response;
        }
    }


    subirDatos(usuario: Usuario) {
        usuario.contraseña = String(sha256(usuario.contraseña.toString()));
        this.collection.insertOne(usuario);
    }
}