/* eslint-disable prefer-const */
import CRUD_Interface from "./CRUD.interface";
import Entity from "../entity/Entity";
import {
	CreateOutput,
	DeleteOneInput,
	DeleteOneOutput,
	ReadAllOutput,
	ReadOneOutput,
	SaveInput,
	SaveOutput,
} from "./CRUD.dto";
import { DeepPartial } from "./DeepPartial";
import Database, { DatabaseTypes } from "../databases/database";
import CSVDatabase from "../databases/CsvDatabase/CsvDatabase";
import JSONDatabase from "../databases/JsonDatabase/JsonDatabase";

export default class Tables<E extends Entity> extends CRUD_Interface {
	tablename: string;
	entity: new () => E;
	database: Database;

	constructor(entity: new () => E) {
		super();
		this.entity = entity;
		this.tablename = entity.name;

		if (Database.getDBType() === DatabaseTypes.CSV) {
			this.database = new CSVDatabase();
		} else if (Database.getDBType() === DatabaseTypes.JSON) {
			this.database = new JSONDatabase();
		}
	}

	/**
	 * 새로운 엔티티를 생성합니다.
	 * @param input 생성할 엔티티의 속성을 포함한 객체
	 * @returns 생성된 엔티티 정보
	 */
	create(input?: DeepPartial<E>): CreateOutput<E> {
		try {
			if (this.entity === undefined) {
				return {
					result: false,
					message: "Entity Undefined",
				};
			}

			if (input !== undefined) {
				const entity = new this.entity() as E;
				for (const key in input) {
					if (input.hasOwnProperty(key)) {
						// input의 각 키와 값을 entity에 할당
						entity[key as keyof E] = input[key] as E[keyof E];
					}
				}
				return {
					result: true,
					entity,
				};
			}

			return {
				result: true,
				entity: undefined,
			};
		} catch (error) {
			return {
				result: false,
				message: error.message,
			};
		}
	}

	/**
	 * 모든 엔티티를 조회합니다.
	 * @returns 조회된 엔티티 목록
	 */
	readAll(input: DeepPartial<E>): ReadAllOutput<E> {
		if (!this.database) {
			return {
				result: false,
				message: "Database 객체가 생성되지 않았습니다.",
			};
		}

		const findAllResult = this.database.findAll({
			tableName: this.tablename,
			where: input,
		});

		if (!findAllResult.result || !findAllResult.data) {
			return {
				result: false,
				message: findAllResult.message,
			};
		}

		let entities: E[] = [];
		findAllResult.data.forEach((element) => {
			let entity = new this.entity() as E;
			Object.keys(element).forEach((key) => {
				entity[key as keyof E] = element[key];
			});

			entities.push(entity);
		});

		return {
			result: true,
			entities,
		};
	}

	/**
	 * 지정된 조건에 해당하는 엔티티를 조회합니다.
	 * @param input 조회할 엔티티의 속성을 포함한 객체
	 * @returns 조회된 엔티티 정보
	 */
	readOne(input: DeepPartial<E>): ReadOneOutput<E> {
		if (!this.database) {
			return {
				result: false,
				message: "Database 객체가 생성되지 않았습니다.",
			};
		}

		const findOneResult = this.database.findOne({
			tableName: this.tablename,
			where: input,
		});

		if (!findOneResult.result || !findOneResult.data) {
			return {
				result: false,
				message: findOneResult.message,
			};
		}

		const entity = new this.entity() as E;
		Object.keys(findOneResult.data).forEach((key) => {
			entity[key as keyof E] = findOneResult.data[key];
		});

		return { result: true, entity, index: findOneResult.index };
	}

	/**
	 * 엔티티를 삭제합니다.
	 * @param input 삭제할 엔티티의 정보를 담은 객체
	 * @returns 삭제 결과
	 */
	deleteOne(input: DeleteOneInput): DeleteOneOutput {
		if (!this.database) {
			return {
				result: false,
				message: "csvDatabase 객체가 생성되지 않았습니다.",
			};
		}

		const deleteResult = this.database.delete({
			tableName: this.tablename,
			index: input.index,
		});

		if (deleteResult.result) {
			return { result: true };
		} else {
			return { result: false, message: "CSV Database - deleteOne 에서 문제가 생겼습니다." };
		}
	}

	/**
	 * 엔티티를 저장합니다.
	 * @param input 저장할 엔티티
	 * @returns 저장 결과
	 */
	save(input: SaveInput<E>): SaveOutput {
		try {
			if (!this.database) {
				return {
					result: false,
					message: "Database 객체가 생성되지 않았습니다.",
				};
			}

			// update
			if (input.index) {
				const updateResult = this.database.update({
					tableName: this.tablename,
					index: input.index,
					newData: input.entity,
				});
				if (!updateResult.result) {
					return {
						result: false,
						message: updateResult.message,
					};
				}

				return {
					result: true,
				};
			}

			// add
			const saveResult = this.database.add({
				tableName: this.tablename,
				data: input.entity,
			});

			if (!saveResult.result) {
				return {
					result: false,
					message: saveResult.message,
				};
			}

			if (saveResult.id) {
				return {
					result: true,
					id: saveResult.id,
				};
			}
			return {
				result: true,
			};
		} catch (error) {
			return {
				result: false,
				message: error,
			};
		}
	}
}
