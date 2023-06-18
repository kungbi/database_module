import Entity from "../entity/Entity";
interface DefaultOutput {
    result: boolean;
    message?: any;
}
export interface CreateInput {
}
export interface CreateOutput<E extends Entity> extends DefaultOutput {
    entity?: E;
}
export interface ReadAllInput {
}
export interface ReadAllOutput<E extends Entity> extends DefaultOutput {
    entities?: E[];
}
export interface ReadOneInput {
}
export interface ReadOneOutput<E extends Entity> extends DefaultOutput {
    entity?: E;
    index?: number;
}
export interface UpdateOneInput {
}
export interface UpdateOneOutput extends DefaultOutput {
}
export interface DeleteInput {
}
export interface DeleteOutput extends DefaultOutput {
}
export interface DeleteOneInput {
    index: number;
}
export interface DeleteOneOutput extends DefaultOutput {
}
export interface SaveInput<E extends Entity> {
    entity: E;
    index?: number;
}
export interface SaveOutput extends DefaultOutput {
    id?: number;
}
export {};
