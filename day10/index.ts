import { readFileSync } from 'fs';
import path from 'path';

// Part 1

type Instruction = ['noop'] | ['addx', number];

class ClockCircuit {
	x = 1;
	instructions: Instruction[];
	current: { wait: number, instruction: Instruction; } | null = null;

	constructor(instructions: Instruction[]) {
		this.instructions = instructions.slice();
	}

	tick() {
		if (this.current?.wait === 0) {
			this.executeInstruction();
		}

		if (this.current === null) {
			this.loadInstruction();
		}

		this.current!.wait -= 1;
	}

	loadInstruction() {
		const instruction = this.instructions.shift()!;
		switch (instruction[0]) {
			case 'addx':
				this.current = { instruction, wait: 2 };
				break;
			case 'noop':
				this.current = { instruction, wait: 1 };
				break;
		};
	}

	executeInstruction() {
		const [instruction, ...args] = this.current!.instruction;
		switch (instruction) {
			case 'addx':
				this.x += args[0]!;
				break;
			case 'noop':
				break;
		};

		this.current = null;
	}
}

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trimEnd().split('\n').map((line) => {
	const [instr, ...args] = line.split(' ');
	return [instr, ...args.map(Number)] as Instruction;
});

const circuit = new ClockCircuit(input);
let signalStrength = 0;

for (let i = 1; i <= 220; i++) {
	circuit.tick();

	if ((i - 20) % 40 === 0) {
		signalStrength += circuit.x * i;
	}
}

console.log(signalStrength);

// Part 2

const CRT_WIDTH = 40;

const circuit2 = new ClockCircuit(input);
let screenBuffer = '';

for (let i = 1; i <= 240; i++) {
	circuit2.tick();

	const drawCol = (i - 1) % CRT_WIDTH;
	if (Math.abs(drawCol - circuit2.x) < 2) {
		screenBuffer += '▓';
	} else {
		screenBuffer += '░';
	}

	if (i % CRT_WIDTH === 0) {
		screenBuffer += '\n';
	}
}

console.log(screenBuffer.trimEnd());
