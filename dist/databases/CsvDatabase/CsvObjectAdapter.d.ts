import Entity from "../../entity/Entity";
export default class CsvObjectAdapter {
    static parse(header: string, data: string): Record<string, string>;
    static stringify(input: Entity): {
        columnNames: string[];
        data: string[];
    };
}
