import mongoose, { ConnectOptions } from 'mongoose';
import config from './config/config';

mongoose.connect(config.DB.URI);

export const initializeDbConnection = async () => {
    mongoose.connection.once('open', () => {
        console.log("Connected to db.");
    });
    mongoose.connection.on('error', err =>{
        console.log(err);
        process.exit(0);
    });
};

export const getDbConnection = (dbName:any) => {
    const db = mongoose.connection.useDb(dbName);
    return db;
}