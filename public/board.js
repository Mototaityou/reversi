import { Stone } from "./stone.js";
export class Board {
  // states = []
  stones = []
  $table
  numcell
  /**
   * @param  {JQuery} $table
   * @param  {number} numcell
   */
  constructor($table, numcell) {
    this.$table = $table;
    this.numcell = numcell;

    $table.find("tbody").append("<tr></tr>")
    for (let i = 0; i < numcell; i++) {
      const tr = $table.find("tbody").append("<tr></tr>")
      // const num = [];
      const num1 = [];
      for (let k = 0; k < numcell; k++) {
        // num.push(0);
        num1.push(null);

      }
      // this.states.push(num);
      this.stones.push(num1);
      this.$table = $table

      for (let j = 0; j < numcell; j++) {
        tr.append(`<td data-row='${i}' data-column='${j}'></td>`)
      }
    }
    console.log(numcell / 2);
    const stone1 = this.placeStone((numcell / 2), (numcell / 2), 2);
    const stone2 = this.placeStone((numcell / 2), (numcell / 2) - 1, 1);
    const stone3 = this.placeStone((numcell / 2) - 1, (numcell / 2) - 1, 2);
    const stone4 = this.placeStone((numcell / 2) - 1, (numcell / 2), 1);
    // console.log(this.states);
    console.log(this.stones);
    console.log(this.stones[4][3].color);
    
  }
  placeStone(row, column, color) {
    if (color == 1) {
      // this.states[row][column] = 1;
      let stoneBlack = new Stone(row, column, color, this.$table);
      this.stones[row][column] = stoneBlack;
    } else if (color == 2) {
      // this.states[row][column] = 2;
      let stoneWhite = new Stone(row, column, color, this.$table);
      this.stones[row][column] = stoneWhite;
    }
  }
  changeStone(row, column, color) {
    if (color == 1) {
      // this.states[row][column] = 1;
      this.stones[row][column].color = 1; 
      $(`td[data-row=${row}][data-column=${column}]`).empty().append("<div class='blackstone'></div>")
    } else if (color == 2) {
      // this.states[row][column] = 2;
      this.stones[row][column].color = 2;
      $(`td[data-row=${row}][data-column=${column}]`).empty().append("<div class='whitestone'></div>")
    } else if (color == 0) {
      // this.states[row][column] = 0;
      this.stones[row][column].color = null;
      $(`td[data-row=${row}][data-column=${column}]`).empty()
    } else {
      throw (Error("カラーが不正です"))
    }
  }
  removeStones(row, column){
    this.stones[row][column].destroyStone();
    this.stones[row][column] = null;
  }
}
