import React, { PureComponent } from "react";
import {
    BarChart,
    Bar,
    Cell,
    ReferenceLine,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Graph = (props) => {
    return (
        <div style={{ width: "60%", height: 400, marginLeft: "auto", marginRight: "auto" }}>
            <ResponsiveContainer>
                <BarChart
                    height={300}
                    data={props.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} tick={<CustomizedAxisTick />} height={90} />
                    <YAxis />
                    <ReferenceLine y={1} stroke="red" />
                    <Tooltip />
                    <Bar dataKey="ratio" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

class CustomizedAxisTick extends PureComponent {
    render() {
        const { x, y, stroke, payload } = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
                    {payload.value}
                </text>
            </g>
        );
    }
}

export default Graph;