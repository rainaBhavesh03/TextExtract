# TextExtract

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Running](#installation-and-running)
- [Usage](#usage)
- [License](#license)

## About

The **TextExtract** is my attempt at designing a handy browser extension to perform text extraction from screenshots. Whether you need to extract code snippets, paragraphs, or other text elements, this extension provides a user-friendly way to capture screenshots and perform Optical Character Recognition (OCR).

Key features of the extension include:

- **Screenshot Capture**: Easily capture a screenshot of your current web page with a single click.

- **Text Extraction**: Perform OCR to extract text content from the captured screenshot.

- **Manual Annotation**: Manually select the area to extract text, making it flexible for various content types.

- **Browser Compatibility**: Compatible with popular browsers like Chrome and Firefox.

By simplifying the text extraction process, this extension can save you time and effort, whether you're a developer extracting code or someone collecting information from web pages.

Explore the usage instructions below to get started with the TextExtract and improve your text extraction workflow.

## Getting Started

Follow these steps given below to locally run the extension. (I am yet to host the server, hence need to locally run the server)

### Prerequisites

Before running this project, make sure you have the necessary libraries and tools installed:

- Python 3.x
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)

You can install the required Python library using pip:

```shell
pip install pytesseract
```

### Installation and Running

1. Clone the repository:
   ```sh
   git clone https://github.com/rainaBhavesh03/TextExtract.git
   ```

2. Run the server
   ```sh
   cd server
   python app.py
   ```

3. Load the extension in the browser.
   - Open the 'Manage Extensions' setting for your Chrome browser.
   - Click the 'Load unpacked' button and select the directory that contains the 'manifest.json' file - in this case 'extension' directory

## Usage
Now you can use the extension from the 'Extensions' menu by clicking on it.  
You can select the area from the screenshot over which OCR is to be performed.  
Over the screenshot:
1. First click to set the starting point.  
2. Move your mouse to the end point and then click again.
Then just click the Perform OCR button and you get the extracted text displayed below!!

## License
This project is licensed under the MIT License - see the LICENSE file for details.