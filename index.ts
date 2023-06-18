import Database, { DatabaseTypes } from "./databases/database";
import Entity from "./entity/Entity";
import { ObjectLiteral } from "./tables/ObjectLiteral";
import Tables from "./tables/Tables";

export default class DatabaseModule {
	private static db: DatabaseModule;
	private static DB_NAME: string;

	constructor() {}

	/**
	 * 데이터베이스 설정을 초기화합니다.
	 * @param config 설정 객체
	 */
	static setting = (config: { DB_NAME: string; DB_TYPE: DatabaseTypes }): void => {
		DatabaseModule.DB_NAME = config.DB_NAME;
		Database.setting({
			DB_NAME: config.DB_NAME,
			DB_TYPE: config.DB_TYPE,
		});
	};

	static getDBName(): string {
		return DatabaseModule.DB_NAME;
	}

	/**
	 * 데이터베이스 연결을 가져옵니다.
	 * 인스턴스가 없으면 새로운 인스턴스를 생성합니다.
	 * @returns 데이터베이스 연결 객체
	 */
	static getConnection(): DatabaseModule {
		if (!DatabaseModule.db) {
			DatabaseModule.db = new DatabaseModule();
		}

		return DatabaseModule.db;
	}

	/**
	 * 엔티티에 대한 레포지토리를 생성하여 반환합니다.
	 * @param entity 엔티티 클래스
	 * @param tablename 테이블명
	 * @returns 테이블 레포지토리 객체
	 */
	getRepository<T extends ObjectLiteral & Entity>(entity: new () => T) {
		return new Tables<T>(entity);
	}
}
