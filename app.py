from flask import Flask, render_template, request, jsonify
import sqlite3
import logging
import os

app = Flask(__name__)

# Set up logging for debugging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Database initialization function
def init_db():
    try:
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bingo.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                square_id TEXT,
                response TEXT
            )
        ''')
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise

# Route to render the main simulator page
@app.route('/')
def home():
    """Render the main simulator page"""
    return render_template('index.html')

# Route to render the interaction matrix page
@app.route('/matrix')
def matrix():
    """Render the interaction matrix page"""
    return render_template('matrix.html')

# API route to save user responses
@app.route('/save_response', methods=['POST'])
def save_response():
    """Save a user's response to a simulation"""
    try:
        data = request.get_json()
        logger.debug(f"Received data: {data}")
        
        if not data:
            return jsonify({"error": "No data received"}), 400

        square_id = data.get('square_id')
        response = data.get('response')

        if not square_id or not response:
            return jsonify({"error": "Missing required fields"}), 400

        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bingo.db')
        logger.debug(f"Database path: {db_path}")
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO responses (square_id, response) VALUES (?, ?)",
            (square_id, response)
        )
        conn.commit()
        conn.close()

        logger.info(f"Response saved successfully for square_id: {square_id}")
        return jsonify({"message": "Response saved successfully!"}), 200

    except Exception as e:
        logger.error(f"Error saving response: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Route to initialize the database when the application starts
@app.before_first_request
def setup():
    init_db()

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Page not found"}), 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f"Server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Server startup error: {str(e)}")

