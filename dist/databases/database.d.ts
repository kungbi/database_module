import { AddInput, AddOutput, DeleteOutput, FindAllInput, FindAllOutput, FindOneInput, FindOneOutput, UpdateInput, UpdateOutput } from "./database.dto";
import { DeleteInput } from "../tables/CRUD.dto";
export declare enum DatabaseTypes {
    CSV = "CSV",
    JSON = "JSON"
}
export default class Database {
    protected static getTablePath(tableName: string): string;
    add(input: AddInput): AddOutput;
    findOne(input: FindOneInput): FindOneOutput;
    findAll(input: FindAllInput): FindAllOutput;
    update(input: UpdateInput): UpdateOutput;
    delete(input: DeleteInput): DeleteOutput;
}
