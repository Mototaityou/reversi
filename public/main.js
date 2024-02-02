///<reference path="JQuery.d.ts"/>
const show = $("#e")
const states = []

$("tbody").append("<tr></tr>")
for (let i = 0; i < 8; i++) {
  const tr = $("tbody").append("<tr></tr>")
  states.push([0, 0, 0, 0, 0, 0, 0, 0]);
  for (let j = 0; j < 8; j++) {
    tr.append(`<td data-row='${i}' data-column='${j}'></td>`)
  }
}
console.log(states);
let currentPlayer = 1;
const black = 1;
const white = 2;
const outside = 8;


$("td").on("click", onClick)
function onClick(event) {
  const td = $(event.currentTarget)
  const row = Number(td.attr("data-row"));
  const column = Number(td.attr("data-column"));
  const color = states[row][column];

  move(row, column, color);
}

placeStone(3, 3, 2);
placeStone(3, 4, 1);
placeStone(4, 4, 2);
placeStone(4, 3, 1);

function placeStone(row, column, color) {
  if (color == 1) {
    states[row][column] = 1;
    $(`td[data-row=${row}][data-column=${column}]`).append("<div class='blackstone'></div>")
  } else if (color == 2) {
    states[row][column] = 2;
    $(`td[data-row=${row}][data-column=${column}]`).append("<div class='whitestone'></div>")
  } else {
    throw (Error("カラーが不正です"))
  }
}

function changeStone(row, column, color) {
  if (color == 1) {
    states[row][column] = 1;
    $(`td[data-row=${row}][data-column=${column}]`).empty().append("<div class='blackstone'></div>")
  } else if (color == 2) {
    states[row][column] = 2;
    $(`td[data-row=${row}][data-column=${column}]`).empty().append("<div class='whitestone'></div>")
  } else if (color == 0) {
    states[row][column] = 0;
    $(`td[data-row=${row}][data-column=${column}]`).empty()
  } else {
    throw (Error("カラーが不正です"))
  }
}

// 手番を表示する
function showPlayer(color) {
  const stoneTurn = document.getElementById("turn");
  if (color == 1) {
    stoneTurn.textContent = "黒番です。";
  } else if (color == 2) {
    stoneTurn.textContent = "白番です。";
  } else {
    throw (Error("手番が不明です。"))
  }
}

let movein = [];
let moveinForward = [];

// 打ったプレイヤーが白番か黒番か
// 打った場所
// 打った後に裏返した場所
// 打った手番、場所、裏返した数を保持する

function move(row, column, color) {

  const VECT = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
  let e = states[row][column];
  if (e != 0) {       //空きマスでなければ
    return 0;       //ここには打てない     
  }
  let moveinfo = {
    "player": currentPlayer,
    "position": [row, column],
    "reverse_positions": []
  }
  let flipdiscs = 0;
  let oppsite = currentPlayer == 2 ? 1 : 2;
  console.log("currentplayer" + currentPlayer);
  for (let v = 0; v < VECT.length; v++) {   //8方向について
    let vect = VECT[v]

    let n = row + vect[0];   //vect方向の隣のマス
    let m = column + vect[1];
    let flip = 0;

    if (n >= 8 || m >= 8 || n < 0 || m < 0) {
      continue;
    }
    console.log(states[n][m]);

    console.log("row" + n);
    console.log("col" + m);

    while (states[n][m] == oppsite) {  //連続する相手の石を
      if (n + vect[0] > 7 || m + vect[1] > 7 || n + vect[0] < 0 || m + vect[1] < 0) {
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
    if (flip > 0 && states[n][m] === currentPlayer) {
      for (let i = 0; i < flip; i++) {     //その相手の石を自分の石にする

        states[n -= vect[0]][m -= vect[1]] = currentPlayer;
        changeStone(n, m, currentPlayer)
        console.log("n" + n);
        console.log("m" + m);
        console.log(currentPlayer);
        console.log(states);
        moveinfo.reverse_positions.push([n, m])
      }
      flipdiscs += flip;         //返した石の数を足し込む
    }
  }
  console.log(currentPlayer);
  console.log(flipdiscs);
  if (flipdiscs > 0) {        //打てた場合
    console.log(flipdiscs);
    if (states[row][column] == 0) {
      if (currentPlayer == 2) {
        currentPlayer = 1;
        showPlayer(1);
        placeStone(row, column, 2)
      } else if (currentPlayer == 1) {
        currentPlayer = 2;
        showPlayer(2);
        placeStone(row, column, 1)       //打ったマスを自分の石にする
      }
      console.log(currentPlayer);
      if (isSkip(color) == false) {
        console.log(currentPlayer);
        currentPlayer = currentPlayer == 2 ? 1 : 2;
        console.log(currentPlayer);
        if (currentPlayer == 1) {
          showPlayer(1);
        } else if (currentPlayer == 2) { showPlayer(2) }
        if (isSkip(color) == false) {
          return 0;
        }
      }
    }
    movein.push(moveinfo);
    console.log(movein);
    movein.forEach(elm => {
      Object.keys(elm).forEach(key => {
        console.log(`key: ${key} value: ${elm[key]}`)
      })
    })
    const numberStone = document.getElementById("number");
    const resultBlack = states.flatMap(data => data).filter(data => data === 1).length;
    const resultWhite = states.flatMap(data => data).filter(data => data === 2).length;
    console.log(resultBlack, resultWhite);
    numberStone.textContent = "黒は" + resultBlack + "個です。白は"+resultWhite+"個です。";

    console.log(currentPlayer);
    return flipdiscs;
  }
}

$("#ps_").on("click", isPass)
function isPass(event) {
  console.log('Click');
  if (currentPlayer == 1) {
    currentPlayer = 2;
    showPlayer(2);
    console.log("currentplayer" + currentPlayer);
  } else if (currentPlayer == 2) {
    currentPlayer = 1;
    showPlayer(1);
    console.log("currentplayer" + currentPlayer);
  }
  console.log(currentPlayer);
}

// 盤面の中にcolorの石が打てる場所が有るかどうか確認する関数
function isSkip(color) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (canMove(i, j)) {
        return true;
      }
    }
  }
  return false;
}

