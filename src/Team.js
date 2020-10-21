import React from "react";

const Team = (props) => {
    return (
        <div className="Team">
            {props.name} - {props.wins}:{props.realWins} (ratio {Math.floor((props.wins * 100) / props.realWins) / 100},
            diff {props.wins - props.realWins})
        </div>
    );
};

export default Team;
