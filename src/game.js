const gameUtils = {
  setStyle(el, property, value) {
    el.style[property] = value;
  },
  createEl(elType, qty = 1, appendTo, className) {
    const createdElements = [];
    for (let i = 0; i < qty; i++) {
      const newEl = document.createElement(elType);
      if (className) {
        newEl.classList.add(className);
      }
      createdElements.push(newEl);
      if (appendTo) {
        appendTo.appendChild(newEl);
      }
    }
    return createdElements;
  },
}

class Character {


  #movementListeners = [];
  #directionSequence = ["SOUTH", "EAST", "NORTH", "WEST"];
  #charRotation = {
    SOUTH: "0deg",
    EAST: "90deg",
    NORTH: "180deg",
    WEST: "270deg",
  }

  constructor(posXY, dim) {

    //SET INITIAL DIRECTION
    this.directionIndex = 0;
    this.posXY = posXY;
    this.movementOffset = dim;

    this.domEl = gameUtils.createEl("div", 1, null, "character")[0];
    gameUtils.setStyle(this.domEl, "left", posXY[0] + "px");
    gameUtils.setStyle(this.domEl, "top", posXY[1] + "px");
    gameUtils.setStyle(this.domEl, "width", this.movementOffset + "px");
    gameUtils.setStyle(this.domEl, "height", this.movementOffset + "px");

    const rotateClockWise = () => {
      //INCREASE THE DIRECTION INDEX
      this.directionIndex = (this.directionIndex == this.#directionSequence.length - 1) ? 0 : (this.directionIndex + 1);
      gameUtils.setStyle(this.domEl, "transform", `rotate(${this.#charRotation[this.#directionSequence[this.directionIndex]]})`);
      this.sendInfoToListeners();
    }

    const rotateCounterClockWise = () => {
      //DECREASE THE DIRECTION INDEX
      this.directionIndex = (this.directionIndex == 0) ? this.#directionSequence.length - 1 : this.directionIndex - 1;
      gameUtils.setStyle(this.domEl, "transform", `rotate(${this.#charRotation[this.#directionSequence[this.directionIndex]]})`);
      this.sendInfoToListeners();
    }



    const move = () => {
      const currentDirection = this.#directionSequence[this.directionIndex];

      //CALCULATE THE NEW POSITION
      if (currentDirection == "EAST") {
        this.posXY = [(this.posXY[0] == 4) ? this.posXY[0] : ++this.posXY[0], this.posXY[1]]
      }
      else if (currentDirection == "NORTH") {
        this.posXY = [this.posXY[0], (this.posXY[1] == 4) ? this.posXY[1] : ++this.posXY[1]]
      }
      else if (currentDirection == "WEST") {
        this.posXY = [(this.posXY[0] == 0) ? this.posXY[0] : --this.posXY[0], this.posXY[1]]
      }
      else if (currentDirection == "SOUTH") {
        this.posXY = [this.posXY[0], (this.posXY[1] == 0) ? this.posXY[1] : --this.posXY[1]]
      }


      //MOTE THE CHARACTER WITH COMPUTED VALUE
      gameUtils.setStyle(this.domEl, "left", (this.posXY[0] * this.movementOffset) + "px");
      gameUtils.setStyle(this.domEl, "top", (this.posXY[1] * this.movementOffset) + "px");

      //REPORT POSITION IF THERE ARE LISTENERS
      this.sendInfoToListeners();
    }

    document.addEventListener("keydown", function (event) {
      // console.log(event.code);
      switch (event.code) {
        case "ArrowRight":
          rotateClockWise();
          break;
        case "ArrowLeft":
          rotateCounterClockWise();
          break;
        case "Space":
          move();
          break;
      }
    })
  }

  sendInfoToListeners() {
    if (this.#movementListeners.length > 0) {
      this.#movementListeners.forEach(func => {
        func(this.posXY, this.#directionSequence[this.directionIndex]);
      });
    }
  }

  moveTo(posX, posY, direction) {
    this.posXY = [posX, posY];
    this.directionIndex = this.#directionSequence.indexOf(direction);
    gameUtils.setStyle(this.domEl, "transform", `rotate(${this.#charRotation[this.#directionSequence[this.directionIndex]]})`);
    //MOTE THE CHARACTER WITH COMPUTED VALUE
    gameUtils.setStyle(this.domEl, "left", (this.posXY[0] * this.movementOffset) + "px");
    gameUtils.setStyle(this.domEl, "top", (this.posXY[1] * this.movementOffset) + "px");
    this.sendInfoToListeners();
  }

  addToStage(canvasElement) {
    canvasElement.appendChild(this.domEl);
  }

  addMovementListener(funcCallback) {
    this.#movementListeners.push(funcCallback)
  }

  clearMovementListener() {
    this.#movementListeners = [];
  }
}


export default class Game {

  constructor(configProps = {}) {
    const { canvasWidth = 500, canvasHeight = 500, unit = 5 } = configProps;
    this.config = {
      canvasWidth,
      canvasHeight,
      unit
    }

    this.domEls = {};

    this.characters = [];
    this.characters.push(new Character([0, 0], (canvasWidth / unit)));

  }

  //INITIATE THE GAME
  init(canvasElement, outputConsole) {
    this.domEls.canvasElement = canvasElement;
    this.domEls.canvasElement.classList.add("toygame_root");
    this.domEls.grid = gameUtils.createEl("div", 1, this.domEls.canvasElement, "grid")[0];
    gameUtils.createEl("div", (this.config.unit * this.config.unit), this.domEls.grid);
    gameUtils.setStyle(this.domEls.canvasElement, "width", this.config.canvasWidth + "px");
    gameUtils.setStyle(this.domEls.canvasElement, "height", this.config.canvasHeight + "px");
    this.characters[0].addToStage(this.domEls.canvasElement);


    this.characters[0].addMovementListener((posXY, direction) => {
      outputConsole.updateX(posXY[0]);
      outputConsole.updateY(posXY[1]);
      outputConsole.updateDirection(direction);
    })

  }

  getCharacter() {
    return this.characters[0]
  }
}