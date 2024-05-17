export const directionToNumber : { [key: string]: number; } = {
    "N": 0,
    "E": 1,
    "S": 2,
    "W": 3,
}
export const numberToDirection : { [key: number]: string; } = {
    0: "N",
    1: "E",
    2: "S",
    3: "W",
}
export const MOVE_CHAR = "M";
export const VALID_REGEX = /^[LMRNSEW1-9\s]*$/