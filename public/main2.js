///<reference path="./JQuery.d.ts"/>
import { Board } from "./board.js";
import { GameController } from "./gameController.js";
import { getFirebaseConfig } from "./firebase-config.js";
const board = new Board($("#e"), 8);
const gController = new GameController(board);


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseAppConfig = getFirebaseConfig();
  initializeApp(firebaseAppConfig)

