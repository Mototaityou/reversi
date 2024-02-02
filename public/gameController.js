///<reference path="JQuery.d.ts"/>
import { Board } from "./board.js";
import { Player } from "./player.js";
import { Stone } from "./stone.js";

export class GameController {
  board
  /** @type {Player} */
  currentPlayer
  /** @type {Player[]} */
  players
  // /** @type {Board[]} */
  // states
  /** @type {Board{}} */
  stones
  /** @type {Player} */
  player

  movein = [];
  moveinForward = [];

  /**
   * @param  {Board} board
   * @param  {number} numcell
   */
  constructor(board) {
    this.board = board;
    const player = new Player(1, board);
    this.player = player;
    console.log(player);
    board.$table.find("td").on("click", this.onClick);
    $("#ps_").on("click", this.isPass);
    $("#return_").on("click", this.unMove);
    $("#forward_").on("click", this.forward);
    const currentPlayer = new Stone(null, null, 1, board.$table);
    this.currentPlayer = currentPlayer;
    console.log(this.currentPlayer);
    const black = new Stone(null, null, 1, board.$table);
    this.black = black;
    console.log(this.black);
    const white = new Stone(null, null, 2, board.$table);
    this.white = white;
    console.log(this.white);
    const stone = [black.color, white.color];
    this.stone = stone;

    // console.log(board.states);
    console.log(board.stones);
    console.log(currentPlayer.color);
    console.log(stone);
  }

