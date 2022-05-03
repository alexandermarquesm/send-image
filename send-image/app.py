from flask import Flask, redirect, render_template, request
from werkzeug.utils import secure_filename
from .sendemail import Email
import os

path = 'send-image/static/images/'


def create_app():
    app = Flask(__name__, static_folder='static', template_folder='template')

    @app.route('/')
    def index():
        return render_template('upload.html')

    @app.route('/uploader', methods=['POST'])
    def uploader():
        if request.files['file'].mimetype in ["image/png", "image/jpg", "image/jpeg"]:
            file = request.files['file']
            ext = file.filename.split('.')[-1]
            full_path = path + secure_filename(file.filename)

            file.save(full_path)

            email = Email(Subject='Sendfiles', To=request.form['email'],
                          Message='Image', filename=file.filename, ext=ext, path=full_path)
            email.enviar()

            os.remove(full_path)
            return redirect('/', code=200)

        return redirect('/', code=404)

    return app
