"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbConnection = exports.initializeDbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
mongoose_1.default.connect(config_1.default.DB.URI);
const initializeDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.once('open', () => {
        console.log("Connected to db.");
    });
    mongoose_1.default.connection.on('error', err => {
        console.log(err);
        process.exit(0);
    });
});
exports.initializeDbConnection = initializeDbConnection;
const getDbConnection = (dbName) => {
    const db = mongoose_1.default.connection.useDb(dbName);
    return db;
};
exports.getDbConnection = getDbConnection;
