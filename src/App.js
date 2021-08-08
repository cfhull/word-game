import logo from "./logo.svg";
import "./App.css";
import { calculateScore, generateWord } from "./api";
import React from "react";

const players = ["Player 1", "Player 2"];

function App() {
  const [baseWord, setBaseWord] = React.useState();

  const [submissions, setSubmissions] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const [results, setResults] = React.useState();

  React.useEffect(() => {
    generateWord().then(({ word }) => {
      setBaseWord(word);
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (player, inputWord) => {
      setSubmissions((prevSubmissions) => {
        const { [player]: value, ...rest } = prevSubmissions;
        return rest;
      });
      setErrors({ [player]: undefined });
      const { score, error } = await calculateScore({ baseWord, inputWord });
      score &&
        setSubmissions((prevSubmissions) => ({
          ...prevSubmissions,
          [player]: {
            score: Math.round(score * 1000),
          },
        }));
      error && setErrors((prevErrors) => ({ ...prevErrors, [player]: error }));
    },
    [submissions, baseWord]
  );

  React.useEffect(() => {
    if (Object.keys(submissions).length === players.length) {
      const winner = Object.keys(submissions).reduce((a, b) => {
        return submissions[a].score > submissions[b].score ? a : b;
      });

      setResults({
        winner,
        scores: submissions,
      });
    }
  }, [submissions]);

  return (
    <div className="App">
      <header className="App-header">
        <div>{baseWord}</div>
        {players.map((player) => (
          <Player
            label={player}
            error={errors[player]}
            handleSubmit={handleSubmit}
          />
        ))}
        {results && (
          <>
            <div>Winner: {results.winner}</div>
            {Object.entries(results.scores)
              .sort((a, b) => b[1].score - a[1].score)
              .map(([player, { score }]) => {
                return (
                  <div>
                    {player} : {score}
                  </div>
                );
              })}
          </>
        )}
      </header>
    </div>
  );
}

const Player = ({ label, error, handleSubmit }) => {
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {}, [inputValue]);

  return (
    <div>
      <label>
        {label}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
      </label>
      <button onClick={() => handleSubmit(label, inputValue)}>Calculate</button>
      {error}
    </div>
  );
};

export default App;
