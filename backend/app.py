from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dummy college data (you can later connect dataset)
colleges = [
    {
        "name": "COEP Pune",
        "cutoff": 99,
        "fees": 85000,
        "branch": "CSE",
        "location": "Pune"
    },
    {
        "name": "VIT Pune",
        "cutoff": 95,
        "fees": 150000,
        "branch": "CSE",
        "location": "Pune"
    },
    {
        "name": "PICT Pune",
        "cutoff": 97,
        "fees": 120000,
        "branch": "CSE",
        "location": "Pune"
    }
]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    percentile = data.get("percentile")
    budget = data.get("budget")

    results = []

    for college in colleges:
        if percentile >= college["cutoff"] - 5:  # simple logic
            if budget is None or college["fees"] <= budget:
                results.append(college)

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)