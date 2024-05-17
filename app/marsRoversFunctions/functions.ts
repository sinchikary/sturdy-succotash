import { MOVE_CHAR, VALID_REGEX, directionToNumber, numberToDirection } from "./constants";
import { TupleSet } from "./tupleSet";

export const splitNumbers = (input : String) : number[] => {        
    return input.split(" ").map(coordinate => Number(coordinate)).filter(value => !isNaN(value));;
}

export const readInput = (input : string) : string[] => {
    return cleanDuplicatedLines(input).split("\n").filter( line => line.length != 0);
}
export const calculateRoversWithCollision = (inputLines : string[]) : string[] => {
    let output : string[] = [];
    let coordinates = []
    let usedCoordinates = new TupleSet();
    console.log("COORDINATES:   "+ usedCoordinates);
    const maxCoordinates = splitNumbers(inputLines[0]);
    if (maxCoordinates.length < 2) {
        throw new Error("INSUFFICIENT DATA TO BUILD EXPLORALBE ZONE")
    }
    for (let index = 1; index < inputLines.length; index = index + 2) {
        coordinates = readCoordinates(inputLines[index])
        if (!isStartValid(coordinates[0], coordinates[1], maxCoordinates[0], maxCoordinates[1])) {
            output.push("SKIPPED ROVER, INVALID STARTING POSITION");
            continue;
        }
        output.push(readInstructionsWithCollisions(coordinates[0], coordinates[1], maxCoordinates[0], maxCoordinates[1], coordinates[2], inputLines[index + 1], usedCoordinates).join(' '))
    }
    return output;
}


export const calculateROvers = (inputLines : string[]) :string[] => {
    let output = [];
    let coordinates = []
    const maxCoordinates = splitNumbers(inputLines[0]);
    if (maxCoordinates.length < 2) {
        throw new Error("INSUFFICIENT DATA TO BUILD EXPLORALBE ZONE")
    }
    for (let index = 1; index < inputLines.length; index = index + 2) {
        coordinates = readCoordinates(inputLines[index])
        if (!isStartValid(coordinates[0], coordinates[1], maxCoordinates[0], maxCoordinates[1])) {
            output.push("SKIPPED ROVER, INVALID STARTING POSITION\n");
            continue;
        }
        output.push(readInstructions(coordinates[0], coordinates[1], maxCoordinates[0], maxCoordinates[1], coordinates[2], inputLines[index + 1]).join(' '))
    }
    return output;
}

export const checkIfInputIsValid = (input : string) => {
    return VALID_REGEX.test(input.trim())
}

const readCoordinates = (input : string) : number[] => {
    const coordinates = input.split(" ");
    return [Number(coordinates[0]), Number(coordinates[1]), directionToNumber[coordinates[2]]]
};

const readInstructions = (startX : number, startY : number, maxX : number, maxY : number, startingHeading : number, input : string) : (string | number)[] => {    
    const instructions = input.split(MOVE_CHAR)
    let movements = instructions.length - 1;
    let xCoordinate = startX;
    let yCoordinate = startY;
    let currentDirection = startingHeading;
    instructions.forEach( instructionLine => {
        if (movements == 0) {
            return;
        } else {
            movements--;
        }
        currentDirection = rotate(currentDirection, instructionLine)
        
        switch (currentDirection) {
            case 0:
                if (isInsideLimit(yCoordinate, maxY)) {
                    yCoordinate++;
                }
                break;
            case 1:
                if (isInsideLimit(xCoordinate, maxX)) {
                    xCoordinate++;
                }
                break;
            case 2:
                if (isInsideLimit(0, yCoordinate)) {
                    yCoordinate--;
                }
                break;
            case 3:
                if (isInsideLimit(0, xCoordinate)) {
                    xCoordinate--;
                }
                break;
            default:
                break;
        }
    })
    return [xCoordinate, yCoordinate, numberToDirection[currentDirection], "\n"]
};

