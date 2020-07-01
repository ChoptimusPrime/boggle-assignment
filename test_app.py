# Jon Compton
# Springboard May 26 Cohort

from unittest import TestCase
from flask import session
from app import app
from boggle import Boggle

app.config['TESTING'] = True

class AppTestCase(TestCase):

    def test_game_page(self):
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertIn('<div id="playfield">', html)

    def test_score_post_not_record(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['high_score'] = 160000
            res = client.post('/score', json={"score" : 2})
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json, {"newRecord" : False})

    def test_score_post_new_record(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['high_score'] = 34
            res = client.post('/score', json={"score" : 35})
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json, {"newRecord" : True})


    def test_session_check_on_board(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [
                    ["T", "O", "V", "N", "J"],
                    ["R", "I", "B", "Q", "U"],
                    ["E", "M", "L", "W", "A"],
                    ["F", "O", "I", "X", "B"],
                    ["V", "E", "C", "P", "A"]
                    ]
            res = client.get('/check?word=tire')
            self.assertEqual(res.json['result'], 'ok')

            res = client.get('/check?word=dfdasdfdf')
            self.assertEqual(res.json['result'], 'not-word')

            res = client.get('/check?word=missing')
            self.assertEqual(res.json['result'], 'not-on-board')