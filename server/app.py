# importing the required modules
from flask import Flask, request, jsonify, render_template
from markupsafe import Markup
from PIL import Image
import pytesseract
import io
import base64
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        data = request.get_json()
        if 'image' in data and 'area' in data:

            extracted_text = process_image(data['image'], data['area'])
            
            extracted_text = Markup(extracted_text)
            return jsonify({'text': extracted_text})
        else:
            return jsonify({'error': 'Invalid data format'})

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        return jsonify({'error': 'Error processing image'}), 500


def process_image(image_data, selected_area):
    try:
        image_binary = base64.b64decode(image_data.split(',')[1])
        img = Image.open(io.BytesIO(image_binary))

        x, y, width, height = selected_area['x'], selected_area['y'], selected_area['width'], selected_area['height']
        cropped_img = img.crop((x, y, x + width, y + height))

        extracted_text = pytesseract.image_to_string(cropped_img)

        extracted_text = extracted_text.replace('\n', '<br data-manual="true">')
        return extracted_text

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        return "Error processing image"



@app.route('/image/<filename>')
def get_image(filename):
    try:
        with open(f'server/screenshots/{filename}', 'rb') as image_file:
            return image_file.read()
    except FileNotFoundError:
        return 'Image not found', 404



if __name__ == '__main__':
    app.run(debug=True, port=8080)
