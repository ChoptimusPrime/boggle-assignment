// Jon Compton
// Springboard May 26 Cohort
class Game {
    constructor() {
        this.time = 60;
        this.score = 0;
        this.words = new Set();
        this.playing = true;
        this.init()
    }

    init() {
        this.updateTimeDisplay();
        this.startTimer();
        $('#word-input').val('');
        $("#submit").on("click", (e) => {
            e.preventDefault();
            this.handleClick(e);
            
        })
        
    }

    handleClick(e) {
        if (this.playing) {
            const input = $('#word-input').val().toLowerCase();
            $('#word-input').val('');
            
            if (input) {
                if (this.words.has(input)) {
                    this.flashMessage("duplicate-word")
                } else {
                    this.checkWord(input) 
                }
                 
            }
        }
        
    }

    async checkWord(input) {
        try {
            let res = await axios.get("/check", { params : { word : input }})
            let result = res.data.result
            this.flashMessage(result)
            if (result === "ok") {
                this.updateScore(input)
                this.addWordToSet(input)
                this.addWordToWordsDisplay(input)
            }
        } catch(error) {
            alert("ERROR CONTACTING SERVER");
        }
    }

    addWordToSet(word) {
        this.words.add(word)
    }

    addWordToWordsDisplay(word) {
        $('#words').append(word + " ")
    }

    startTimer() {
        let timer = setInterval(() => {
            this.time -= 1;
            this.updateTimeDisplay();
            if (this.time === 0) {
                clearInterval(timer)
                this.gameOver();
            }
        }, 1000);
    }

    gameOver() {
        this.playing = false;
        this.checkHighScore();
        this.flashMessage('game-over')
    }

    updateTimeDisplay() {
        $('#timer').text(this.time);
    }

    inWordsSet(word) {
        return this.words.has(word)
    }

    updateScore(word) {
        this.updateScoreData(word.length);
        this.updateScoreDisplay();
    }

    updateScoreData(len) {
        this.score += len;
    }

    updateScoreDisplay() {
        $('#score-label').text(this.score);
    }

    async checkHighScore() {
        try {
            let res = await axios.post("/score", {"score" : this.score })
            if (res.data.newRecord === true) {
                this.flashMessage('new-record')
                $('#high-score').text(this.score);
            }
        } catch {
            alert("ERROR")
        }
    }

    flashMessage(result) {
        if (this.msgTimer) {
            clearTimeout(this.msgTimer)
        }
        let $message = $('#message').removeClass();
        $message.addClass(result).show();
        let message = this.getResultMessage(result);
        $message.text(message);
        this.msgTimer = setTimeout(function() {
            $message.hide();
        }, 2000)
    }

    getResultMessage(result) {
        if (result === "ok") {
            return "WORD ADDED!"
        } else if (result === 'not-word') {
            return "NOT A WORD!"
        } else if (result === 'not-on-board') {
            return "WORD NOT ON BOARD"
        } else if (result === 'new-record') {
            return "NEW RECORD!"
        } else if (result === 'game-over') {
            return "GAME OVER!"
        } else {
            return "WORD ALREADY FOUND!"
        }
    }


}

new Game();