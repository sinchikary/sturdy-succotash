"use client"

import { calculateROvers, calculateRoversWithCollision, checkIfInputIsValid, readInput } from "./marsRoversFunctions/functions";
import { ChangeEvent, useState } from "react";

const testInput = "5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM"


export default function Home() {
  const [inputLines, setInputLines] = useState<string>(testInput);
  const [results, setResults] = useState<(string)>("");
  const [isCollision, setIsCollision] = useState(false);

  const handleCheckboxChange = () => {
    setIsCollision(!isCollision);
};
  
  const updateInput = (e : ChangeEvent<HTMLTextAreaElement>) => {
     setInputLines(e.target.value);
  }
  
  const start = () => {
    if(checkIfInputIsValid(inputLines)) {
      if (isCollision) {
        setResults(calculateRoversWithCollision(readInput(inputLines)).join(""));
      } else {
        setResults(calculateROvers(readInput(inputLines)).join(""));
      }
    } else {
      setResults("THE INPUT IS INVALID, IT CONTAINS INVALID CHARACTERS");
    } 
    try {
      
    } catch (error) {
      console.log("AN ERROR HAS BEEN FOUND: " + error);
      setResults("An error occurred review the console");
    }
  }
  const reset = () => {
    setResults("");
    setInputLines(testInput);
  }
  
  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <small className="block font-Open-sans text-2xl font-semibold text-white-600 mb-2">INPUT:</small>
      <textarea onChange={updateInput} value={inputLines} className="bg-gray-300 w-[500px] h-[500px] w-full max-w-5xl p-2 text-black">
      </textarea>
      <div className="w-full items-left pt-5 pb-5">
        <button className="p-5 mr-5 bg-gray-500 text-white rounded hover:bg-gray-700 w-64" onClick={start}>
          Check results
        </button>
        <button className="p-5 bg-gray-500 text-white rounded hover:bg-gray-700 w-64" onClick={reset}>
          Reset
        </button>  
        <label>
          <input
              className="p-5 bg-gray-500 text-white rounded hover:bg-gray-700 w-32"
              type="checkbox"
              checked={isCollision}
              onChange={handleCheckboxChange}
          />
          Enable collision 
        </label>
      </div>      
      <small className="block font-Open-sans text-2xl font-semibold text-white-600 mb-2">RESULT:</small>
      <textarea disabled value={results} className="bg-gray-300 w-[500px] h-[500px] w-full max-w-5xl p-2 text-black">
      </textarea>
    </main>
  );
}
