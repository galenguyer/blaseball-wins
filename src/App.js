import React from "react";
import useSWR from "swr";
import logo from "./logo.svg";
import Team from "./Team";
import "./App.css";

const url = "https://blase.nyaa.gay/api/v1/latest/streamData";

function App() {
    const { data: result, error } = useSWR(url);

    if (error) return <h1>An error occurred</h1>;
    if (!result) return <h1>Loading...</h1>;

    const day = result.value.games.sim.day;

    return (
        <div className="App">
            {result.value.games.schedule.map((game) => (
                <>
                    <Team
                        name={game.awayTeamNickname}
                        id={game.awayTeam}
                        standings={result.value.games.standings}
                        day={day}
                    />
                    <Team
                        name={game.homeTeamNickname}
                        id={game.homeTeam}
                        standings={result.value.games.standings}
                        day={day}
                    />
                </>
            ))}
        </div>
    );
}

export default App;
