/**
 * @class Card
 * @classdesc Card Object
 */
export class Card {
  value: number;
  seed: string;

  constructor(value: number, seed: string) {
    this.value = value;
    this.seed = seed;
  }
}
