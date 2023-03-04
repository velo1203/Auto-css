from flask import Flask, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import openai
import uuid
import googletrans

openai.api_key = ""
translator = googletrans.Translator()
# Set up the model and prompt
model_engine = "text-davinci-003"
app = Flask(__name__)
CORS(app)

def useGPT(html):
    print(html)
    prompt = f'{html} Initialize css and design it'


    # Generate a response
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    response = completion.choices[0].text
    return response

@app.route("/upload", methods=["POST"])
def upload():
    print('open file')
    file = request.files["file"]
    # Do something with the file, for example, save it to disk
    file_id = str(uuid.uuid1().int)
    filename = secure_filename(file.filename)
    file.save(filename)
    f = open(filename)
    html = f.read()

    response = useGPT(html)

    f.close()
    print('use GPT')
    f = open(f'./css/{file_id}.css', 'w')
    f.write(response)
    f.close()
    return {'output':response,'file_id':file_id}


@app.route('/download/<path:filename>', methods=['GET'])
def download(filename):
    print(filename)
    PATH=f'./css/{filename}.css'
    return send_file(PATH,as_attachment=True)

if __name__ == "__main__":
    app.run()
