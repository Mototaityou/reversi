import { Board } from "./board.js";
import { Stone } from "./stone.js";

export class Player {
  color
  board
  /**
   * @param  {Board} board
   */
  constructor(color, board) {
    this.color = color;
    this.board = board;
  
    console.log(color);
  }
  
  showPlayer(color) {
    const stoneTurn = document.getElementById("turn");
    if (color == 1) {
      stoneTurn.textContent = "黒番です。";
    } else if (color == 2) {
      stoneTurn.textContent = "白番です。";
    } else {
      throw (Error("手番が不明です。"))
    }
  }

  showStoneNumber() {
    const numberStone = document.getElementById("number");
    const resultBlack = this.board.stones.flatMap(data => data).filter(data => data !==null).filter(data => data.color === 1).length;
    const resultWhite = this.board.stones.flatMap(data => data).filter(data => data !==null).filter(data => data.color === 2).length;
    console.log(resultBlack, resultWhite);
    numberStone.textContent = "黒は" + resultBlack + "個です。白は" + resultWhite + "個です。"
  }
  ;
}