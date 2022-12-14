import { readFileSync } from 'fs';
import path from 'path';

// Part 1

type OperationFn = (old: number) => number;

class Monkey {
	static all = new Map<number, Monkey>();

	number: number;
	items: number[];
	operation: OperationFn;
	testModulus: number;
	trueTarget: number;
	falseTarget: number;
	numInspected = 0;

	constructor(input: string) {
		const lines = input.split('\n');

		this.number = Number(lines[0].match(/Monkey (\d+):/)![1]);
		this.items = lines[1].match(/Starting items: (\d+(, \d+)*)/)![1].split(', ').map(Number);

		// look ma, no eval()
		const [lhs, op, rhs] = lines[2].match(/Operation: new = (\w+) ([+*]) (\w+)/)!.slice(1);
		const operator = op === '+'
			? (a: number, b: number) => a + b
			: (a: number, b: number) => a * b;
		const parseOperand = (operand: string, old: number) =>
			operand === 'old' ? old : Number(operand);
		this.operation = (old: number) => operator(parseOperand(lhs, old), parseOperand(rhs, old));

		this.testModulus = Number(lines[3].match(/Test: divisible by (\d+)/)![1]);
		this.trueTarget = Number(lines[4].match(/If true: throw to monkey (\d+)/)![1]);
		this.falseTarget = Number(lines[5].match(/If false: throw to monkey (\d+)/)![1]);

		// This gross line exists to enable part 2
		(this.constructor as typeof Monkey).all.set(this.number, this);
	}

	takeTurn() {
		let items = this.items;
		this.numInspected += items.length;
		this.items = [];

		for (let worryLevel of items) {
			worryLevel = this.operation(worryLevel);
			worryLevel = Math.floor(worryLevel / 3);

			const throwTo = worryLevel % this.testModulus ? this.falseTarget : this.trueTarget;
			Monkey.all.get(throwTo)!.items.push(worryLevel);
		}
	}
}

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trimEnd().split('\n\n');

input.forEach((str: string) => new Monkey(str));

for (let i = 0; i < 20; i++) {
	for (const monkey of Monkey.all.values()) {
		monkey.takeTurn();
	}
}

const mostActive = Array.from(Monkey.all.values(), (monkey) => monkey.numInspected).sort((a, b) => b - a);
console.log(mostActive[0] * mostActive[1]);

// Part 2

// Honestly, I only barely understand how this works. I get why it doesn't affect
// the result of 'worryLevel % testModulus', but I can't grok why the result of the
// addition/multiplication operations are still valid.
const magicNumber = Array.from(Monkey.all.values(), (monkey) => monkey.testModulus).reduce((a, b) => a * b);

class Part2Monkey extends Monkey {
	static all = new Map<number, Part2Monkey>();

	takeTurn() {
		let items = this.items;
		this.numInspected += items.length;
		this.items = [];

		for (let worryLevel of items) {
			worryLevel = this.operation(worryLevel);

			const throwTo = worryLevel % this.testModulus ? this.falseTarget : this.trueTarget;
			Part2Monkey.all.get(throwTo)!.items.push(worryLevel % magicNumber);
		}
	}
}

input.forEach((str: string) => new Part2Monkey(str));

for (let i = 0; i < 10000; i++) {
	for (const monkey of Part2Monkey.all.values()) {
		monkey.takeTurn();
	}
}

const mostActive2 = Array.from(Part2Monkey.all.values(), (monkey) => monkey.numInspected).sort((a, b) => b - a);
console.log(mostActive2[0] * mostActive2[1]);
