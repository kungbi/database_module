"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const database_1 = require("./databases/database");
const Tables_1 = require("./tables/Tables");
class DatabaseModule {
    constructor() { }
    static getDBName() {
        return DatabaseModule.DB_NAME;
    }
    static getDBType() {
        return DatabaseModule.DB_TYPE;
    }
    static getConnection() {
        if (!DatabaseModule.db) {
            DatabaseModule.db = new DatabaseModule();
        }
        return DatabaseModule.db;
    }
    getRepository(entity) {
        return new Tables_1.default(entity);
    }
}
DatabaseModule.setting = (config) => {
    DatabaseModule.DB_TYPE = config.DB_TYPE;
    console.log(config);
    switch (config.DB_TYPE) {
        case database_1.DatabaseTypes.CSV:
            DatabaseModule.DB_NAME = config.DB_NAME + "_" + database_1.DatabaseTypes.CSV;
            break;
        case database_1.DatabaseTypes.JSON:
            DatabaseModule.DB_NAME = config.DB_NAME + "_" + database_1.DatabaseTypes.JSON;
            break;
    }
    if (!(0, fs_1.existsSync)(DatabaseModule.DB_NAME)) {
        (0, fs_1.mkdirSync)(DatabaseModule.DB_NAME);
    }
};
exports.default = DatabaseModule;
//# sourceMappingURL=index.js.map