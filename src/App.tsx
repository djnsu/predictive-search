import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getNewFileHandle, writeFile } from "./fs-utils";
import { generateData, RawData } from "./mock-generated";
import { getGraph } from "./search-utils";

enum ArrayState {
  initial,
  generating,
  done,
  error,
}

function App() {
  const [arraySize, setArraySize] = useState(0);
  const [arrayState, setArrayState] = useState<ArrayState>(ArrayState.initial);
  const [array, setArray] = useState<Record<string, string>>();

  function status() {
    switch (arrayState) {
      case ArrayState.initial:
        return "input array size";
      case ArrayState.generating:
        return "array is generating";
      case ArrayState.error:
        return "error";
      case ArrayState.done:
        return "array generated";
    }
  }

  const generate = () => {
    const arr = generateData(arraySize);

    const normalizeObj = arr.reduce(
      (acc: Record<string, string>, { id, title }) => {
        acc[title] = id;
        return acc;
      },
      {}
    );

    setArray(normalizeObj);
    console.log("arr.length", arr.length);
    setArrayState(ArrayState.done);
  };

  const runSearch = () => {
    performance.mark("start");
    const graph = getGraph(array);
    console.log("graph", graph);
    performance.mark("end");
    performance.measure("measure from start to end", "start", "end");

    console.log(
      "duration",
      performance.getEntriesByName("measure from start to end")[0].duration
    );

    performance.clearMarks();
    performance.clearMeasures();
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="Padding">
          <span>{status()}</span>
          <input
            onChange={(event) => setArraySize(parseInt(event.target.value))}
          />
          <button
            onClick={() => {
              setArrayState(ArrayState.generating);
              setTimeout(() => generate(), 0);
            }}
          >
            generate array
          </button>
        </div>

        <button onClick={runSearch}>run predictive search</button>
        <div className="Padding">
          <button
            className="SaveButton"
            onClick={() => {
              async function go() {
                await writeFile(
                  await getNewFileHandle(),
                  JSON.stringify(array)
                );
              }

              go()
                .then(() => {
                  console.log("save successfull");
                })
                .catch((error) => {
                  console.error("generated error", error);
                });
            }}
          >
            Save array to txt
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
