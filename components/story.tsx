import React, { Dispatch, SetStateAction } from "react";

function Story({
  totalStorys,
  story,
  elevatorStory,
  pressedButtons,
  setPressedButtons,
  isGoingUp,
  setIsGoingUp,
  residuals,
  setResiduals,
}: {
  totalStorys: number;
  story: number;
  elevatorStory: number;
  pressedButtons: number[];
  setPressedButtons: Dispatch<SetStateAction<number[]>>;
  isGoingUp?: boolean;
  setIsGoingUp: Dispatch<SetStateAction<boolean | undefined>>;
  residuals: number[];
  setResiduals: Dispatch<SetStateAction<number[]>>;
}) {
  const createButtonArrays = () => {
    const storyArray = [];
    for (let i = totalStorys; i > 0; i--) {
      storyArray.push(i - 1);
    }
    return storyArray;
  };

  const handleNrButtonPressed = (pressedNumber: number) => {
    //Standaard case
    //remove duplicates en sort ascending
    const buttonsPressedNoDupes = [...pressedButtons, pressedNumber].filter(
      (item, pos) => {
        return [...pressedButtons, pressedNumber].indexOf(item) == pos;
      }
    );
    setPressedButtons(buttonsPressedNoDupes.sort());

    //Edge cases:
    //stel je zit op verdieping 4 en je wil naar beneden maar klikt [3,5,1], dan wordt 5 in residuals gezet
    //zelfde geldt omgekeerd: ik zit op 4 maar wil naar boven en klik [3,5,1] dan wordt 1 en 3 in residuals gezet

    //Case 1:
    //gedrukte nummers: [1,2,4], huidige verdieping: 3 en button naar beneden is gedrukt
    //buttonsPressedNoDupes is sorted dus om het grootste getal naar residual te krijgen, pop() het laatste element
    if (
      buttonsPressedNoDupes[buttonsPressedNoDupes.length - 1] > elevatorStory &&
      !isGoingUp
    ) {
      const newResidual = buttonsPressedNoDupes.pop();
      if (!newResidual && newResidual !== 0) return;
      //sort residuals omdat de lift van beneden naar boven gaat als we de residuals afwerken
      setResiduals([...residuals, newResidual].sort());
    }
    //Case 2:
    //gedrukte nummers: [1,2,4], huidige verdieping: 3 en button naar boven is gedrukt
    //buttonsPressedNoDupes is sorted dus om het kleinste getal naar residual te krijgen, shift() ipv pop()
    else if (buttonsPressedNoDupes[0] < elevatorStory && isGoingUp) {
      const newResidual = buttonsPressedNoDupes.shift();
      if (!newResidual && newResidual !== 0) return;

      //sort en reverse omdat de richting van de lift van boven naar beneden gaat als we de residuals gaan afwerken
      setResiduals([...residuals, newResidual].sort().reverse());
    }
    setPressedButtons(buttonsPressedNoDupes.sort());
  };

  return (
    <div className="flex grid-cols-3">
      <div className="flex flex-col justify-center gap-y-2 mr-2">
        {story !== totalStorys - 1 && (
          <button
            className={`text-black rounded-lg w-6 cursor-pointer ${
              isGoingUp && isGoingUp !== undefined
                ? "bg-emerald-400"
                : "bg-gray-400"
            }`}
            onClick={() => setIsGoingUp(true)}
          >
            ↑
          </button>
        )}

        {story !== 0 && (
          <button
            className={`text-black rounded-lg w-6 cursor-pointer ${
              !isGoingUp && isGoingUp !== undefined
                ? "bg-emerald-400"
                : "bg-gray-400"
            }`}
            onClick={() => setIsGoingUp(false)}
          >
            ↓
          </button>
        )}
      </div>
      <div
        className={`h-36 w-32 border-2 my-1 rounded-2xl ${
          story === elevatorStory ? "border-emerald-500" : "border-white"
        }`}
      >
        <div className="flex justify-center">
          <span
            className={`flex justify-center rounded-full w-10 mt-2 text-lg ${
              story === elevatorStory
                ? "bg-emerald-400 text-gray-800"
                : "bg-gray-400 text-gray-800"
            }`}
          >
            {story}
          </span>
        </div>

        <div>
          {story === elevatorStory && (
            <span className="flex flex-col items-end mr-1">
              {createButtonArrays().map((story, i) => {
                return (
                  <button
                    className={`text-gray-800 bg-gray-200 w-4 rounded-full cursor-pointer text-xs ${
                      pressedButtons.includes(story) ||
                      residuals.includes(story)
                        ? "bg-emerald-400"
                        : "bg-gray-200"
                    }`}
                    key={i}
                    value={story}
                    onClick={(e) =>
                      handleNrButtonPressed(
                        Number((e.target as HTMLInputElement).value)
                      )
                    }
                  >
                    {story}
                  </button>
                );
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Story;
