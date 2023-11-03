import unittest
import os
import requests
from app import app

class TestServer(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        self.test_image_path = 'test1.png'  # Provide the correct image file path

    def test_index_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Browser OCR Extension', response.data)

    def test_upload_image_route(self):
        # Simulate an image upload using requests
        with open(self.test_image_path, 'rb') as image_file:
            response = requests.post(
                'http://localhost:8080/upload',
                files={'image': (os.path.basename(self.test_image_path), image_file)}
            )

        expected_text = "Your Personal Al Study Assistant"
        # expected_text = "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness..."

        expected_text = expected_text.encode('utf-8')
        self.assertEqual(response.status_code, 200)
        self.assertIn(expected_text, response.content)


    def test_missing_image(self):
        response = self.app.post('/upload')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'No image provided', response.data)

    def test_get_image(self):
        response = self.app.get('/image/your_image_filename.jpg')  # Replace with an actual image filename
        self.assertEqual(response.status_code, 404)  # Expect a 404 status code for non-existent images


    def test_get_nonexistent_image(self):
        response = self.app.get('/image/nonexistent.jpg')
        self.assertEqual(response.status_code, 404)

    def test_ocr_extraction(self):
        with open(self.test_image_path, 'rb') as image_file:
            response = requests.post(
                'http://localhost:8080/upload',
                files={'image': (os.path.basename(self.test_image_path), image_file)}
            )

        self.assertEqual(response.status_code, 200)
        extracted_text = response.json().get('text').strip()
        # Replace 'expected_text' with the text you expect from OCR
        expected_text = "Your Personal Al Study Assistant"
        # expected_text = "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness..."

        # Compare the extracted text with the expected text
        if extracted_text != expected_text:
            # If the test fails, print the actual and expected text
            print(f"Actual OCR Extracted Text: {extracted_text}.")
            print(f"Expected Text: {expected_text}.")
            
        self.assertEqual(extracted_text, expected_text, f"OCR extraction test failed. Actual: '{extracted_text}', Expected: '{expected_text}'")


if __name__ == '__main__':
    unittest.main()
