import Game from "./game.js";
import config from "./config/game_config.js";

const outputConsole = {
  updateX(val) {
    document.getElementById(config.console.posX).innerHTML = val
  },
  updateY(val) {
    document.getElementById(config.console.posY).innerHTML = val
  },
  updateDirection(val) {
    document.getElementById(config.console.direction).innerHTML = val
  },
}


let newGame = new Game(config);

newGame.init(document.querySelector("#toyGame"), outputConsole);
const gameCharacter = newGame.getCharacter();



console.log("gameCharacter");
console.log(gameCharacter);


const inputConsole = {
  start() {
    let formEl = document.getElementById("positionStarter")

    //PREVENT SPACEBAR FORM SUBMISSION 
    formEl[3].addEventListener("keydown", (event) => {
      if (event.code == "Space") {
        event.preventDefault();
        return false;
      }
    })

    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      //MOVE THE CHARACTER
      gameCharacter.respawn(formEl[0].value, formEl[1].value, formEl[2].value);

      formEl[2].blur();
    })
  }
}

inputConsole.start();