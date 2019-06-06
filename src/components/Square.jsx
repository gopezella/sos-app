import React, { Component } from 'react'

const squareButtonStyle = (highlighted) => {
  return {
    backgroundColor: highlighted ? 'pink' : '#fff',
    float: 'left',
    border: '1px solid #999',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '34px',
    height: '34px',
    padding: 0,
    textAlign: 'center',
    width: '34px',
    color: 'black'
  }
}

export class Square extends Component {
  render() {
    const { handleSquareClick, isClicked, value, highlighted } = this.props;

    return (
        <button 
          style={squareButtonStyle(highlighted)}
          onClick={handleSquareClick}
          disabled={isClicked}
        >
        { value }
        </button>
    )
  }
}

export default Square
