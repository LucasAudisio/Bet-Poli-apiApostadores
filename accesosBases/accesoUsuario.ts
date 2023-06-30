
import { Collection, Db, Filter, FindCursor } from "mongodb";
import { Usuario } from "../Clases/Usuario";
import { createHash } from 'node:crypto';

function sha256(content: string) {  
    return createHash('sha256').update(content).digest('hex')
}

export class AccesoUsuario{
    url: String;
    database: Db;
    collection: Collection;

    constructor(url: String, database: Db, collection: Collection){
        this.url = url;
        this.database = database;
        this.collection = collection;
    }

    public async getUsuario(dato: string) {
        const filtro = { $or: [{DNI: dato}, {mail: dato}] };
        const usuario = await this.collection.findOne(filtro);
        return usuario;
    }

    subirDatos(usuario: Usuario){
        usuario.contraseña = String(sha256(usuario.contraseña.toString()));
        this.collection.insertOne(usuario);
    }
}