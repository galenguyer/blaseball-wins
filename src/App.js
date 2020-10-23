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
                netWinsWhenWon: 0,
                netWinsWhenLoss: 0,
                grossWinsWhenWon: 0,
                grossWinsWhenLoss: 0,
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
                netWinsWhenWon: 0,
                netWinsWhenLoss: 0,
                grossWinsWhenWon: 0,
                grossWinsWhenLoss: 0,
            };
        }

        // always increment the effectiveDay
        teams[game.awayTeam].effectiveDay++;
        teams[game.homeTeam].effectiveDay++;

        game.outcomes.forEach((outcome) => {
            // Sun 2 active
            if (outcome.includes("Sun 2")) {
                // Sun 2 acted on Away team
                if (outcome.endsWith(game.awayTeamNickname)) {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) {
                        teams[game.awayTeam].netWinsWhenWon++;
                        teams[game.awayTeam].grossWinsWhenWon++;
                    }
                    // Away team Lost game
                    else {
                        teams[game.awayTeam].netWinsWhenLoss++;
                        teams[game.awayTeam].grossWinsWhenLoss++;
                    }
                }
                // Sun 2 acted on the Home team
                else {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) {
                        teams[game.homeTeam].netWinsWhenLoss++;
                        teams[game.homeTeam].grossWinsWhenLoss++;
                    }
                    // Away team Lost game
                    else {
                        teams[game.homeTeam].netWinsWhenWon++;
                        teams[game.homeTeam].grossWinsWhenWon++;
                    }
                }
            }
            // Black Hole active
            else if (outcome.includes("Black Hole")) {
                // Black Hole acted on Away team
                if (outcome.endsWith(game.awayTeamNickname + "!")) {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) teams[game.awayTeam].netWinsWhenWon--;
                    // Away team Lost game
                    else teams[game.awayTeam].netWinsWhenLoss--;
                }
                // Black Hole acted on the Home team
                else {
                    // Away team Won game
                    if (game.awayScore > game.homeScore) teams[game.homeTeam].netWinsWhenLoss--;
                    // Away team Lost game
                    else teams[game.homeTeam].netWinsWhenWon--;
                }
            }
        });

        if (game.awayScore > game.homeScore) {
            teams[game.awayTeam].realWins++;
            teams[game.awayTeam].netWinsWhenWon++;
            teams[game.awayTeam].grossWinsWhenWon++;
            teams[game.homeTeam].realLosses++;
        } else {
            teams[game.awayTeam].realLosses++;
            teams[game.homeTeam].realWins++;
            teams[game.homeTeam].netWinsWhenWon++;
            teams[game.homeTeam].grossWinsWhenWon++;
        }
    });

    // change teams into an array for sorting
    let netWinsPerWins = [];
    let grossWinsPerWins = [];
    let netWinsPerLoss = [];
    let grossWinsPerLoss = [];
    teamIdList.forEach((id) => {
        netWinsPerWins.push(teams[id]);
        grossWinsPerWins.push(teams[id]);
        netWinsPerLoss.push(teams[id]);
        grossWinsPerLoss.push(teams[id]);
    });

    netWinsPerWins.sort(function (a, b) {
        return b.netWinsWhenWon / b.realWins - a.netWinsWhenWon / a.realWins;
    });
    grossWinsPerWins.sort(function (a, b) {
        return b.grossWinsWhenWon / b.realWins - a.grossWinsWhenWon / a.realWins;
    });
    netWinsPerLoss.sort(function (a, b) {
        return b.netWinsWhenLoss / b.realLosses - a.netWinsWhenLoss / a.realLosses;
    });
    grossWinsPerLoss.sort(function (a, b) {
        return b.grossWinsWhenLoss / b.realLosses - a.grossWinsWhenLoss / a.realLosses;
    });

    const netWinsPerWinGraphData = netWinsPerWins.map((team) => {
        return {
            name: team.name,
            ratio: Math.floor((team.netWinsWhenWon * 100) / team.realWins) / 100,
        };
    });
    const grossWinsPerWinGraphData = grossWinsPerWins.map((team) => {
        return {
            name: team.name,
            ratio: Math.floor((team.grossWinsWhenWon * 100) / team.realWins) / 100,
        };
    });
    const netWinsPerLossGraphData = netWinsPerLoss.map((team) => {
        return {
            name: team.name,
            ratio: Math.floor((team.netWinsWhenLoss * 100) / team.realLosses) / 100,
        };
    });
    const grossWinsPerLossGraphData = grossWinsPerLoss.map((team) => {
        return {
            name: team.name,
            ratio: Math.floor((team.grossWinsWhenLoss * 100) / team.realLosses) / 100,
        };
    });

    return (
        <div className="App">
            <h1>Net Wins per Win (Day {day + 1})</h1>
            <p className="Comment">
                Shows how many Wins each team has recieved per game they won after removing wins taken by the Black Hole
            </p>
            <Graph data={netWinsPerWinGraphData} />
            <br />
            <div className="Team">Format: [Team Name] - [Wins]:[Real Wins]</div>
            <br />
            {netWinsPerWins.map((team) => (
                <Team name={team.fullName} wins={team.netWinsWhenWon} realWins={team.realWins} />
            ))}
            <br />
            <h1>Gross Wins per Win (Day {day + 1})</h1>
            <p className="Comment">
                Shows how many Wins each team has recieved per game they won without removing wins taken by the Black
                Hole
            </p>
            <Graph data={grossWinsPerWinGraphData} />
            <br />
            <div className="Team">Format: [Team Name] - [Wins]:[Real Wins]</div>
            <br />
            {grossWinsPerWins.map((team) => (
                <Team name={team.fullName} wins={team.grossWinsWhenWon} realWins={team.realWins} />
            ))}
            <br />
            <h1>Net Wins Per Loss (Day {day + 1})</h1>
            <p className="Comment">
                Shows how many Wins each team has recieved per game they lost after removing wins taken by the Black
                Hole
            </p>
            <Graph data={netWinsPerLossGraphData} />
            <div className="Team">Format: [Team Name] - [Wins]:[Real Loss]</div>
            <br />
            {netWinsPerLoss.map((team) => (
                <Team name={team.fullName} wins={team.netWinsWhenLoss} realWins={team.realLosses} />
            ))}
            <br />
            <h1>Gross Wins Per Loss (Day {day + 1})</h1>
            <p className="Comment">
                Shows how many Wins each team has recieved per game they lost without removing wins taken by the Black
                Hole
            </p>
            <Graph data={grossWinsPerLossGraphData} />
            <div className="Team">Format: [Team Name] - [Wins]:[Real Loss]</div>
            <br />
            {netWinsPerLoss.map((team) => (
                <Team name={team.fullName} wins={team.grossWinsWhenLoss} realWins={team.realLosses} />
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
