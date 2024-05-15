// separamos el input

import { Console } from "console";
import { parse } from "path";

const directions : { [key: string]: number; } = {
    "N": 0,
    "E": 1,
    "S": 2,
    "W": 3,
}
const directionsv2 : { [key: number]: string; } = {
    0 : "N",
    1 :"E",
    2:"S",
    3:"W",
}

var tablero = 2;

export const separateInput = (input : String) => {
    return input.split("\n");
}

export const splitNumbers = (input : String) => {
    return input.split(" ").map(coordinate => Number(coordinate));
}

export const readInput = (input : String) => {
    return input.split("\n");
}

export const addValueToTablero = (input : number) => {
    tablero += input;
    console.log(tablero);
}

/**
3 3 E
MMRMMRMRRM
 */
export const calculateROvers = (inputLines : string[], maxY : number, maxX : number) => {
    let output = [];
    let coordinates = []
    console.log("inputlines  " + inputLines);
    const maxCoordinates = splitNumbers(inputLines[0]);
    for (let index = 1; index < inputLines.length; index = index + 2) {
        coordinates = readCoordinates(inputLines[index])
        console.log("coordinates:  "+ coordinates);
        output.push(readInstructions(coordinates[0], coordinates[1], maxCoordinates[0], maxCoordinates[1], coordinates[2], inputLines[index + 1]))
    }
    return output;
}

const readCoordinates = (input : string) => {
    const coordinates = input.split(" ");
    return [Number(coordinates[0]), Number(coordinates[1]), directions[coordinates[2]]]
};

const readInstructions = (startX : number, startY : number, maxX : number, maxY : number, startingHeading : number, input : string) => {    
    const instructions = input.split("M")
    let movements = instructions.length - 1;
    let xCoordinate = startX;
    let yCoordinate = startY;
    let newHeadingValue = startingHeading;
    console.log("instructions:  " + instructions);
    console.log("instructions:  " + instructions.length);
    
    instructions.forEach( instructionLine => {
        newHeadingValue = rotate(newHeadingValue, instructionLine)
        console.log("STARTING ROTATIONS: " + newHeadingValue);
        console.log("STARTING moves: " + movements);
        if (movements == 0) {
            return;
        } else {
            movements--;
        }
        switch (newHeadingValue) {
            case 0:
                yCoordinate++;
                break;
            case 1:
                xCoordinate++;
                break;
            case 2:
                yCoordinate--;
                break;
            case 3:
                xCoordinate--;
                break;
            default:
                break;
        }
    })
    return [xCoordinate, yCoordinate, newHeadingValue]
};

const rotate = (startingHeading: number, input : string) => {
    if (input.length == 0) {
        return startingHeading;
    }
    const leftTurns = countOccurrences(input, "L")
    if (input.length == 1 && leftTurns == 1) {
        return (startingHeading + 3) % 4
    }
    if (input.length == 1 && leftTurns == 0)  {
        return (startingHeading + 1) % 4
    }
    if (leftTurns == input.length) {
        return startingHeading;
    }
    if (leftTurns < input.length) {
        return (startingHeading + (input.length - leftTurns)) % 4;
    }
    return  (startingHeading + (leftTurns * 3 + input.length)) % 4;
    
};

function countOccurrences(text: string, letter: string): number {
    return text.split('').reduce((count, char) => char === letter ? count + 1 : count, 0);
}