"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTypes = void 0;
const path = require("path");
const index_1 = require("../index");
var DatabaseTypes;
(function (DatabaseTypes) {
    DatabaseTypes["CSV"] = "CSV";
    DatabaseTypes["JSON"] = "JSON";
})(DatabaseTypes = exports.DatabaseTypes || (exports.DatabaseTypes = {}));
class Database {
    static getTablePath(tableName) {
        if (index_1.default.getDBName() === DatabaseTypes.CSV) {
            return path.join(index_1.default.getDBName(), tableName + ".csv");
        }
        else if (index_1.default.getDBName() === DatabaseTypes.JSON) {
            return path.join(index_1.default.getDBName(), tableName + ".json");
        }
    }
    add(input) {
        return {
            result: false,
        };
    }
    findOne(input) {
        return {
            result: false,
        };
    }
    findAll(input) {
        return {
            result: false,
        };
    }
    update(input) {
        return {
            result: false,
        };
    }
    delete(input) {
        return {
            result: false,
        };
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map