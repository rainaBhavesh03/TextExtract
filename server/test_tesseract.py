from PIL import Image
import pytesseract

# Load an image using PIL (Python Imaging Library)
image = Image.open('test1.png')  # Replace with the path to your image

# Perform OCR on the image
extracted_text = pytesseract.image_to_string(image)

# Display the extracted text
print("Extracted Text:")
print(extracted_text)


# Load an image using PIL (Python Imaging Library)
image2 = Image.open('image.png')  # Replace with the path to your image

# Perform OCR on the image
extracted_text2 = pytesseract.image_to_string(image2)

# Display the extracted text
print("Extracted Text:")
print(extracted_text2)