  onClick = event => {
    const td = $(event.currentTarget)
    const row = Number(td.attr("data-row"));
    const column = Number(td.attr("data-column"));
    console.log(row, column);
    // console.log(this.board.states);
    console.log(this.board.stones);
    // const color = this.board.states[row][column];
    const color = this.board.stones[row][column];
    console.log("color:" + color);
    this.move(row, column, color);

  }
  move(row, column, color) {
    // console.log(this.moveinForward[this.moveinForward.length-1]);
    // console.log(this.moveinForward);
    // console.log(this.movein);
    const VECT = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
    // let e = this.board.states[row][column];
    let e = this.board.stones[row][column];
    if(this.moveinForward[this.moveinForward.length-1] !== e && this.moveinForward[this.moveinForward.length-1] !== this.movein ){
      this.moveinForward.pop();
    }
    // if (e != 0) {  
    if (e != null) {       //空きマスでなければ
      return;             //ここには打てない     
    }
    let moveinfo = {
      "player": this.currentPlayer.color,
      "position":[],
      "reverse_positions": []
    }
    console.log(this.currentPlayer.color);
    let flipdiscs = 0;
    let oppsite = this.currentPlayer.color === this.stone[1] ? this.stone[0] : this.stone[1];
    console.log("currentplayer" + this.currentPlayer.color);
    console.log("oppsite:" + oppsite);
    for (let v = 0; v < VECT.length; v++) {   //8方向について
      let vect = VECT[v]

      let n = row + vect[0];   //vect方向の隣のマス
      let m = column + vect[1];
      let flip = 0;

      if (n >= this.board.numcell || m >= this.board.numcell || n < 0 || m < 0) {
        continue;
      }
      // console.log(this.board.states[n][m]);
      console.log(this.board.stones[n][m]);

      console.log("row" + n);
      console.log("col" + m);

      // while (this.board.states[n][m] == oppsite) {  //連続する相手の石を
      if (this.board.stones[n][m] === null) {
        continue;
      }
      while ((this.board.stones[n][m] != null ) && (this.board.stones[n][m].color === oppsite)) {  //連続する相手の石を
        if (n + vect[0] > this.board.numcell - 1 || m + vect[1] > this.board.numcell - 1 || n + vect[0] < 0 || m + vect[1] < 0) {
          break;
        }
        n += vect[0];
        m += vect[1];
        flip++                   //カウントする
        console.log("row" + n);
        console.log("col" + m);
        console.log("flip" + flip);
      }

      //1個以上相手の石が連続しており、その先に自分の石がある場合
      // if (flip > 0 && this.board.states[n][m] === this.currentPlayer.color) {
      if (flip > 0 && (this.board.stones[n][m] != null ) && this.board.stones[n][m].color === this.currentPlayer.color) {
        for (let i = 0; i < flip; i++) {     //その相手の石を自分の石にする

          // this.board.states[n -= vect[0]][m -= vect[1]] = this.currentPlayer.color;
          this.board.stones[n -= vect[0]][m -= vect[1]].turnColor();
          console.log("n" + n);
          console.log("m" + m);
          console.log(this.currentPlayer.color);
          // console.log(this.board.states);
          console.log(this.board.stones);
          moveinfo.reverse_positions.push(this.board.stones[n][m])
        }
        flipdiscs += flip;         //返した石の数を足し込む
      }
    }
    console.log(this.currentPlayer.color);
    console.log(flipdiscs);
    if (flipdiscs > 0) {        //打てた場合
      console.log(flipdiscs);
      // if (this.board.states[row][column] == 0) {
      if (this.board.stones[row][column] == null) {
        if (this.currentPlayer.color == this.stone[1]) {
          this.currentPlayer.color = this.stone[0];
          this.player.showPlayer(this.stone[0]);
          this.board.placeStone(row, column, this.stone[1])
          moveinfo.position = this.board.stones[row][column];
        } else if (this.currentPlayer.color == this.stone[0]) {
          this.currentPlayer.color = this.stone[1];
          this.player.showPlayer(this.stone[1]);
          this.board.placeStone(row, column, this.stone[0]) 
          moveinfo.position = this.board.stones[row][column];      //打ったマスを自分の石にする
        }
        console.log(this.currentPlayer.color);
        if (this.isSkip(this.currentPlayer.color) === false) {
          console.log(this.currentPlayer.color);
          this.currentPlayer.color = this.currentPlayer.color == this.stone[1] ? this.stone[0] : this.stone[1];
          console.log(this.currentPlayer.color);
          if (this.currentPlayer.color === this.stone[0]) {
            this.player.showPlayer(this.stone[0]);
          } else if (this.currentPlayer.color == this.stone[1]) { this.player.showPlayer(this.stone[1]) }
          if (this.isSkip(this.currentPlayer.color) == false) {
            return 0;
          }
        }
      }
      this.movein.push(moveinfo);
      console.log("movein" + this.movein);
      this.movein.forEach(elm => {
        Object.keys(elm).forEach(key => {
          console.log(`key: ${key} value: ${elm[key]}`)
        })
      })

      this.player.showStoneNumber();
      console.log(this.currentPlayer.color);
      return flipdiscs;
    }
  }
  // 盤面の中にcolorの石が打てる場所が有るかどうか確認する関数
  isSkip(color) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.canMove(i, j)) {
          return true;
        }
      }
    }
    return false;
  }
  // rowとcolumnで盤面のtdの場所を確認して、石が打てるかどうかを判定する
  canMove(row, column) {
    // console.log(row, column);
    // console.log(this.currentPlayer.color);
    const VECT = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
    // let e = this.board.states[row][column];
    let e = this.board.stones[row][column];
    // if (e != 0) {  
    if (e != null) {       //空きマスでなければ
      return false;             //ここには打てない     
    }

    // console.log(this.currentPlayer.color);
    let oppsite = this.currentPlayer.color === this.stone[1] ? this.stone[0] : this.stone[1];
    // console.log("currentplayer" + this.currentPlayer.color);
    // console.log("oppsite:" + oppsite);
    for (let v = 0; v < VECT.length; v++) {   //8方向について
      let vect = VECT[v]

      let n = row + vect[0];   //vect方向の隣のマス
      let m = column + vect[1];
      let flip = 0;

      if (n >= this.board.numcell || m >= this.board.numcell || n < 0 || m < 0) {
        continue;
      }
      // console.log(this.board.states[n][m]);
      // console.log(this.board.stones[n][m]);

      // console.log("row" + n);
      // console.log("col" + m);

      // while (this.board.states[n][m] == oppsite) {  //連続する相手の石を
      // console.log(this.board.stones[n][m]);
      if (this.board.stones[n][m] === null) {
        continue;
      }
      console.log(this.board.stones[n][m]);
      while ((this.board.stones[n][m] != null ) && (this.board.stones[n][m].color === oppsite) ) {  //連続する相手の石を
        if (n + vect[0] > this.board.numcell - 1 || m + vect[1] > this.board.numcell - 1 || n + vect[0] < 0 || m + vect[1] < 0) {
          break;
        }
        n += vect[0];
        m += vect[1];
        flip++;                   //カウントする
        // console.log("row" + n);
        // console.log("col" + m);
        // console.log("flip" + flip);
      }

      //1個以上相手の石が連続しており、その先に自分の石がある場合
      // if (flip > 0 && this.board.states[n][m] === this.currentPlayer.color) {
      // console.log("flip" + flip);
      // console.log(this.board.stones[n][m]);
      // console.log(this.currentPlayer.color);
      if (flip > 0 && (this.board.stones[n][m] != null ) && this.board.stones[n][m].color === this.currentPlayer.color) {
        return true;
      }
    }
    return false;
  }

  isPass = event => {
    if (this.currentPlayer.color == this.stone[0]) {
      this.currentPlayer.color = this.stone[1];
      this.player.showPlayer(this.stone[1]);
      console.log("currentplayer" + this.currentPlayer.color);
    } else if (this.currentPlayer.color == this.stone[1]) {
      this.currentPlayer.color = this.stone[0];
      this.player.showPlayer(this.stone[0]);
      console.log("currentplayer" + this.currentPlayer.color);
    }
    console.log(this.currentPlayer.color);
  }

  unMove = event => {
    let latestPosition = this.movein.length - 1;
    console.log(latestPosition);
    if (latestPosition < 0) {
      this.movein.length = 0;
      return;
    }
    let player = this.movein[latestPosition].player;
    console.log(player);
    player = player == this.stone[0] ? this.stone[1] : this.stone[0];
    console.log(player);
    let reverse_stones = this.movein[latestPosition].reverse_positions;
    console.log(reverse_stones);
    for (let i = reverse_stones.length - 1; i >= 0; i--) {
      let reverse_stone = reverse_stones;
      console.log(i);
      console.log(reverse_stone);
      reverse_stone[i].turnColor();
    }
    
    let position = this.movein[latestPosition].position;
    console.log(position);
    console.log(position.row, position.column, position.color);
    this.board.removeStones(position.row, position.column);
    // console.log(this.board.states);
    console.log(this.board.stones);
    this.player.showStoneNumber();
    player = player == this.stone[0] ? this.stone[1] : this.stone[0];
    if (player == this.stone[0]) {
      this.currentPlayer.color = this.stone[0];
      this.player.showPlayer(this.stone[0]);
    } else if (player == this.stone[1]) {
      this.currentPlayer.color = this.stone[1];
      this.player.showPlayer(this.stone[1]);
    }
    console.log(this.currentPlayer.color);
    let array1 = this.movein[this.movein.length - 1];
    console.log(array1);
    this.moveinForward.push(array1);
    this.movein.pop();
    console.log("movein" + this.movein);
    console.log("moveinForward" + this.moveinForward);
  }

  forward = event => {
    let fasterPosion = this.moveinForward.length - 1;
    console.log(fasterPosion);
    if (fasterPosion < 0) { return; }
    let forwardPlayer = this.moveinForward[fasterPosion].player;
    console.log(forwardPlayer);
    let forward_positions = this.moveinForward[fasterPosion].reverse_positions;
    console.log(forward_positions);
    for (let j = forward_positions.length - 1; j >= 0; j--) {
      let forward_stone = forward_positions;
      console.log(forward_stone[j]);
      forward_stone[j].turnColor();
    }
    let forwardPlace = this.moveinForward[fasterPosion].position;
    console.log(forwardPlace);
    this.board.placeStone(forwardPlace.row, forwardPlace.column, forwardPlayer);
    forwardPlayer = forwardPlayer == this.stone[0] ? this.stone[1] : this.stone[0];
    if (forwardPlayer == this.stone[0]) {
      this.currentPlayer.color = this.stone[0];
      this.player.showPlayer(this.stone[0]);
    } else if (forwardPlayer == this.stone[1]) {
      this.currentPlayer.color = this.stone[1];
      this.player.showPlayer(this.stone[1]);
    }
    if (this.isSkip(forwardPlayer) == false) {
      console.log(forwardPlayer);
      forwardPlayer = forwardPlayer == this.stone[1] ? this.stone[0] : this.stone[1];
      console.log(forwardPlayer);
      if (forwardPlayer == this.stone[0]) {
        this.player.showPlayer(this.stone[0]);
      } else if (forwardPlayer == this.stone[1]) { this.player.showPlayer(this.stone[1]) }
      if (this.isSkip(forwardPlayer) == false) {
        return 0;
      }
    }
    console.log(forwardPlayer);
    let array2 = this.moveinForward[this.moveinForward.length - 1];
    console.log(array2);
    this.movein.push(array2);
    this.moveinForward.pop();
    console.log("moveinForward" + this.moveinForward);
    console.log("movein" + this.movein);
    console.log(this.board.stones);
    this.player.showStoneNumber();
  }
}