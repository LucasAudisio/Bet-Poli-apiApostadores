import { Collection, Db } from "mongodb";

export class AccesoVerify{
    url: String;
    database: Db;
    collection: Collection;

    constructor(url: String, database: Db, collection: Collection){
        this.url = url;
        this.database = database;
        this.collection = collection;
    }

    subirOTP(mail: String, otp: Number){
        this.collection.insertOne({mail: mail, otp: otp});
    }

    async getOTP(mail: String){
        return await this.collection.findOne({mail:mail});
    }

    deleteOTP(mail: String){
        this.collection.deleteOne({mail: mail});
    }
}