from flask import Flask, render_template, request, jsonify
from sendEmail import * 
import os
import requests
from werkzeug.utils import secure_filename
from lerDB import *
app = Flask(__name__)



upload_folder = os.getcwd() + '/uploads'
app.config['UPLOAD_FOLDER'] = upload_folder

@app.route("/getData", methods=["POST"])
def getData():
    print("lendo a função getData")
    try:
        data = request.get_json()
        print("Recebendo dados: ", data)
        if data:
            print(data)
            resultado = buscarDados(data)
            
            return jsonify({"result": resultado}), 200
        return jsonify({"error": "Data not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/index.html')
def index2():
    return render_template('index.html')


if __name__ == '__main__':
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    app.run(debug=True)
