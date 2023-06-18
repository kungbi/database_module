import Entity from "../../entity/Entity";

export default class CsvObjectAdapter {
	/**
	 * CSV Database에서 가장 중요하다고 볼 수 있는 부분인데
	 * 아직 간단한 것들밖에 작동하지 않습니다.
	 * 사실 CSV말고 JSON 형식으로 구현했으면 얼마나 좋았을까 라는 생각이 듭니다...
	 * */

	/**
	 * CSV 헤더와 데이터를 파싱하여 객체로 변환하는 메서드
	 * @param header CSV 헤더 문자열
	 * @param data CSV 데이터 문자열
	 * @returns 변환된 객체
	 */
	static parse(header: string, data: string) {
		const keys = header.split(",");
		const values = data.split(",");

		let result: Record<string, string> = {};
		for (let i = 0; i < keys.length; i++) {
			result[keys[i]] = values[i];
		}

		return result;
	}

	/**
	 * 객체를 CSV 형식으로 변환하는 메서드
	 * @param input 변환할 객체
	 * @returns 컬럼명과 데이터로 구성된 객체
	 */
	static stringify(input: Entity): { columnNames: string[]; data: string[] } {
		let columnNames: string[] = [];
		let data: string[] = [];

		Object.entries(input).forEach((entry) => {
			if (entry[0] !== "TABLE_NAME") {
				if (entry[1] instanceof Array) {
					console.log(entry[1], "is Array!");
				}
				columnNames.push(entry[0]);
				data.push(entry[1]);
			}
		});

		return {
			columnNames,
			data,
		};
	}
}
