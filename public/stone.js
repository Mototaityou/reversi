export class Stone {
  row
  column
  color
  $table

  constructor(row, column, color, $table) {
    this.row = row;
    this.column = column;
    this.color = color;
    this.$table = $table;

    if (color == 1) {
      $table.find(`td[data-row=${row}][data-column=${column}]`).append("<div class='blackstone'></div>")
    } else if (color == 2) {
      $table.find(`td[data-row=${row}][data-column=${column}]`).append("<div class='whitestone'></div>")
    } else {
      throw (Error("カラーが不正です"))
    }

  }
  turnColor() {
    if (this.color == 1) {
      this.color = 2;
      this.$table.find(`td[data-row=${this.row}][data-column=${this.column}]`).empty().append("<div class='whitestone'></div>")
    } else if (this.color == 2) {
      this.color = 1;
      this.$table.find(`td[data-row=${this.row}][data-column=${this.column}]`).empty().append("<div class='blackstone'></div>")
    } else if(this.color == null) {
      this.color = null;
      this.destroyStone();
    } else {
      throw(Error("カラーが不正です"))
    }
  }
  destroyStone() {
  this.$table.find(`td[data-row=${this.row}][data-column=${this.column}]`).empty()
  }
}

