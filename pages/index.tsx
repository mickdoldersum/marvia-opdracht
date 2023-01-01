import { useEffect, useState } from "react";
import Story from "../components/story";

export default function Home() {
  const TOTAL_STORYS = 6;
  const ELEVATOR_INTERVAL_MS = 3000;

  const [elevatorStory, setElevatorStory] = useState(0);
  const [pressedButtons, setPressedButtons] = useState<number[]>([]);
  const [isGoingUp, setIsGoingUp] = useState<boolean | undefined>();
  const [residuals, setResiduals] = useState<number[]>([]);

  const createStoryArray = () => {
    const storyArray = [];
    for (let i = TOTAL_STORYS; i > 0; i--) {
      storyArray.push(i - 1);
    }
    return storyArray;
  };

  useEffect(() => {
    if (!isGoingUp) pressedButtons.reverse();
    console.log("pressedButton: ", pressedButtons);
    console.log("residual: ", residuals);

    //de lift werkt eerste de pressedbuttons af en daarna de residuals
    //residuals zijn nummers die niet direct op de route van de lift liggen
    //voorbeeld: ik druk [2,1,4,5] en ik zit op verdieping 3 en ik wil naar boven. [2,1] zijn dan residuals
    const elevatorInterval = setInterval(() => {
      const nextStory = pressedButtons.shift();

      if (residuals.length > 0 && pressedButtons.length === 0) {
        isGoingUp
          ? setPressedButtons(residuals.reverse())
          : setPressedButtons(residuals);
        setResiduals([]);
        setIsGoingUp(!isGoingUp);
      }

      if (!nextStory && nextStory !== 0) return;

      setElevatorStory(nextStory);

      if (pressedButtons.length === 0 && residuals.length === 0)
        return setIsGoingUp(undefined);
    }, ELEVATOR_INTERVAL_MS);

    return () => clearInterval(elevatorInterval);
  }, [isGoingUp, pressedButtons, residuals]);

  return (
    <div className="flex justify-center items-start h-full min-h-screen bg-gray-800 py-4">
      <div className="flex flex-col mt-10">
        {createStoryArray().map((story: number, i) => {
          return (
            <Story
              key={i}
              totalStorys={TOTAL_STORYS}
              story={story}
              elevatorStory={elevatorStory}
              pressedButtons={pressedButtons}
              setPressedButtons={setPressedButtons}
              isGoingUp={isGoingUp}
              setIsGoingUp={setIsGoingUp}
              residuals={residuals}
              setResiduals={setResiduals}
            />
          );
        })}
      </div>
    </div>
  );
}
