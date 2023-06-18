interface DefaultOutput {
    result: boolean;
    message?: any;
}
export interface AddInput {
    tableName: string;
    data: Object;
}
export interface AddOutput extends DefaultOutput {
    id?: number;
}
export interface FindOneInput {
    tableName: string;
    index?: number;
    where?: Object;
}
export interface FindOneOutput extends DefaultOutput {
    index?: number;
    data?: Object;
}
export interface FindAllInput {
    tableName: string;
    where: Object;
}
export interface FindAllOutput extends DefaultOutput {
    data?: Object[];
}
export interface UpdateInput {
    tableName: string;
    index: number;
    newData: Object;
}
export interface UpdateOutput extends DefaultOutput {
}
export interface DeleteInput {
    tableName: string;
    index: number;
}
export interface DeleteOutput extends DefaultOutput {
}
export {};
