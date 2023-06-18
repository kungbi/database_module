import { existsSync, mkdirSync } from "fs";
import * as path from "path";
import {
	AddInput,
	AddOutput,
	DeleteOutput,
	FindAllInput,
	FindAllOutput,
	FindOneInput,
	FindOneOutput,
	UpdateInput,
	UpdateOutput,
} from "./database.dto";
import { DeleteInput } from "../tables/CRUD.dto";
import DatabaseModule from "../index";

export enum DatabaseTypes {
	CSV = "CSV",
	JSON = "JSON",
}

export default class Database {
	private static DB_NAME: string;
	private static DB_TYPE: DatabaseTypes;

	static setting(config: { DB_NAME: string; DB_TYPE: DatabaseTypes }) {
		this.DB_TYPE = config.DB_TYPE;
		switch (config.DB_TYPE) {
			case DatabaseTypes.CSV:
				Database.DB_NAME = +"_" + DatabaseTypes.CSV;
				break;
			case DatabaseTypes.JSON:
				Database.DB_NAME = config.DB_NAME + "_" + DatabaseTypes.JSON;
				break;
		}

		// 디렉토리가 존재하지 않을 경우 생성
		if (!existsSync(config.DB_NAME)) {
			mkdirSync(config.DB_NAME);
		}
	}

	static getDBType(): DatabaseTypes {
		return Database.DB_TYPE;
	}

	// table 주소를 생성
	protected static getTablePath(tableName: string): string {
		if (Database.DB_TYPE === DatabaseTypes.CSV) {
			return path.join(Database.DB_NAME, tableName + ".csv");
		} else if (Database.DB_TYPE === DatabaseTypes.JSON) {
			return path.join(Database.DB_NAME, tableName + ".json");
		}
	}

	// add findOne, findAll, update, delete
	public add(input: AddInput): AddOutput {
		return {
			result: false,
		};
	}
	public findOne(input: FindOneInput): FindOneOutput {
		return {
			result: false,
		};
	}
	public findAll(input: FindAllInput): FindAllOutput {
		return {
			result: false,
		};
	}
	public update(input: UpdateInput): UpdateOutput {
		return {
			result: false,
		};
	}
	public delete(input: DeleteInput): DeleteOutput {
		return {
			result: false,
		};
	}
}
