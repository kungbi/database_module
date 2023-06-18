import CRUD_Interface from "./CRUD.interface";
import Entity from "../entity/Entity";
import { CreateOutput, DeleteOneInput, DeleteOneOutput, ReadAllOutput, ReadOneOutput, SaveInput, SaveOutput } from "./CRUD.dto";
import { DeepPartial } from "./DeepPartial";
import Database from "../databases/database";
export default class Tables<E extends Entity> extends CRUD_Interface {
    tablename: string;
    entity: new () => E;
    database: Database;
    constructor(entity: new () => E);
    create(input?: DeepPartial<E>): CreateOutput<E>;
    readAll(input: DeepPartial<E>): ReadAllOutput<E>;
    readOne(input: DeepPartial<E>): ReadOneOutput<E>;
    deleteOne(input: DeleteOneInput): DeleteOneOutput;
    save(input: SaveInput<E>): SaveOutput;
}
