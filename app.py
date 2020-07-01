# Jon Compton
# Springboard May 26 Cohort

from flask import Flask, render_template, request, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "123456"
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def game_page():
    board = boggle_game.make_board()
    session['board'] = board
    game_plays = session.get('game_plays', 0)
    high_score = session.get('high_score', 0)
    return render_template('game.html', board=board, high=high_score, plays=game_plays)

@app.route("/check")
def check_word():
    board = session['board']
    word = request.args['word']
    result = boggle_game.check_valid_word(board, word)
    return jsonify({ "result" : result })

@app.route("/score", methods=['POST'])
def check_score():
    game_score = request.json['score']
    high_score = session.get('high_score', 0)
    game_plays = session.get('game_plays', 0)
    session['game_plays'] = game_plays + 1
    new_record = False
    if game_score > high_score:
        new_record = True
        session['high_score'] = game_score
    return jsonify(newRecord = new_record)
