import { AddInput, AddOutput, FindAllInput, FindAllOutput, FindOneInput, FindOneOutput, UpdateInput, UpdateOutput, DeleteInput, DeleteOutput } from "../database.dto";
import Database from "../database";
export default class JSONDatabase extends Database {
    private mkfile;
    private getNewId;
    private readJsonFile;
    private checkFileExist;
    private saveFile;
    private columnValidation;
    add(input: AddInput): AddOutput;
    findOne(input: FindOneInput): FindOneOutput;
    findAll(input: FindAllInput): FindAllOutput;
    update(input: UpdateInput): UpdateOutput;
    delete(input: DeleteInput): DeleteOutput;
}
