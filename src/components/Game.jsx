import React, { Component } from 'react'
import Board from './Board'

export class Game extends Component {
  state = {
    rowNumber: 5,
    columnNumber: 5,
    status: ''
  }

  render() {
    const { rowNumber, columnNumber } = this.state;

    return (
      <div>
        <h1>SOS Game</h1>
        <Board
          rowNumber={rowNumber}
          columnNumber={columnNumber}
        />
      </div>
    )
  }
}

export default Game
