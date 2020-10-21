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
    var teams = [];
    result.value.games.schedule.map((game) => {
        teams.push({
            id: game.awayTeam,
            name: game.awayTeamNickname,
            wins: result.value.games.standings.wins[game.awayTeam],
            realWins: day - result.value.games.standings.losses[game.awayTeam],
        });
        teams.push({
            id: game.homeTeam,
            name: game.homeTeamNickname,
            wins: result.value.games.standings.wins[game.homeTeam],
            realWins: day - result.value.games.standings.losses[game.homeTeam],
        });
    });

    teams.sort(function (a, b) {
        return b.wins - b.realWins - (a.wins - a.realWins);
    });

    return (
        <div className="App">
            {teams.map((team) => (
                <Team name={team.name} wins={team.wins} realWins={team.realWins} />
            ))}
        </div>
    );
}

export default App;
