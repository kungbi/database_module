import { DatabaseTypes } from "./databases/database";
import Entity from "./entity/Entity";
import { ObjectLiteral } from "./tables/ObjectLiteral";
import Tables from "./tables/Tables";
export default class DatabaseModule {
    private static db;
    private static DB_NAME;
    private static DB_TYPE;
    constructor();
    static setting: (config: {
        DB_NAME: string;
        DB_TYPE: DatabaseTypes;
    }) => void;
    static getDBName(): string;
    static getDBType(): string;
    static getConnection(): DatabaseModule;
    getRepository<T extends ObjectLiteral & Entity>(entity: new () => T): Tables<T>;
}
