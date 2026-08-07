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

    let isFirstTurn = true;

    function setGetActivePLayer() {
        if (isFirstTurn) {
            playerX.active = true;
            isFirstTurn = false;
            return playerX
        } else if (playerX.active){
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
            for (let i = 0; i < 9; i++){
                let sum = 0
                for (let position of winTriplets[i])
                    if (board[position].getValue() == mark) ++sum;
                    else break;
                    isTriplet = true
                if (isTriplet) {
                    if (mark == "x") players[0].winner = true;
                    else players[1].winner = true;
                    return true;
                }
            }
        }
    }
    function getWinner(){
        if (typeof players == "object"){ //because players is not set when checking if ther's a winner before using setplayers(arr) in startGame(arr).
            for (let player of players){
                if (player.winner) return player.name;
            }
        }
    }

    function startGame(arr, changePlayers) {
        if (!players) setPlayers(arr)
        else restartGame(arr, changePlayers)
    }

    let rounds = 0
    function playTurn(choice){
        if (getWinner()){
            restartGame()
        }
        let activePlayer = setGetActivePLayer()
        let isNotTaken = board[choice-1].setValue(activePlayer.mark)
        if (isNotTaken){
            gameboard.printGameboard()
            if (rounds < 4){
                rounds++
            } else {
                if (checkGameOver()) console.log(`---${getWinner()} Won!---`)
            }
        } else {
            setGetActivePLayer()
            console.log("You picked a square that was already taken! Try again!")
        }

    }

    function restartGame(arr, changePlayers){
        if (!(changePlayers == "change players")){
            arr = lastGameArr
        }
        setPlayers(arr)
        rounds = 0
        gameboard.resetGameboard()
        console.log("---Restarted---")
    }
    return {startGame, playTurn, restartGame}
})()


game.startGame([{name:"Richard", mark: "x",},{name: "Paul", mark: "o"}])

