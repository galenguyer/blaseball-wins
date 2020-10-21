import React from "react";

const Team = (props) => {
    const realWins = props.day - props.standings.losses[props.id];
    const wins = props.standings.wins[props.id];
    return (
        <div class="Team">
            {props.name} - {wins}:{realWins}
        </div>
    );
};

export default Team;
