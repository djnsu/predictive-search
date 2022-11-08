import { faker } from "@faker-js/faker";

export type RawData = { id: string; rfid: string; title: string };

export function createEntiry(...args: string[]): RawData {
  const title = `${args.join("")}${faker.datatype.number({ max: 999999 })}`;
  return {
    id: faker.datatype.uuid(),
    title: title,
    rfid: faker.datatype.string(),
  };
}

export function generateData(length: number) {
  const arr: RawData[] = [];

  Array.from({ length }).forEach(() => {
    const prefix1 = Math.random() > 0.5 ? "W3H" : "FA25K";
    const prefix2 = faker.lorem.word(5);
    const prefix3 = Math.random() > 0.5 ? "P1HP" : "ZX5K";
    const el = createEntiry(prefix1, prefix2, prefix3);

    arr.push(el);
  });

  return arr;
}
