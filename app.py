from flask import Flask, jsonify, request
from flask_cors import CORS
from flask.helpers import send_from_directory
import io
import base64
import pandas as pd
import numpy as np
import tensorflow as tf
from PIL import Image
import re

file = pd.HDFStore('dogcat_test_full.h5')
model = tf.keras.models.load_model(file)

def prepare_image(img):
    img = Image.open(io.BytesIO(img))
    img = img.resize((150,150))
    img = np.array(img)
    img = np.expand_dims(img, 0)
    img =img/255.0
    return img

class_name = ['dog','cat']
def predict_result(img):
    first_num = 1 if model.predict(img)[0][0] > 0.5 else 0
    #second_num = 1 if model.predict(img)[0][1] > 0.5 else 0
    if first_num == 1 :
        return class_name[1],model.predict(img)[0][0]
    elif first_num == 0 :
        return class_name[0],model.predict(img)[0][1]

# def show_result(img):
#     return class_name[predict_result(img)]
def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

app = Flask(__name__, static_folder='my-app/build',static_url_path='')
CORS(app)

@app.route('/predict', methods=['POST'])
def infer_image():
    if 'file' not in request.files:
        return "Please try again. The Image doesn't exist"

    file = request.files.get('file')

    if not file:
        return

    img_bytes = file.read()
    img = prepare_image(img_bytes)
    prediction, score = predict_result(img)
    score = round(score,4)
    return _corsify_actual_response(jsonify(prediction=prediction,score=str(score)))

@app.route('/loadimage', methods=['POST'])
def load_image():
    # if 'file' not in request.files:
    #     return "Please try again. The Image doesn't exist"
    file = request.form
    file = file['file']
    # request.base_url.get
    if not file:
        return

    img_bytes = re.sub('^data:image/.+;base64,', '', file)
    img = base64.b64decode(img_bytes)
    img = Image.open(io.BytesIO(img))
    img = img.resize((150,150))
    img = np.array(img)
    img = np.expand_dims(img, 0)
    img =img/255.0
    print(img.shape)
    prediction, score = predict_result(img)
    score = round(score,4)
    return _corsify_actual_response(jsonify(prediction=prediction,score=str(score)))



@app.route('/api',methods=['GET'])
#@cross_origin
def index():
    return 'Machine Learning Inference'


@app.route('/')
#@cross_origin
def serve():
    return send_from_directory(app.static_folder,'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')