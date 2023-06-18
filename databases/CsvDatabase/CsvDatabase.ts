import * as fs from "fs";

import {
	AddInput,
	AddOutput,
	DeleteInput,
	DeleteOutput,
	FindAllInput,
	FindAllOutput,
	FindOneInput,
	FindOneOutput,
	UpdateInput,
	UpdateOutput,
} from "../database.dto";
import Database from "../database";
import CsvObjectAdapter from "./CsvObjectAdapter";

export default class CSVDatabase extends Database {
	findMatchingIndices(A: string[], B: string[]): number[] {
		const matchingIndices: number[] = [];

		B.forEach((value) => {
			const index = A.indexOf(value);
			if (index !== -1) {
				matchingIndices.push(index);
			}
		});

		return matchingIndices;
	}

	getNewId(tableName: string): number {
		const tablePath = CSVDatabase.getTablePath(tableName);

		const fileContent = fs.readFileSync(tablePath, "utf-8");
		const lines = fileContent.split("\n");
		const header = lines[0].split(",");
		const idIndex = header.indexOf("id");
		if (idIndex === -1) {
			return -1;
		}

		if (lines.length > 2) {
			const rowData = lines[lines.length - 2].split(",");
			const id = parseInt(rowData[idIndex], 10) + 1;

			return id;
		} else {
			return 1;
		}
	}

	private columnValidation(columnIndex: number[], rowData: string[], values: string[]): boolean {
		const validationResult: boolean[] = values.map((value, index) => rowData[columnIndex[index]] === value.toString());
		if (validationResult.every((element) => element === true)) {
			return true;
		}
		return false;
	}

	private makeDictionary(keys: string[], values: string[]) {
		const dictionary = {};
		keys.forEach((key, idx) => (dictionary[key] = values[idx]));
		return dictionary;
	}

	/**
	 * 데이터 추가 메서드
	 * @param input 추가할 데이터 입력
	 * @returns 결과 및 메시지
	 */
	public add(input: AddInput): AddOutput {
		try {
			const tablePath = CSVDatabase.getTablePath(input.tableName);

			if (!fs.existsSync(tablePath)) {
				// CSV 파일이 존재하지 않으면 헤더를 추가하고 데이터를 쓰기
				const header = Object.keys(input.data).join(",") + "\n";
				fs.writeFileSync(tablePath, header, "utf-8");
			}

			let index;
			let newId;
			if ((index = Object.keys(input.data).indexOf("id")) !== -1) {
				newId = this.getNewId(input.tableName);
				input.data["id"] = newId.toString();
			}

			// CSV 데이터 생성
			const csvContent = Object.values(input.data).join(",") + "\n";

			// CSV 파일에 데이터 추가
			fs.appendFileSync(tablePath, csvContent, "utf-8");

			if (index != -1) {
				return {
					result: true,
					id: newId,
				};
			}

			return {
				result: true,
			};
		} catch (e) {
			return {
				result: false,
				message: e,
			};
		}
	}

	/**
	 * 특정 데이터 조회 메서드
	 * @param input 조회 조건 입력
	 * @returns 결과 및 메시지
	 */
	public findOne(input: FindOneInput): FindOneOutput {
		try {
			const tablePath = CSVDatabase.getTablePath(input.tableName);

			// CSV 파일에서 조건에 맞는 데이터 찾기
			const fileContent = fs.readFileSync(tablePath, "utf-8");
			const lines = fileContent.split("\n");
			const header = lines[0].split(",");
			const columnIndex = this.findMatchingIndices(header, Object.keys(input.where));

			if (columnIndex.length > 0) {
				for (let i = 1; i < lines.length; i++) {
					const rowData = lines[i].split(",");

					if (i == input.index) {
						return {
							result: true,
							index: i,
							data: this.makeDictionary(header, rowData),
						};
					}

					if (this.columnValidation(columnIndex, rowData, Object.values(input.where))) {
						return {
							result: true,
							index: i,
							data: this.makeDictionary(header, rowData),
						};
					}
				}
			}

			return {
				result: false,
				message: "CSV: 검색된 데이터가 없습니다.",
			};
		} catch (e) {
			return {
				result: false,
				message: e,
			};
		}
	}

	/**
	 * 모든 데이터 조회 메서드
	 * @param input 조회 조건 입력
	 * @returns 결과 및 데이터 배열
	 */
	public findAll(input: FindAllInput): FindAllOutput {
		try {
			const tablePath = CSVDatabase.getTablePath(input.tableName);
			const foundData: Object[] = [];

			// CSV 파일에서 조건에 맞는 모든 데이터 찾기
			const fileContent = fs.readFileSync(tablePath, "utf-8");
			const lines = fileContent.split("\n");
			const header = lines[0].split(",");
			const columnIndex = this.findMatchingIndices(header, Object.keys(input.where));

			if (lines.length <= 1) {
				return {
					result: false,
					message: "CSV DATABASE - findAll: 데이터가 없습니다.",
				};
			}

			if (lines.length > 2) {
				for (let i = 1; i < lines.length; i++) {
					const rowData = lines[i].split(",");
					if (this.columnValidation(columnIndex, rowData, Object.values(input.where))) {
						foundData.push(this.makeDictionary(header, rowData));
					}
				}
			}

			return {
				result: true,
				data: foundData,
			};
		} catch (e) {
			return {
				result: false,
				message: e,
			};
		}
	}

	/**
	 * 데이터 업데이트 메서드
	 * @param input 업데이트 정보 입력
	 * @returns 결과 및 메시지
	 */
	public update(input: UpdateInput): UpdateOutput {
		try {
			const tablePath = CSVDatabase.getTablePath(input.tableName);
			const newData = CsvObjectAdapter.stringify(input.newData);

			// CSV 파일에서 특정 인덱스의 데이터 수정
			const fileContent = fs.readFileSync(tablePath, "utf-8");
			const lines = fileContent.split("\n");

			if (input.index >= 0 && input.index < lines.length) {
				const rowData = lines[input.index].split(",");
				for (let i = 0; i < newData.data.length; i++) {
					if (rowData[i] !== undefined) {
						rowData[i] = newData.data[i];
					}
				}
				lines[input.index] = rowData.join(",");

				// 수정된 데이터로 CSV 파일 업데이트
				fs.writeFileSync(tablePath, lines.join("\n"), "utf-8");
				return {
					result: true,
				};
			}

			return {
				result: false,
				message: "CSV: 데이터를 수정하는데 문제가 발생했습니다",
			};
		} catch (e) {
			return {
				result: false,
				message: e,
			};
		}
	}

	/**
	 * 데이터 삭제 메서드
	 * @param input 삭제 조건 입력
	 * @returns 결과 및 메시지
	 */
	public delete(input: DeleteInput): DeleteOutput {
		try {
			const tablePath = CSVDatabase.getTablePath(input.tableName);

			// CSV 파일에서 조건에 맞는 데이터 삭제
			const fileContent = fs.readFileSync(tablePath, "utf-8");
			const lines = fileContent.split("\n");

			let deleted = false;
			for (let i = 1; i < lines.length; i++) {
				if (i === input.index) {
					lines.splice(i, 1);
					deleted = true;
					break;
				}
			}

			if (deleted) {
				// 데이터가 삭제되었으므로 CSV 파일 업데이트
				fs.writeFileSync(tablePath, lines.join("\n"), "utf-8");
				return {
					result: true,
				};
			}

			return {
				result: false,
				message: "CSV: 데이터를 삭제하는데 문제가 발생했습니다",
			};
		} catch (e) {
			return {
				result: false,
				message: e,
			};
		}
	}
}
