import Database from "../databases/database";
import Entity from "../entity/Entity";
import { CreateOutput, DeleteInput, DeleteOutput, ReadAllOutput, ReadOneOutput, SaveInput, SaveOutput } from "./CRUD.dto";
import { DeepPartial } from "./DeepPartial";
export default abstract class CRUD_Interface {
    protected entity: typeof Entity | undefined;
    protected database: Database | undefined;
    abstract create(): CreateOutput<Entity>;
    abstract create(input: DeepPartial<Entity>): CreateOutput<Entity>;
    abstract readAll(input: DeepPartial<Entity>): ReadAllOutput<Entity>;
    abstract readOne(input: DeepPartial<Entity>): ReadOneOutput<Entity>;
    abstract deleteOne(input: DeleteInput): DeleteOutput;
    abstract save(input: SaveInput<Entity>): SaveOutput;
}
