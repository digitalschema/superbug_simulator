from flask import Flask, render_template, request, jsonify
import logging
import os

app = Flask(__name__)

# Set up logging for debugging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Page not found"}), 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f"Server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

# Server startup
if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        logger.error(f"Server startup error: {str(e)}")
