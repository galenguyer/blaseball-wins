import React from "react";
import { render } from "@testing-library/react";
import Team from "./Team";

test("test zero ratio", () => {
    const { getByText } = render(<Team name={"test team"} wins={2} realWins={2} />);
    const ratio = getByText(/ratio 1/i);
    expect(ratio).toBeInTheDocument();
});

test("test zero diff", () => {
    const { getByText } = render(<Team name={"test team"} wins={2} realWins={2} />);
    const diff = getByText(/diff 0/i);
    expect(diff).toBeInTheDocument();
});

test("test 2:1 ratio", () => {
    const { getByText } = render(<Team name={"test team"} wins={4} realWins={2} />);
    const ratio = getByText(/ratio 2/i);
    expect(ratio).toBeInTheDocument();
});

test("test two diff", () => {
    const { getByText } = render(<Team name={"test team"} wins={4} realWins={2} />);
    const diff = getByText(/diff 2/i);
    expect(diff).toBeInTheDocument();
});

test("test 3:2 ratio", () => {
    const { getByText } = render(<Team name={"test team"} wins={3} realWins={2} />);
    const ratio = getByText(/ratio 1.5/i);
    expect(ratio).toBeInTheDocument();
});

test("test one diff", () => {
    const { getByText } = render(<Team name={"test team"} wins={3} realWins={2} />);
    const diff = getByText(/diff 1/i);
    expect(diff).toBeInTheDocument();
});

test("test 1:3 ratio", () => {
    const { getByText } = render(<Team name={"test team"} wins={1} realWins={3} />);
    const ratio = getByText(/ratio 0.33/i);
    expect(ratio).toBeInTheDocument();
});

test("test two diff in 1:3 ratio", () => {
    const { getByText } = render(<Team name={"test team"} wins={1} realWins={3} />);
    const diff = getByText(/diff -2/i);
    expect(diff).toBeInTheDocument();
});
