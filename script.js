const gameboard = (()=>{
    function GameboardSquare(){
        let status;
        function getValue() {
            return status;
        }
        function setValue(player) {
            if (player == "x") status = "x";
            else if (player == "o") status = "o";
            else if (player == "empty") status = null;
        }
        
        return {getValue, setValue};
    }
    let squares = [];
    for (let i = 0; i < 9; i++){
        squares.push(GameboardSquare());
    }

    function getGameboard() {
        return squares;
    }

    function resetGameboard() {
        squares.forEach(obj => obj.setValue("empty"));
    }
    return {getGameboard, resetGameboard};
})()

const game = () => {
    function setPlayers (arr){
        const players = [
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
            let [playerX, playerO] = [players[0],players[1]];
        } else {
            let [playerX, playerO] = [players[1],players[0]];
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

    let winTriplets = [[1,2,3],[4,5,6][7,8,9][1,4,7][2,5,8][3,6,9][1,5,9][3,5,7]];

    function checkGameOver (){
        let gameboard = gameboard.getGameboard();
        for (let mark of ["x","o"]){
            for (let i = 0; i < 9; i++){
                let sum = 0
                for (let position of winTriplets[i])
                    if (gameboard[position].getValue() == mark) ++sum;
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
        for (let player of players){
            if (player.winner) return player.name;
        }
    }

    function startGame(arr) {
        setPlayers(arr)
    }

    let rounds = 0
    function playTurn(choice){
        let gameboard = gameboard.getGameboard()
        let activePlayer = setActivePLayer()
        gameboard[choice].setValue(activePlayer.mark)
        if (rounds < 5){
            rounds++
        } else {
            if (checkGameOver()) getWinner()
        }
    }
    return {startGame, playTurn}//should add restart functionality
}

