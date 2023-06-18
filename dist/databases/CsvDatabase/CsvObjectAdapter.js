"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CsvObjectAdapter {
    static parse(header, data) {
        const keys = header.split(",");
        const values = data.split(",");
        let result = {};
        for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = values[i];
        }
        return result;
    }
    static stringify(input) {
        let columnNames = [];
        let data = [];
        Object.entries(input).forEach((entry) => {
            if (entry[0] !== "TABLE_NAME") {
                if (entry[1] instanceof Array) {
                    console.log(entry[1], "is Array!");
                }
                columnNames.push(entry[0]);
                data.push(entry[1]);
            }
        });
        return {
            columnNames,
            data,
        };
    }
}
exports.default = CsvObjectAdapter;
//# sourceMappingURL=CsvObjectAdapter.js.map