import { AddInput, AddOutput, DeleteInput, DeleteOutput, FindAllInput, FindAllOutput, FindOneInput, FindOneOutput, UpdateInput, UpdateOutput } from "../database.dto";
import Database from "../database";
export default class CSVDatabase extends Database {
    findMatchingIndices(A: string[], B: string[]): number[];
    getNewId(tableName: string): number;
    private columnValidation;
    private makeDictionary;
    add(input: AddInput): AddOutput;
    findOne(input: FindOneInput): FindOneOutput;
    findAll(input: FindAllInput): FindAllOutput;
    update(input: UpdateInput): UpdateOutput;
    delete(input: DeleteInput): DeleteOutput;
}
