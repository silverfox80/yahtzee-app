// ScoreSheet.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScoreSheet from './ScoreSheet';

describe('ScoreSheet', () => {
  const mockConfirmedScore = new Map(); // initially empty
  const mockScoreArray = new Map([['Aces', 3]]); // mock proposed score
  const mockOnChangeScore = jest.fn();

  it('renders a score cell and handles click', () => {
    render(
      <ScoreSheet
        confirmedScoreArray={mockConfirmedScore}
        scoreArray={mockScoreArray}
        onChangeScore={mockOnChangeScore}
        lockScore={false}
      />
    );

    // Check that the "Aces" score cell is rendered with proposed score 3
    const acesCell = screen.getByText('3');
    expect(acesCell).toBeInTheDocument();

    // Simulate a click on it
    fireEvent.click(acesCell);

    // Expect the callback to have been called
    expect(mockOnChangeScore).toHaveBeenCalled();
  });

  it('does not allow clicking when lockScore is true', () => {
    render(
      <ScoreSheet
        confirmedScoreArray={mockConfirmedScore}
        scoreArray={mockScoreArray}
        onChangeScore={mockOnChangeScore}
        lockScore={true}
      />
    );

    const acesCell = screen.getByText('3');
    fireEvent.click(acesCell);

    expect(mockOnChangeScore).not.toHaveBeenCalled();
  });
});

describe('ScoreSheet integration', () => {
  it('allows user to select scores and updates totals', () => {
    const mockOnChangeScore = jest.fn();

    // Provide initial proposed scores
    const proposedScores = new Map([
      ['Aces', 3],
      ['Twos', 6],
      ['Threes', 9],
      ['Fours', 12],
      ['Fives', 15],
      ['Sixes', 18],
      ['ThreeOfAKind', 25],
      ['FourOfAKind', 30],
      ['FullHouse', 25],
      ['SmStraight', 30],
      ['LgStraight', 40],
      ['Yahtzee', 50],
      ['Chance', 22],
    ]);

    // Empty confirmed scores to start
    const confirmedScores = new Map();

    render(
      <ScoreSheet
        scoreArray={proposedScores}
        confirmedScoreArray={confirmedScores}
        onChangeScore={mockOnChangeScore}
        lockScore={false}
      />
    );

    // Click a few score cells to confirm them
    fireEvent.click(screen.getByText('3'));  // Aces
    fireEvent.click(screen.getByText('6'));  // Twos
    fireEvent.click(screen.getByText('9'));  // Threes
    fireEvent.click(screen.getByText('40')); // LgStraight
    fireEvent.click(screen.getByText('50')); // Yahtzee

    // `onChangeScore` should have been called multiple times
    expect(mockOnChangeScore).toHaveBeenCalled();

    // Check updated totals rendered on screen
    const upperNoBonus = 3 + 6 + 9; // 18
    const bonus = 0;                // not enough for bonus
    const upper = 18 + 0;
    const lower = 90;

    expect(screen.getByText(upperNoBonus.toString())).toBeInTheDocument();
    expect(screen.getByText(upper.toString())).toBeInTheDocument();

  });
});
