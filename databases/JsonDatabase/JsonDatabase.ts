import {
	AddInput,
	AddOutput,
	FindAllInput,
	FindAllOutput,
	FindOneInput,
	FindOneOutput,
	UpdateInput,
	UpdateOutput,
	DeleteInput,
	DeleteOutput,
} from "../database.dto";
import Database from "../database";
import { existsSync, readFileSync, writeFileSync } from "fs";

export default class JSONDatabase extends Database {
	private mkfile(tablePath: string) {
		writeFileSync(tablePath, JSON.stringify([]), "utf-8");
	}

	private getNewId(tableName: string): number {
		const tablePath = JSONDatabase.getTablePath(tableName);
		const fileContent = JSON.parse(readFileSync(tablePath, "utf-8"));

		if (fileContent.length === 0) {
			return 1;
		}
		const lastData = fileContent[fileContent.length - 1];
		return parseInt(lastData["id"], 10) + 1;
	}

	private readJsonFile(tableName: string) {
		const tablePath = JSONDatabase.getTablePath(tableName);
		const fileContent = JSON.parse(readFileSync(tablePath, "utf-8"));
		return fileContent;
	}

	private checkFileExist(tableName: string, mode?: string): boolean {
		const tablePath = JSONDatabase.getTablePath(tableName);

		// file이 존재하지 않다면 생성
		if (!existsSync(tablePath)) {
			if (mode === "CREATE") {
				this.mkfile(tablePath);
				return true;
			}
			return false;
		}
		return true;
	}

	private saveFile(tableName: string, fileContent: Object) {
		const tablePath = JSONDatabase.getTablePath(tableName);
		writeFileSync(tablePath, JSON.stringify(fileContent), "utf-8");
	}

	private columnValidation(data: Object, where: Object): boolean {
		const validationResult: boolean[] = Object.keys(where).map(
			(key) => data.hasOwnProperty(key) && data[key] === where[key]
		);
		if (validationResult.every((element) => element === true)) {
			return true;
		}

		return false;
	}

	public add(input: AddInput): AddOutput {
		try {
			// file이 존재하는지 확인. 없으면 생성
			this.checkFileExist(input.tableName, "CREATE");

			// JSON 파일 읽어오기
			const databaseData = this.readJsonFile(input.tableName);

			// id 생성
			if (input.data.hasOwnProperty("id")) {
				input.data["id"] = this.getNewId(input.tableName);
			}

			// 데이터 추가
			databaseData.push(input.data);

			// 데이터 파일에 저장
			this.saveFile(input.tableName, databaseData);

			if (input.data.hasOwnProperty("id")) {
				return {
					result: true,
					id: input.data["id"],
				};
			} else {
				return {
					result: true,
				};
			}
		} catch (error) {
			return {
				result: false,
				message: error.message,
			};
		}
	}

	public findOne(input: FindOneInput): FindOneOutput {
		try {
			// file이 존재하는지 확인
			if (!this.checkFileExist(input.tableName)) {
				return {
					result: false,
					message: "JSON: file이 존재하지 않습니다",
				};
			}

			// JSON 파일 읽어오기
			const databaseData = this.readJsonFile(input.tableName);

			// 데이터 찾기
			for (let i = 0; i < databaseData.length; i++) {
				if (i === input.index) {
					return {
						result: true,
						data: databaseData[i],
						index: i,
					};
				}

				if (this.columnValidation(databaseData[i], input.where)) {
					return {
						result: true,
						data: databaseData[i],
						index: i,
					};
				}
			}

			return {
				result: false,
				message: "JSON: 검색된 데이터가 없습니다.",
			};
		} catch (error) {
			return {
				result: false,
				message: error.message,
			};
		}
	}

	public findAll(input: FindAllInput): FindAllOutput {
		try {
			// file이 존재하는지 확인
			if (!this.checkFileExist(input.tableName)) {
				return {
					result: false,
					message: "JSON: file이 존재하지 않습니다",
				};
			}

			// JSON 파일 읽어오기
			const databaseData = this.readJsonFile(input.tableName);

			// 데이터 찾기
			const foundData = [];
			for (let i = 0; i < databaseData.length; i++) {
				if (this.columnValidation(databaseData[i], input.where)) {
					foundData.push(databaseData[i]);
				}
			}

			if (foundData.length === 0) {
				return {
					result: false,
					message: "JSON: 검색된 데이터가 없습니다.",
				};
			}

			return {
				result: true,
				data: foundData,
			};
		} catch (error) {
			return {
				result: false,
				message: error.message,
			};
		}
	}

	public update(input: UpdateInput): UpdateOutput {
		try {
			// file이 존재하는지 확인
			if (!this.checkFileExist(input.tableName)) {
				return {
					result: false,
					message: "JSON: file이 존재하지 않습니다",
				};
			}

			// JSON 파일 가져오기
			const databaseData = this.readJsonFile(input.tableName);

			// 데이터 수정
			let updated: boolean = false;
			for (let i = 0; i < databaseData.length; i++) {
				if (i === input.index) {
					updated = true;
					databaseData[i] = input.newData;
				}
			}

			// 데이터 저장
			this.saveFile(input.tableName, databaseData);

			if (!updated) {
				return {
					result: false,
					message: "JSON: update가 되지 않았습니다.",
				};
			}

			return {
				result: true,
			};
		} catch (error) {
			return {
				result: false,
				message: error.message,
			};
		}
	}

	public delete(input: DeleteInput): DeleteOutput {
		try {
			// file이 존재하는지 확인
			if (!this.checkFileExist(input.tableName)) {
				return {
					result: false,
					message: "JSON: file이 존재하지 않습니다",
				};
			}

			// JSON 파일 가져오기
			const databaseData = this.readJsonFile(input.tableName);

			if (databaseData.length - 1 < input.index) {
				return {
					result: false,
					message: "JSON: 삭제할 데이터가 없습니다",
				};
			}

			// 데이터 삭제
			databaseData.splice(input.index, 1);

			// 데이터 저장
			this.saveFile(input.tableName, databaseData);
		} catch (error) {
			return {
				result: false,
				message: error.message,
			};
		}
	}
}
