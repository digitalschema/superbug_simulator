# superbug_simulator
**Enhanced Superbug Simulator**

The Enhanced Superbug Simulator is a web application designed to visualize the growth and resistance development of bacterial populations when exposed to different antibiotics and environmental factors. This simulation tool is ideal for educational and research purposes, providing insights into how superbugs (antibiotic-resistant bacteria) evolve under various conditions. Users can interact with the simulator through control panels to adjust bacterial species, antibiotic types, environmental factors, and growth/mutation rates. The application provides real-time visualizations, including population growth, resistance level distribution, environmental impact, and more.

**Features**
Interactive Bacterial Growth Simulation: Select from a variety of bacterial species and control the primary and secondary antibiotics applied.
Environmental Controls: Adjust temperature, pH levels, growth rate, and mutation rate to see how environmental factors impact bacterial resistance.
Analytics and Visualizations:
Resistance Level Distribution: Shows resistance levels across the bacterial population.
Population Growth Over Time: Tracks the bacterial population as it grows.
Resistance Mechanisms: Lists active resistance mechanisms within the population.
Environmental Impact Visualization: Displays how temperature and pH affect bacterial growth.
Frequency Heat Map: Illustrates bacterial density across a simulated petri dish.
Antibiotic Gradient Visualization: Shows the concentration gradient of antibiotics across the simulation space.

**Getting Started**

Prerequisites
To run this application locally, ensure you have the following installed:

Python 3.7+
Flask: Web framework for Python

Setup Instructions
Clone the Repository

bash

git clone https://github.com/yourusername/superbug_simulator.git
cd superbug_simulator
Install Required Python Packages

bash

pip install flask
Run the Application

Start the app with the following command:
bash

python app.py
By default, the app runs on http://localhost:5000.

**Access the Application**

Open your web browser and go to http://localhost:5000 to start interacting with the Enhanced Superbug Simulator.
Optional: Setting Up with Nginx
If you want to make the app accessible via the default HTTP port (80), you can set up an Nginx configuration to forward traffic from port 80 to port 5000.

Now, users can access the app via[ [http://your_domain_or_ip](https://smilecoach2.seedsofempowerment.org)](https://smilecoach2.seedsofempowerment.org/)

Directory Structure
app.py: Main Flask application file, containing the routes and logic for the web server.
templates/: Contains HTML templates for the main simulator page (index.html) and the interaction matrix page (matrix.html).
static/: Holds static files, including JavaScript (script.js and matrix.js) for the simulation and matrix interactions, and CSS (style.css) for styling.

