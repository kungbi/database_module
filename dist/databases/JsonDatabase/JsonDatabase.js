"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const fs_1 = require("fs");
class JSONDatabase extends database_1.default {
    mkfile(tablePath) {
        (0, fs_1.writeFileSync)(tablePath, JSON.stringify([]), "utf-8");
    }
    getNewId(tableName) {
        const tablePath = JSONDatabase.getTablePath(tableName);
        const fileContent = JSON.parse((0, fs_1.readFileSync)(tablePath, "utf-8"));
        if (fileContent.length === 0) {
            return 1;
        }
        const lastData = fileContent[fileContent.length - 1];
        return parseInt(lastData["id"], 10) + 1;
    }
    readJsonFile(tableName) {
        const tablePath = JSONDatabase.getTablePath(tableName);
        const fileContent = JSON.parse((0, fs_1.readFileSync)(tablePath, "utf-8"));
        return fileContent;
    }
    checkFileExist(tableName, mode) {
        const tablePath = JSONDatabase.getTablePath(tableName);
        if (!(0, fs_1.existsSync)(tablePath)) {
            if (mode === "CREATE") {
                this.mkfile(tablePath);
                return true;
            }
            return false;
        }
        return true;
    }
    saveFile(tableName, fileContent) {
        const tablePath = JSONDatabase.getTablePath(tableName);
        (0, fs_1.writeFileSync)(tablePath, JSON.stringify(fileContent), "utf-8");
    }
    columnValidation(data, where) {
        const validationResult = Object.keys(where).map((key) => data.hasOwnProperty(key) && data[key] === where[key]);
        if (validationResult.every((element) => element === true)) {
            return true;
        }
        return false;
    }
    add(input) {
        try {
            this.checkFileExist(input.tableName, "CREATE");
            const databaseData = this.readJsonFile(input.tableName);
            if (input.data.hasOwnProperty("id")) {
                input.data["id"] = this.getNewId(input.tableName);
            }
            databaseData.push(input.data);
            this.saveFile(input.tableName, databaseData);
            if (input.data.hasOwnProperty("id")) {
                return {
                    result: true,
                    id: input.data["id"],
                };
            }
            else {
                return {
                    result: true,
                };
            }
        }
        catch (error) {
            return {
                result: false,
                message: error.message,
            };
        }
    }
    findOne(input) {
        try {
            if (!this.checkFileExist(input.tableName)) {
                return {
                    result: false,
                    message: "JSON: file이 존재하지 않습니다",
                };
            }
            const databaseData = this.readJsonFile(input.tableName);
            for (let i = 0; i < databaseData.length; i++) {
                if (i === input.index) {
                    return {
                        result: true,
                        data: databaseData[i],
                        index: i,
                    };
                }
                if (this.columnValidation(databaseData[i], input.where)) {
                    return {
                        result: true,
                        data: databaseData[i],
                        index: i,
                    };
                }
            }
            return {
                result: false,
                message: "JSON: 검색된 데이터가 없습니다.",
            };
        }
        catch (error) {
            return {
                result: false,
                message: error.message,
            };
        }
    }
    findAll(input) {
        try {
            if (!this.checkFileExist(input.tableName)) {
                return {
                    result: false,
                    message: "JSON: file이 존재하지 않습니다",
                };
            }
            const databaseData = this.readJsonFile(input.tableName);
            const foundData = [];
            for (let i = 0; i < databaseData.length; i++) {
                if (this.columnValidation(databaseData[i], input.where)) {
                    foundData.push(databaseData[i]);
                }
            }
            if (foundData.length === 0) {
                return {
                    result: false,
                    message: "JSON: 검색된 데이터가 없습니다.",
                };
            }
            return {
                result: true,
                data: foundData,
            };
        }
        catch (error) {
            return {
                result: false,
                message: error.message,
            };
        }
    }
    update(input) {
        try {
            if (!this.checkFileExist(input.tableName)) {
                return {
                    result: false,
                    message: "JSON: file이 존재하지 않습니다",
                };
            }
            const databaseData = this.readJsonFile(input.tableName);
            let updated = false;
            for (let i = 0; i < databaseData.length; i++) {
                if (i === input.index) {
                    updated = true;
                    databaseData[i] = input.newData;
                }
            }
            this.saveFile(input.tableName, databaseData);
            if (!updated) {
                return {
                    result: false,
                    message: "JSON: update가 되지 않았습니다.",
                };
            }
            return {
                result: true,
            };
        }
        catch (error) {
            return {
                result: false,
                message: error.message,
            };
        }
    }
    delete(input) {
        try {
            if (!this.checkFileExist(input.tableName)) {
                return {
                    result: false,
                    message: "JSON: file이 존재하지 않습니다",
                };
            }
            const databaseData = this.readJsonFile(input.tableName);
            if (databaseData.length - 1 < input.index) {
                return {
                    result: false,
                    message: "JSON: 삭제할 데이터가 없습니다",
                };
            }
            databaseData.splice(input.index, 1);
            this.saveFile(input.tableName, databaseData);
        }
        catch (error) {
            return {
                result: false,
                message: error.message,
            };
        }
    }
}
exports.default = JSONDatabase;
//# sourceMappingURL=JsonDatabase.js.map