const readInstructionsWithCollisions = (
    startX : number,
    startY : number,
    maxX : number,
    maxY : number,
    startingDirection : number,
    input : string,
    usedCoordinates : TupleSet) : (string | number)[] => {

    const instructions = input.split(MOVE_CHAR)
    let movements = instructions.length - 1;
    let xCoordinate = startX;
    let yCoordinate = startY;
    let currentDirection = startingDirection;   

    if (!usedCoordinates.has([startX, startY])) {
        usedCoordinates.add([startX, startY]);
    } else {
        return ["SKIPPED ROBOT, INVALID START"];
        //[startX,startY] = findAvailableCoordinate(startX, startY, maxX, maxY, usedCoordinates);
    }
    instructions.forEach( instructionLine => {
        if (movements == 0) {
            return;
        } else {
            movements--;
        }
        currentDirection = rotate(currentDirection, instructionLine)
        console.log(advanceForward(xCoordinate, yCoordinate, maxX, maxY, currentDirection, usedCoordinates));
        switch (currentDirection) {
            case 0:
                yCoordinate += advanceForward(xCoordinate, yCoordinate, maxX, maxY, currentDirection, usedCoordinates);
                break;
            case 1:
                xCoordinate += advanceForward(xCoordinate, yCoordinate, maxX, maxY, currentDirection, usedCoordinates);
                break;
            case 2:
                yCoordinate += advanceForward(xCoordinate, yCoordinate, maxX, maxY, currentDirection, usedCoordinates);
                break;
            case 3:
                xCoordinate += advanceForward(xCoordinate, yCoordinate, maxX, maxY, currentDirection, usedCoordinates);
                break;
            default:
                break;
        }
    })
    return [xCoordinate, yCoordinate, numberToDirection[currentDirection], "\n"]
};

const rotate = (direction: number, input : string) => {
    if (input.length == 0) {
        return direction;
    }
    const leftTurns = countOccurrences(input, "L")
    if (input.length == 1 && leftTurns == 1) {
        return (direction + 3) % 4
    }
    if (input.length == 1 && leftTurns == 0)  {
        return (direction + 1) % 4
    }
    if (leftTurns == input.length) {
        return direction;
    }
    if (leftTurns < input.length) {
        return (direction + (input.length - leftTurns)) % 4;
    }
    return  (direction + (leftTurns * 3 + input.length)) % 4;
    
};

const countOccurrences = (text: string, letter: string): number => {
    return text.split(letter).length - 1;
}
const isInsideLimit = (coordinate : number, limit : number) => {
    return (coordinate < limit);
}

const move = (currentDirection : number, yCoordinate:number, xCoordinate:number, maxX:number, maxY:number) : number => {
    switch (currentDirection) {
        case 0:
            if (isInsideLimit(yCoordinate, maxY)) {
                return 1;
            }
            break;
        case 1:
            if (isInsideLimit(xCoordinate, maxX)) {
                return 1;
            }
            break;
        case 2:
            if (isInsideLimit(0, yCoordinate)) {
                return -1;
            }
            break;
        case 3:
            if (isInsideLimit(0, xCoordinate)) {
                return -1;
            }
            break;
        default:
            return 0;
    }
    return 0;
}

const advanceForward = (startX : number, startY : number, maxX : number, maxY : number, startingDirection : number, usedCoordinates : TupleSet) : number=> {
    const movement = move(startingDirection, startY, startX, maxX, maxY)
    switch (startingDirection) {
        case 0:
            if(!usedCoordinates.has([startX, startY + movement])){
                usedCoordinates.add([startX, startY + movement]);
                usedCoordinates.delete([startX, startY]);
                return movement;
            }
            break;
        case 1:
            if(!usedCoordinates.has([startX + movement, startY])){
                usedCoordinates.add([startX + movement, startY]);
                usedCoordinates.delete([startX, startY]);
                return movement;
            }
            break;
        case 2:
            if(!usedCoordinates.has([startX, startY + movement])){
                usedCoordinates.add([startX, startY + movement]);
                usedCoordinates.delete([startX, startY]);
                return movement;
            }
            break;
        case 3:
            if(!usedCoordinates.has([startX + movement, startY])){
                usedCoordinates.add([startX + movement, startY]);
                usedCoordinates.delete([startX, startY]);
                return movement;
            }
            break;
        default:
            return movement;
        }
    return movement;
}

// mejor algoritmo seria bfs, seria un cambio a mejorar
const findAvailableCoordinate = (startX: number, startY : number, maxX:number, maxY:number, usedCoordinates : TupleSet) => {
    if (usedCoordinates.has([startX, startY])) {
        for (let x = 0; x < maxX; x++) {
            for (let y = 0; y < maxY; y++) {
                if (usedCoordinates.has([x,y])) {
                    return [x,y]
                }
            }    
        }
    }
    return [-1,-1]
}

const isStartValid = (startX:number, startY:number, maxX:number, maxY:number) => {
    return (startX <= maxX && startY <= maxY);
}
const cleanDuplicatedLines = (input : string) : string => {
    return  input.replace(/\n{2,}/g, '\n');
};