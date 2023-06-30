export class Usuario{
    contraseña: String;
    nombre: String;
    apellido: String;
    fotoDoc: String;
    mail: String;
    DNI: String;
    ciudad: String;
    fechaNac: Date;
    estado: String;
    
    constructor(contraseña: String, nombre: String, mail: String, DNI: String, ciudad: String,
        fechaNac: Date, estado: String, apellido: String, fotoDoc: String){
        this.contraseña = contraseña;
        this.nombre = nombre;
        this.mail = mail;
        this.DNI = DNI;
        this.ciudad = ciudad;
        this.fechaNac = fechaNac;
        this.estado = estado;
        this.apellido = apellido;
        this.fotoDoc = fotoDoc;
    }
}