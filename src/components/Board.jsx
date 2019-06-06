import React, { Component } from 'react'
import Square from './Square'
import uuid from 'uuid'

const clearBoth = {
  clear: 'both',
}

const PLAYER_ONE = 'Player One';
const PLAYER_TWO = 'Player Two'

export class Board extends Component {
  state = {
    squares: [],
    currentLetter: 'S',
    currentPlayer: PLAYER_ONE,
    playerOneScore: 0,
    playerTwoScore: 0,
    result: ''
  }
  

  componentWillMount = () => {
    const { rowNumber, columnNumber } = this.props;

    const squareData = {
      value: '',
      isClicked: false,
      highlighted: false
    }

    const squares = [...Array(rowNumber)].map(row => Array(columnNumber).fill().map(u => ({...squareData})));
    this.setState({ squares });
  }

  handleSquareClick = (rowIndex, columnIndex) => {
    const { squares, currentLetter } = this.state; 

    squares[rowIndex][columnIndex].value = currentLetter;
    squares[rowIndex][columnIndex].isClicked = true;

    let newState = {};
    const scores = this.checkForScore(rowIndex, columnIndex);
    const result = this.checkForResult(squares, scores);
    this.changePlayer();
    newState = {
      squares, 
      result,
      playerOneScore: scores.playerOneScore,
      playerTwoScore: scores.playerTwoScore
    };
    this.setState(newState);
  }

  checkForResult = (squares, scores) => {
    const isFullSquares = squares.every(row => {
      return row.every(column => {
        return column.value !== '';
      })
    });
    let result = '';
    if (isFullSquares) {
      const { playerOneScore, playerTwoScore } = scores;
      if (playerOneScore === playerTwoScore) {
        result = 'Game Draw!';
      }
      if (playerOneScore > playerTwoScore) {
        result = `${PLAYER_ONE} wins!`
      } else {
        result = `${PLAYER_TWO} wins!`
      }
    }

    return result;
  }

  changePlayer = () => {
    const { currentPlayer } = this.state;

    let newCurrentPlayer = PLAYER_ONE;

    if (currentPlayer === PLAYER_ONE) {
      newCurrentPlayer = PLAYER_TWO;
    }

    this.setState({
      currentPlayer: newCurrentPlayer
    });
  }

  handleLetterOnChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  checkForScore = (rowIndex, columnIndex) => {
    const { playerOneScore, playerTwoScore } = this.state;
    let isScoreIncremented = false;
    let scores = {
      playerOneScore,
      playerTwoScore
    };
    const lines = [
      [rowIndex, columnIndex, rowIndex, columnIndex + 1, rowIndex, columnIndex + 2],
      [rowIndex, columnIndex, rowIndex + 1, columnIndex, rowIndex + 2, columnIndex],
      [rowIndex, columnIndex, rowIndex + 1, columnIndex + 1, rowIndex + 2, columnIndex + 2],
      [rowIndex, columnIndex, rowIndex + 1, columnIndex - 1, rowIndex + 2, columnIndex - 2],
      [rowIndex, columnIndex, rowIndex, columnIndex - 1, rowIndex, columnIndex - 2],
      [rowIndex, columnIndex, rowIndex - 1, columnIndex, rowIndex - 2, columnIndex],
      [rowIndex, columnIndex, rowIndex - 1, columnIndex - 1, rowIndex - 2, columnIndex - 2],
      [rowIndex, columnIndex, rowIndex - 1, columnIndex + 1, rowIndex - 2, columnIndex + 2],
      [rowIndex, columnIndex - 1, rowIndex, columnIndex, rowIndex, columnIndex + 1],
      [rowIndex - 1, columnIndex, rowIndex, columnIndex, rowIndex + 1, columnIndex],
      [rowIndex - 1, columnIndex - 1, rowIndex, columnIndex, rowIndex + 1, columnIndex + 1],
      [rowIndex - 1, columnIndex + 1, rowIndex, columnIndex, rowIndex + 1, columnIndex - 1],
    ];
    const { currentPlayer, squares } = this.state;
    const lastRowIndex = this.props.rowNumber -1;
    const lastColumnIndex = this.props.columnNumber - 1;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const [rowA, columnA, rowB, columnB, rowC, columnC] = lines[lineIndex];
      
      if (this.isCorrectLetter(rowA, columnA, lastRowIndex, lastColumnIndex, squares, 'S')
          && this.isCorrectLetter(rowB, columnB, lastRowIndex, lastColumnIndex, squares, 'O')
          && this.isCorrectLetter(rowC, columnC, lastRowIndex, lastColumnIndex, squares, 'S')) {
        if (currentPlayer === PLAYER_ONE) {
          scores.playerOneScore += 1;
          isScoreIncremented = true;
        }
        if (currentPlayer === PLAYER_TWO) {
          scores.playerTwoScore += 1;
          isScoreIncremented = true;
        }

        if (isScoreIncremented) {
          squares[rowA][columnA].highlighted = true;
          squares[rowB][columnB].highlighted = true;
          squares[rowC][columnC].highlighted = true;
        }
      }
    }

    return scores;
  }

  isCorrectLetter = (rowIndex, columnIndex, rowNumber, columnNumber, squares, letter) => {
    if (rowIndex >= 0 && rowIndex <= rowNumber 
          && columnIndex >= 0 && columnIndex <= columnNumber
          && squares[rowIndex][columnIndex].value === letter) {
      return true;
    }

    return false;
  }

  render() {
    const { squares, currentLetter, currentPlayer, playerOneScore, playerTwoScore, result } = this.state;
    const squareItems = squares.map((row, rowIndex) => {
      return (
        <div 
          key={uuid.v4()}
          style={clearBoth}
        >
          {
            row.map((column, columnIndex) => {
              const squareData = squares[rowIndex][columnIndex];
              return <Square
                key={uuid.v4()}
                value={squareData.value}
                isClicked={squareData.isClicked}
                highlighted={squareData.highlighted}
                handleSquareClick={() => this.handleSquareClick(rowIndex, columnIndex)}
              />
            })
          }
        </div>
      )
    });

    return (
      <div>
        <div>
          Current letter: 
          <select 
            name="currentLetter"
            onChange={this.handleLetterOnChange} 
            value={ currentLetter }
          >
            <option value="S">S</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          Next Turn: <strong>{ currentPlayer }</strong>
        </div>
        <div>
          Player One score: <strong>{ playerOneScore }</strong>
        </div>
        <div>
          Player Two score: <strong>{ playerTwoScore }</strong>
        </div>
        <div style={clearBoth}>
          { squareItems }
        </div>
        <div style={clearBoth}>
          <strong>{ result }</strong>
        </div>
      </div>
    )
  }
}

export default Board
