import React from "react";
import useSWR from "swr";
import Team from "./Team";
import "./App.css";
import Graph from "./Graph";

const url = "https://blase.nyaa.gay/api/v1/latest/streamData";

function App() {
    const { data: latestStreamData, error: sdError } = useSWR(url);
    const { data: gameData, error: gError } = useSWR(
        () => "https://api.sibr.dev/chronicler/v1/games?season=" + latestStreamData.value.games.sim.season
    );

    if (sdError || gError)
        return (
            <div className="App">
                <h1>Wins per Win</h1>
                <h1>An error occurred</h1>
            </div>
        );
    if (!latestStreamData || !gameData)
        return (
            <div className="App">
                <h1>Wins per Win</h1>
                <h1>Loading latest data...</h1>
            </div>
        );
    const day = latestStreamData.value.games.sim.day;

    // only add games up to the current day
    let playedGames = [];
    gameData.data.map((game) => {
        if (game.endTime != null) playedGames.push(game.data);
    });

    var teams = {};
    var teamIdList = [];
    // eslint-disable-next-line
    playedGames.map((game) => {
        // add the Away team to the Teams list if not already there
        if (teams[game.awayTeam] == null) {
            teamIdList.push(game.awayTeam);
            teams[game.awayTeam] = {
                id: game.awayTeam,
                name: game.awayTeamNickname,
                fullName: game.awayTeamName,
                effectiveDay: 0,
                realWins: 0,
                realLosses: 0,
                winsWhenWon: 0,
                winsWhenLoss: 0,
            };
        }
        // add the Home team to the Teams list if not already there
        if (teams[game.homeTeam] == null) {
            teamIdList.push(game.homeTeam);
            teams[game.homeTeam] = {
                id: game.homeTeam,
                name: game.homeTeamNickname,
                fullName: game.homeTeamName,
                effectiveDay: 0,
                realWins: 0,
                realLosses: 0,
                winsWhenWon: 0,
                winsWhenLoss: 0,
            };
        }

        // always increment the effectiveDay
        teams[game.awayTeam].effectiveDay++;
        teams[game.homeTeam].effectiveDay++;

        game.outcomes.forEach((outcome) => {
            // Sun 2 active
            if (game.weather == 1) {
                // Sun 2 acted on Away team
                if (outcome.endsWith(game.awayTeamNickname)) {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) teams[game.awayTeam].winsWhenWon++;
                    // Away team Lost game
                    else teams[game.awayTeam].winsWhenLoss++;
                }
                // Sun 2 acted on the Home team
                else {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) teams[game.homeTeam].winsWhenLoss++;
                    // Away team Lost game
                    else teams[game.homeTeam].winsWhenWon++;
                }
            }
            // Black Hole active
            else if (game.weather == 14) {
                // Black Hole acted on Away team
                if (outcome.endsWith(game.awayTeamNickname + "!")) {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) teams[game.awayTeam].winsWhenWon--;
                    // Away team Lost game
                    else teams[game.awayTeam].winsWhenLoss--;
                }
                // Black Hole acted on the Home team
                else {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) teams[game.homeTeam].winsWhenLoss--;
                    // Away team Lost game
                    else teams[game.homeTeam].winsWhenWon--;
                }
            }
        });

        if (game.awayScore > game.homeScore) {
            teams[game.awayTeam].realWins++;
            teams[game.awayTeam].winsWhenWon++;
            teams[game.awayTeam].netWins++;
            teams[game.homeTeam].realLosses++;
        } else {
            teams[game.awayTeam].realLosses++;
            teams[game.homeTeam].realWins++;
            teams[game.homeTeam].winsWhenWon++;
            teams[game.homeTeam].netWins++;
        }
    });

    let teamList = [];
    teamIdList.forEach((id) => {
        teamList.push(teams[id]);
    });

    teamList.sort(function (a, b) {
        return (b.winsWhenLoss + b.winsWhenWon) / b.realWins - (a.winsWhenLoss + a.winsWhenWon) / a.realWins;
    });

    console.log(teamList);

    const data = teamList.map((team) => {
        return {
            name: team.name,
            ratio: Math.floor(((team.winsWhenLoss + team.winsWhenWon) * 100) / team.realWins) / 100,
        };
    });

    return (
        <div className="App">
            <h1>Wins per Win (Day {day})</h1>
            <Graph data={data} />
            <br />
            <div className="Team">Format: [Team Name] - [Wins]:[Real Wins]</div>
            <br />
            {teamList.map((team) => (
                <Team name={team.fullName} wins={team.winsWhenLoss + team.winsWhenWon} realWins={team.realWins} />
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
