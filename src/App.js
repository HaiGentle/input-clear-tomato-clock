import { useEffect, useRef, useState } from "react";
import "./styles.css";

const fomatTime = (second) => {
  const minuteString = `${Math.floor(second / 60)}`.padStart(2, "0");
  const secondString = `${second % 60}`.padStart(2, "0");
  return `${minuteString}:${secondString}`;
};

export default function App() {
  const [time, setTime] = useState({
    second: null,
    act: false, //false == pause and true == play
    stoped: false
  });
  const inputMinuteRef = useRef();
  const inputSecondRef = useRef();
  const timeRef = useRef(); //ref innerHTML
  const timeCurentRef = useRef(); //ref save current time

  useEffect(() => {
    let timeInterval,
      currentSecond = time.second;
    if (time.act && currentSecond > 0) {
      timeInterval = setInterval(() => {
        if (currentSecond > 0) {
          currentSecond -= 1;
          timeCurentRef.current = currentSecond;
          timeRef.current.innerHTML = fomatTime(currentSecond);
        } else {
          setTime({ second: 0, act: false, stoped: false });
        }
      }, 1000);
    }

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [time.act]);

  const handlePlayPauseClick = () => {
    if (inputMinuteRef.current.value && inputSecondRef.current.value) {
      const initSecond =
        inputMinuteRef.current.value * 60 +
        parseInt(inputSecondRef.current.value, 10);
      const second = time.stoped
        ? initSecond
        : timeCurentRef.current || initSecond;
      setTime((prev) => ({ second: second, act: !prev.act, stoped: false }));
    }
  };

  const handleStopClick = () => {
    if (inputMinuteRef.current.value && inputSecondRef.current.value) {
      const initSecond =
        inputMinuteRef.current.value * 60 +
        parseInt(inputSecondRef.current.value, 10);

      timeRef.current.innerHTML = fomatTime(initSecond);
      setTime({
        second: initSecond,
        act: false,
        stoped: true
      });
    }
  };

  const handleClearClick = () => {
    inputMinuteRef.current.value = "";
    inputSecondRef.current.value = "";
    timeCurentRef.current = null;
    setTime({
      second: null,
      act: false,
      stoped: false
    });
  };

  return (
    <div className="App">
      <input
        className="input-minute"
        placeholder="Input Minute"
        ref={inputMinuteRef}
      />
      <input ref={inputSecondRef} placeholder="Input Second" />
      <h1 ref={timeRef}>{fomatTime(time.second)}</h1>
      {time.act ? (
        <button onClick={handlePlayPauseClick}>pause</button>
      ) : (
        <button onClick={handlePlayPauseClick}>play</button>
      )}
      <button disabled={time.second === null} onClick={handleStopClick}>
        stop
      </button>
      {time.stoped && <button onClick={handleClearClick}>Clear</button>}
    </div>
  );
}
