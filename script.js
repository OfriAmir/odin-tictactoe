const gameboard = (function() {
    function GameboardSquare(){
        let status;
        function getValue() {
            return status;
        }
        function setValue(player) {
            if (player == "empty"){ 
                status = null
                return
            } else if (status) return
            if (player == "x") status = "x";
            else if (player == "o") status = "o";
            return true
        } 
        return {getValue, setValue};
    }
    let squares = [];
    for (let i = 0; i < 9; i++){
        squares.push(GameboardSquare());
    }
    function printGameboard() {
        let printArr = []
        for (let i = 0; i < 3; i++){
            printArr.push([])
        }
        for (let j = 0; j < 9; j++){
            printArr[Math.floor(j/3)].push(squares[j].getValue())
        }
        console.table(printArr)
    }
    function getGameboard() {
        return squares;
    }

    function resetGameboard() {
        squares.forEach(obj => obj.setValue("empty"));
    }
    return {getGameboard, printGameboard, resetGameboard};
})()

const game = (function(){
    let playerX;
    let playerO;
    let players;
    let board = gameboard.getGameboard();
    let lastGameArr
    function setPlayers (arr){
        lastGameArr = arr.slice(); // To use in the next game in case the players don't want to change names or marks (X,O)
        players = [
        {
            name: null,
            mark: null,
            active: false,
            winner: false,
        },
        {
            name: null,
            mark: null,
            active: false,
            winner: false,
        }];
        players[0].name = arr[0].name;
        players[1].name = arr[1].name;
        players[0].mark = arr[0].mark;
        players[1].mark = arr[1].mark;
        if (players[0].mark = "x"){
            [playerX, playerO] = [players[0],players[1]];
        } else {
            [playerX, playerO] = [players[1],players[0]];
        }
    };


    function setGetActivePLayer() {
        if (playerX.active){
            playerX.active = false;
            playerO.active = true;
            return playerO
        } else {
            playerO.active = false;
            playerX.active = true;
            return playerX
        }
    }

    let winTriplets = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

    function checkGameOver (){
        for (let mark of ["x","o"]){
            for (let i = 0; i < 8; i++){
                let sum = 0
                for (let position of winTriplets[i]){
                    if (board[position-1].getValue() == mark) ++sum;//it's indexes so substracted by 1.
                    else break;
                    if (sum == 3){
                        if (mark == "x") players[0].winner = true;
                        else players[1].winner = true;
                        return "win";
                    }
                }
            }
        }
        const tie = board.every(item => item.getValue())
        if (tie) return "tie"
    }
    function getWinner(){
        for (let player of players){
            if (player.winner) return player.name;
        }
    }

    function startGame(arr = [{name:"Player 1", mark: "x",},{name: "Player 2", mark: "o"}], changePlayers) {
        if (!players) setPlayers(arr)
        else restartGame(arr, changePlayers)
        activePlayer = playerX //playerX starts in tictactoe
        activePlayer.active = true
        displayController.displaySentence(`It is ${activePlayer.name}'s turn!`)  
    }

    let rounds = 0
    function playTurn(choice){
        if (checkGameOver()){
            restartGame()
        }
        let isNotTaken = board[choice].setValue(activePlayer.mark)
        if (isNotTaken){
            displayController.updateGameboard()
            if (rounds < 4){ //There can't be a winner in the first 4 rounds.
                rounds++
            } else {
                let gameOverMessage = checkGameOver()
                if (gameOverMessage == "tie") {
                    displayController.displaySentence(`---It's a tie! No one won!---`)
                    return
                } else if (gameOverMessage == "win"){
                    displayController.displaySentence(`---${getWinner()} Won!---`)
                    return
                }
            }
            activePlayer = setGetActivePLayer() // for next round
            displayController.displaySentence(`It is ${activePlayer.name}'s turn!`)            
        } else {
            setGetActivePLayer()
            activePlayer = setGetActivePLayer() //twice to keep it the same
            displayController.displaySentence(`You picked a square that was already taken! Try again. It is ${activePlayer.name}'s turn!`)
        }

    }

    function restartGame(arr, changePlayers){
        if (!(changePlayers == "change players")){
            arr = lastGameArr
        }
        setPlayers(arr)
        rounds = 0
        activePlayer = playerX
        activePlayer.active = true
        displayController.displaySentence(`It is ${activePlayer.name}'s turn!`)
        gameboard.resetGameboard()
        console.log("---Restarted---")
    }
    return {startGame, playTurn, restartGame}
})()


const displayController = (function(){
    const squares = document.querySelectorAll(".gameboard-square")
    const gameboardRef = document.querySelector(".gameboard")
    function updateGameboard(){
        let gameboardData = gameboard.getGameboard()
        squares.forEach((item, index) => {
            item.textContent = gameboardData[index].getValue()     
        })
    }
    const text = document.querySelector(".display-sentence")
    function displaySentence(sentence){
        text.textContent = "hello?"
        text.textContent = sentence
    }
    gameboardRef.addEventListener("click", (e) => {
        squares.forEach((item, index) => {
            if (e.target.getAttribute("class") == item.getAttribute("class")){
                game.playTurn(index)
            }
        })
    })
    return ({updateGameboard, displaySentence})
})()

game.startGame()