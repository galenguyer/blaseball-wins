import React from "react";
import useSWR from "swr";
import logo from "./logo.svg";
import Team from "./Team";
import "./App.css";
import Graph from "./Graph";

const url = "https://blase.nyaa.gay/api/v1/latest/streamData";

function App() {
    const { data: result, error } = useSWR(url);

    if (error)
        return (
            <div className="App">
                <h1>Wins per Win</h1>
                <h1>An error occurred</h1>
            </div>
        );
    if (!result)
        return (
            <div className="App">
                <h1>Wins per Win</h1>
                <h1>Loading latest data...</h1>
            </div>
        );

    const day = result.value.games.sim.day + 1;
    var teams = [];
    result.value.games.schedule.map((game) => {
        teams.push({
            id: game.awayTeam,
            name: game.awayTeamNickname,
            fullName: game.awayTeamName,
            wins: result.value.games.standings.wins[game.awayTeam],
            realWins: day - result.value.games.standings.losses[game.awayTeam],
        });
        teams.push({
            id: game.homeTeam,
            name: game.homeTeamNickname,
            fullName: game.homeTeamName,
            wins: result.value.games.standings.wins[game.homeTeam],
            realWins: day - result.value.games.standings.losses[game.homeTeam],
        });
    });

    teams.sort(function (a, b) {
        return b.wins / b.realWins - a.wins / a.realWins;
    });

    const data = teams.map((team) => {
        return {
            name: team.name,
            ratio: Math.floor((team.wins * 100) / team.realWins) / 100,
        };
    });

    return (
        <div className="App">
            <h1>Wins per Win (Day {day})</h1>
            <Graph data={data} />
            <br />
            <div className="Team">Format: [Team Name] - [Wins]:[Real Wins]</div>
            <br />
            {teams.map((team) => (
                <Team name={team.fullName} wins={team.wins} realWins={team.realWins} />
            ))}
            <br />
            <div className="Comment" style={{ marginBottom: "1rem" }}>
                Created by MasterChief_John-117#1911 &nbsp;|&nbsp; Source available on{" "}
                <a href="https://github.com/galenguyer/blaseball-wins">github!</a>
            </div>
        </div>
    );
}

export default App;
