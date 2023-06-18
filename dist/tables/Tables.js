"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CRUD_interface_1 = require("./CRUD.interface");
const database_1 = require("../databases/database");
const CsvDatabase_1 = require("../databases/CsvDatabase/CsvDatabase");
const JsonDatabase_1 = require("../databases/JsonDatabase/JsonDatabase");
const index_1 = require("../index");
class Tables extends CRUD_interface_1.default {
    constructor(entity) {
        super();
        this.entity = entity;
        this.tablename = entity.name;
        if (index_1.default.getDBType() === database_1.DatabaseTypes.CSV) {
            this.database = new CsvDatabase_1.default();
        }
        else if (index_1.default.getDBType() === database_1.DatabaseTypes.JSON) {
            this.database = new JsonDatabase_1.default();
        }
    }
    create(input) {
        try {
            if (this.entity === undefined) {
                return {
                    result: false,
                    message: "Entity Undefined",
                };
            }
            if (input !== undefined) {
                const entity = new this.entity();
                for (const key in input) {
                    if (input.hasOwnProperty(key)) {
                        entity[key] = input[key];
                    }
                }
                return {
                    result: true,
                    entity,
                };
            }
            return {
                result: true,
                entity: undefined,
            };
        }
        catch (error) {
            return {
                result: false,
                message: error.message,
            };
        }
    }
    readAll(input) {
        if (!this.database) {
            return {
                result: false,
                message: "Database 객체가 생성되지 않았습니다.",
            };
        }
        const findAllResult = this.database.findAll({
            tableName: this.tablename,
            where: input,
        });
        if (!findAllResult.result || !findAllResult.data) {
            return {
                result: false,
                message: findAllResult.message,
            };
        }
        let entities = [];
        findAllResult.data.forEach((element) => {
            const entity = new this.entity();
            Object.keys(entity).forEach((key) => {
                entity[key] = element[key];
            });
            entities.push(entity);
        });
        return {
            result: true,
            entities,
        };
    }
    readOne(input) {
        if (!this.database) {
            return {
                result: false,
                message: "Database 객체가 생성되지 않았습니다.",
            };
        }
        const findOneResult = this.database.findOne({
            tableName: this.tablename,
            where: input,
        });
        if (!findOneResult.result || !findOneResult.data) {
            return {
                result: false,
                message: findOneResult.message,
            };
        }
        const entity = new this.entity();
        Object.keys(entity).forEach((key) => {
            entity[key] = findOneResult.data[key];
        });
        return { result: true, entity, index: findOneResult.index };
    }
    deleteOne(input) {
        if (!this.database) {
            return {
                result: false,
                message: "csvDatabase 객체가 생성되지 않았습니다.",
            };
        }
        const deleteResult = this.database.delete({
            tableName: this.tablename,
            index: input.index,
        });
        if (deleteResult.result) {
            return { result: true };
        }
        else {
            return { result: false, message: "CSV Database - deleteOne 에서 문제가 생겼습니다." };
        }
    }
    save(input) {
        try {
            if (!this.database) {
                return {
                    result: false,
                    message: "Database 객체가 생성되지 않았습니다.",
                };
            }
            if (input.index) {
                const updateResult = this.database.update({
                    tableName: this.tablename,
                    index: input.index,
                    newData: input.entity,
                });
                if (!updateResult.result) {
                    return {
                        result: false,
                        message: updateResult.message,
                    };
                }
                return {
                    result: true,
                };
            }
            const saveResult = this.database.add({
                tableName: this.tablename,
                data: input.entity,
            });
            if (!saveResult.result) {
                return {
                    result: false,
                    message: saveResult.message,
                };
            }
            if (saveResult.id) {
                return {
                    result: true,
                    id: saveResult.id,
                };
            }
            return {
                result: true,
            };
        }
        catch (error) {
            return {
                result: false,
                message: error,
            };
        }
    }
}
exports.default = Tables;
//# sourceMappingURL=Tables.js.map