// rowとcolumnで盤面のtdの場所を確認して、石が打てるかどうかを判定する
function canMove(row, column) {
  const VECT = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]

  let e = states[row][column];

  if (e != 0) {       //空きマスでなければ
    return false;     //ここには打てない     
  }
  let oppsite = currentPlayer == 2 ? 1 : 2;
  for (let v = 0; v < VECT.length; v++) {   //8方向について
    let vect = VECT[v]

    let n = row + vect[0];   //vect方向の隣のマス
    let m = column + vect[1];
    let flip = 0;

    if (n >= 8 || m >= 8 || n < 0 || m < 0) {
      continue;
    }

    while (states[n][m] == oppsite) {  //連続する相手の石を
      if (n + vect[0] > 7 || m + vect[1] > 7 || n + vect[0] < 0 || m + vect[1] < 0) {
        break;
      }
      n += vect[0];
      m += vect[1];
      flip++                   //カウントする
    }

    //1個以上相手の石が連続しており、その先に自分の石がある場合
    if (flip > 0 && states[n][m] === currentPlayer) {
      return true;
    }
  }
  return false;
}
// 直前の手番を取得する。
// 今打ったプレイヤーが白番かどうか確認する
// 今の手番を反対にする
// 今裏返した場所を取得する
// 直前に変更した順番ずつ反対にした手番の色に裏返した場所の石を変更する
// 直前に打った石を除去する
// 手番を直前の手番にする

$("#return_").on("click", unMove);
function unMove() {
  let latestPosition = movein.length - 1;
  console.log(latestPosition);
  if (latestPosition < 0) {
    movein.length = 0;
    return;
  }
  let player = movein[latestPosition].player;
  console.log(player);
  player = player == 1 ? 2 : 1;
  console.log(player);
  let reverse_positions = movein[latestPosition].reverse_positions;
  console.log(reverse_positions);
  for (let i = reverse_positions.length - 1; i >= 0; i--) {
    let reverse_row = reverse_positions[i][0];
    let reverse_column = reverse_positions[i][1];
    console.log(i);
    console.log(reverse_row, reverse_column);
    changeStone(reverse_row, reverse_column, player);
  }
  let position = movein[latestPosition].position;
  console.log(position);
  console.log(position[0], position[1]);
  changeStone(position[0], position[1], 0);
  console.log(states);
  player = player == 1 ? 2 : 1;
  if (player == 1) {
    currentPlayer = 1;
    showPlayer(1);
  } else if (player == 2) {
    currentPlayer = 2;
    showPlayer(2);
  }
  console.log(currentPlayer);
  let array1 = movein[movein.length - 1];
  console.log(array1);
  moveinForward.push(array1);
  movein.pop();
  console.log(movein);
  console.log(moveinForward);
}

// moveinForwardのデータを取得
// 最初の手番を獲得
// 最初に置いた場所を獲得
// placeStoneで石を置く
// changeStoneで
$("#forward_").on("click", forward);
function forward() {
  let fasterPosion = moveinForward.length - 1;
  console.log(fasterPosion);
  if (fasterPosion < 0) { return; }
  let forwardPlayer = moveinForward[fasterPosion].player;
  console.log(forwardPlayer);
  let forward_positions = moveinForward[fasterPosion].reverse_positions;
  console.log(forward_positions);
  for (let j = forward_positions.length - 1; j >= 0; j--) {
    let forward_row = forward_positions[j][0];
    let forward_column = forward_positions[j][1];
    console.log(forward_row, forward_column);
    changeStone(forward_row, forward_column, forwardPlayer);
  }
  let forwardPlace = moveinForward[fasterPosion].position;
  console.log(forwardPlace);
  placeStone(forwardPlace[0], forwardPlace[1], forwardPlayer);
  forwardPlayer = forwardPlayer == 1 ? 2 : 1;
  if (forwardPlayer == 1) {
    currentPlayer = 1;
    showPlayer(1);
  } else if (forwardPlayer == 2) {
    currentPlayer = 2;
    showPlayer(2);
  }
  if (isSkip(forwardPlayer) == false) {
    console.log(currentPlayer);
    currentPlayer = currentPlayer == 2 ? 1 : 2;
    console.log(currentPlayer);
    if (currentPlayer == 1) {
      showPlayer(1);
    } else if (currentPlayer == 2) { showPlayer(2) }
    if (isSkip(forwardPlayer) == false) {
      return 0;
    }
  }
  console.log(currentPlayer);
  let array2 = moveinForward[moveinForward.length - 1];
  console.log(array2);
  movein.push(array2);
  moveinForward.pop();
  console.log("moveinForward" + moveinForward);
  console.log("movein" + movein);
}