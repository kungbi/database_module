"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const database_1 = require("../database");
const CsvObjectAdapter_1 = require("./CsvObjectAdapter");
class CSVDatabase extends database_1.default {
    findMatchingIndices(A, B) {
        const matchingIndices = [];
        B.forEach((value) => {
            const index = A.indexOf(value);
            if (index !== -1) {
                matchingIndices.push(index);
            }
        });
        return matchingIndices;
    }
    getNewId(tableName) {
        const tablePath = CSVDatabase.getTablePath(tableName);
        const fileContent = fs.readFileSync(tablePath, "utf-8");
        const lines = fileContent.split("\n");
        const header = lines[0].split(",");
        const idIndex = header.indexOf("id");
        if (idIndex === -1) {
            return -1;
        }
        if (lines.length > 2) {
            const rowData = lines[lines.length - 2].split(",");
            const id = parseInt(rowData[idIndex], 10) + 1;
            return id;
        }
        else {
            return 1;
        }
    }
    columnValidation(columnIndex, rowData, values) {
        const validationResult = values.map((value, index) => rowData[columnIndex[index]] === value.toString());
        if (validationResult.every((element) => element === true)) {
            return true;
        }
        return false;
    }
    makeDictionary(keys, values) {
        const dictionary = {};
        keys.forEach((key, idx) => (dictionary[key] = values[idx]));
        return dictionary;
    }
    add(input) {
        try {
            const tablePath = CSVDatabase.getTablePath(input.tableName);
            if (!fs.existsSync(tablePath)) {
                const header = Object.keys(input.data).join(",") + "\n";
                fs.writeFileSync(tablePath, header, "utf-8");
            }
            let index;
            let newId;
            if ((index = Object.keys(input.data).indexOf("id")) !== -1) {
                newId = this.getNewId(input.tableName);
                input.data["id"] = newId.toString();
            }
            const csvContent = Object.values(input.data).join(",") + "\n";
            fs.appendFileSync(tablePath, csvContent, "utf-8");
            if (index != -1) {
                return {
                    result: true,
                    id: newId,
                };
            }
            return {
                result: true,
            };
        }
        catch (e) {
            return {
                result: false,
                message: e,
            };
        }
    }
    findOne(input) {
        try {
            const tablePath = CSVDatabase.getTablePath(input.tableName);
            const fileContent = fs.readFileSync(tablePath, "utf-8");
            const lines = fileContent.split("\n");
            const header = lines[0].split(",");
            const columnIndex = this.findMatchingIndices(header, Object.keys(input.where));
            if (columnIndex.length > 0) {
                for (let i = 1; i < lines.length; i++) {
                    const rowData = lines[i].split(",");
                    if (i == input.index) {
                        return {
                            result: true,
                            index: i,
                            data: this.makeDictionary(header, rowData),
                        };
                    }
                    if (this.columnValidation(columnIndex, rowData, Object.values(input.where))) {
                        return {
                            result: true,
                            index: i,
                            data: this.makeDictionary(header, rowData),
                        };
                    }
                }
            }
            return {
                result: false,
                message: "CSV: 검색된 데이터가 없습니다.",
            };
        }
        catch (e) {
            return {
                result: false,
                message: e,
            };
        }
    }
    findAll(input) {
        try {
            const tablePath = CSVDatabase.getTablePath(input.tableName);
            const foundData = [];
            const fileContent = fs.readFileSync(tablePath, "utf-8");
            const lines = fileContent.split("\n");
            const header = lines[0].split(",");
            const columnIndex = this.findMatchingIndices(header, Object.keys(input.where));
            if (lines.length <= 1) {
                return {
                    result: false,
                    message: "CSV DATABASE - findAll: 데이터가 없습니다.",
                };
            }
            if (lines.length > 2) {
                for (let i = 1; i < lines.length; i++) {
                    const rowData = lines[i].split(",");
                    if (this.columnValidation(columnIndex, rowData, Object.values(input.where))) {
                        foundData.push(this.makeDictionary(header, rowData));
                    }
                }
            }
            return {
                result: true,
                data: foundData,
            };
        }
        catch (e) {
            return {
                result: false,
                message: e,
            };
        }
    }
    update(input) {
        try {
            const tablePath = CSVDatabase.getTablePath(input.tableName);
            const newData = CsvObjectAdapter_1.default.stringify(input.newData);
            const fileContent = fs.readFileSync(tablePath, "utf-8");
            const lines = fileContent.split("\n");
            if (input.index >= 0 && input.index < lines.length) {
                const rowData = lines[input.index].split(",");
                for (let i = 0; i < newData.data.length; i++) {
                    if (rowData[i] !== undefined) {
                        rowData[i] = newData.data[i];
                    }
                }
                lines[input.index] = rowData.join(",");
                fs.writeFileSync(tablePath, lines.join("\n"), "utf-8");
                return {
                    result: true,
                };
            }
            return {
                result: false,
                message: "CSV: 데이터를 수정하는데 문제가 발생했습니다",
            };
        }
        catch (e) {
            return {
                result: false,
                message: e,
            };
        }
    }
    delete(input) {
        try {
            const tablePath = CSVDatabase.getTablePath(input.tableName);
            const fileContent = fs.readFileSync(tablePath, "utf-8");
            const lines = fileContent.split("\n");
            let deleted = false;
            for (let i = 1; i < lines.length; i++) {
                if (i === input.index) {
                    lines.splice(i, 1);
                    deleted = true;
                    break;
                }
            }
            if (deleted) {
                fs.writeFileSync(tablePath, lines.join("\n"), "utf-8");
                return {
                    result: true,
                };
            }
            return {
                result: false,
                message: "CSV: 데이터를 삭제하는데 문제가 발생했습니다",
            };
        }
        catch (e) {
            return {
                result: false,
                message: e,
            };
        }
    }
}
exports.default = CSVDatabase;
//# sourceMappingURL=CsvDatabase.js.map