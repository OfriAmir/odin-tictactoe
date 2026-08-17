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
    players = [
    {
        name: null,
        mark: "x",
        active: false,
        winner: false,
        winCount: 0,
    },
    {
        name: null,
        mark: "o",
        active: false,
        winner: false,
        winCount: 0,
    }];
    [playerX, playerO] = [players[0],players[1]]
    function setPlayers (arr, resetWinCount){
        lastGameArr = arr.slice(); // To use in the next game in case the players don't want to change names. Used in restartGame()
        for (let i = 0; i < 2; i++){
            players[i].name = arr[i];
            players[i].active = false;
            players[i].winner = false;
            if (resetWinCount) {
                players[i].winCount = 0;
                // activePlayer = playerX
                // activePlayer.active = true
            }
        }
        displayController.updateScores()
    };


    function setGetActivePLayer() {
        if (playerX.active){
            console.log("hi")
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
                        if (mark == "x") {
                            players[0].winner = true;
                        } else {
                            players[1].winner = true;
                        }
                        return "win";
                    }
                }
            }
        }
        const tie = board.every(item => item.getValue())
        if (tie) return "tie"
    }

    let activePlayer
    // activePlayer = playerX
    // activePlayer.active = true

    // function startGame(arr = ["Player 1","Player 2"], changePlayers) {
    //     if (!players) setPlayers(arr)
    //     else restartGame(arr, changePlayers)
    //     activePlayer = playerX //playerX starts in tictactoe
    //     activePlayer.active = true
    //     displayController.displaySentence(`It is ${activePlayer.name}'s turn!`)  
    // }

    let rounds = 0
    function playTurn(choice){
        // console.log(activePlayer.mark)
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
                    activePlayer.winCount++
                    displayController.updateScores()
                    displayController.displaySentence(`---${activePlayer.name} Won!---`);
                    [players[0].mark, players[1].mark] = [players[1].mark, players[0].mark];
                    [playerX, playerO] = [playerO, playerX];
                    return
                }
            }
            activePlayer = setGetActivePLayer() // for next round
            // console.log(activePlayer.mark)
            displayController.displaySentence(`It is ${activePlayer.name}'s turn!`)            
        } else {
            setGetActivePLayer()
            activePlayer = setGetActivePLayer() //twice to keep it the same
            displayController.displaySentence(`You picked a square that was already taken! Try again. It is ${activePlayer.name}'s turn!`)
        }

    }

    function restartGame(arr, resetWinCount){
        if (!arr) arr = lastGameArr
        setPlayers(arr, resetWinCount)
        rounds = 0
        activePlayer = playerX
        activePlayer.active = true
        displayController.displaySentence(`It is ${activePlayer.name}'s turn!`)
        gameboard.resetGameboard()
        displayController.updateGameboard()
    }

    function getScores () {
        return [playerX.winCount, playerO.winCount]
    }

    return {playTurn, restartGame, getScores,}
})()


const displayController = (function(){
    let refs = (function() {
        const squares = document.querySelectorAll(".gameboard-square")
        const gameboard = document.querySelector(".gameboard")
        const displaySentence = document.querySelector(".display-sentence")
        const restartBtn = document.querySelector(".restart-btn")
        const openSettingsBtn = document.querySelector(".settings-btn")
        const settingsForm = document.querySelector(".settings-form")
        const playerX = document.querySelector(".playerX") 
        const playerO = document.querySelector(".playerO")
        const scores = document.querySelector(".display-scores")

        return {squares ,gameboard, displaySentence, restartBtn, openSettingsBtn, settingsForm, playerX, playerO, scores,}
    })()


    function updateGameboard(){
        let gameboardData = gameboard.getGameboard()
        refs.squares.forEach((item, index) => {
            // item.textContent = gameboardData[index].getValue()
            if (gameboardData[index].getValue() == "x") {
                item.style.backgroundImage = "url(images/X.png)"
            } else if (gameboardData[index].getValue() == "o"){
                item.style.backgroundImage = "url(images/O.png)"
            } else {
                item.style.backgroundImage = ""
            }
        })
    }
    function displaySentence(sentence){
        refs.displaySentence.textContent = sentence
    }

    function updateScores(){
        const scores = game.getScores()
        const playerXScoreRef = refs.scores.querySelector(".playerX-score")
        const playerOScoreRef = refs.scores.querySelector(".playerO-score")
        playerXScoreRef.textContent = scores[0]
        playerOScoreRef.textContent = scores[1]
    }

    refs.gameboard.addEventListener("click", (e) => {
        refs.squares.forEach((item, index) => {
            if (e.target.getAttribute("class") == item.getAttribute("class")){
                game.playTurn(index)
            }
        })
    })

    let settingsArr = ["player 1", "player 2"]

    refs.restartBtn.addEventListener("click", function() {
        game.restartGame(settingsArr)
    })

    refs.openSettingsBtn.addEventListener("click", function() {
        refs.settingsForm.toggleAttribute("hidden")
    })

    refs.settingsForm.addEventListener("click", function(e){
        if (e.target.getAttribute("class") == "submit-btn"){
            const playerXName = refs.playerX.value
            const playerOName = refs.playerO.value
            settingsArr = [`${playerXName}`, `${playerOName}`]
            refs.playerX.setAttribute("value", settingsArr[0])
            refs.playerO.setAttribute("value", settingsArr[1])
            const playerXNameRef = refs.scores.querySelector(".playerX-name")
            const playerONameRef = refs.scores.querySelector(".playerO-name")
            playerXNameRef.textContent = settingsArr[0]
            playerONameRef.textContent = settingsArr[1]

            const resetScores = refs.settingsForm.querySelector(".reset-scores").checked
            game.restartGame(settingsArr, resetScores)
            
            refs.settingsForm.reset()
            refs.settingsForm.toggleAttribute("hidden")

        } else if (e.target.getAttribute("class") == "cancel-btn"){
            refs.settingsForm.reset()
            refs.settingsForm.toggleAttribute("hidden")
        } 

    })
    return ({updateGameboard, displaySentence, updateScores,})
})()

game.restartGame(["Player 1","Player 2"],true)