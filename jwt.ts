import jwt from "jsonwebtoken";

const claveSecreta = "Secreto-Poli-Bet";

export function generarClave(nombre: String): string{
    let dataFirma = {
        "nombre": nombre
    }
    let respuesta = jwt.sign(dataFirma, claveSecreta);

    return respuesta;
}

export function verificarClave(req: any, res: any, next: any){
    const clave = req.headers.authorization;

    if (clave == undefined) {
        return res.status(401).send('Unauthorized: No token provided.');
    }

    try {
        const payload: any = jwt.verify(clave, claveSecreta);
        const nombreGenerado: string = payload.nombre;

        const nombreSolicitud: string = req.body.nombreUsuario;

        if (nombreGenerado !== nombreSolicitud) {
            return res.status(401).send('Unauthorized: Invalid token.');
        }
        next();
    }
    catch (err) {
        return res.status(401).send('Unauthorized: Invalid token.');
    }
}