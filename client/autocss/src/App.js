import React, {useState} from "react";
import axios from "axios";
import './App.css'
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const App = () => {
    const [file, setFile] = useState(null);
    const [Css, setCss] = useState('None code')
    const [Fname, SetFname] = useState('')
    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };


    const downloadFile = (filename) => {
        if (filename != ''){
            axios({
                url: `http://localhost:5000/download/${filename}`,
                method: 'GET',
                responseType: 'blob', // 응답 형식을 blob으로 설정합니다.
            }).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                response.headers['content-disposition'] = 'style.css'
                link.setAttribute('download', response.headers['content-disposition']); // 파일 이름을 설정합니다.
                document.body.appendChild(link);
                link.click();
            }).catch((error)=>{
                setCss(error.message)
            })
        }
        else{
            setCss('Send the file and click after receiving the css')
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        await axios
            .post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((res) => {
                setCss(res.data.output)
                SetFname(res.data.file_id)

            }).catch((error)=>{
                setCss(error.message + '\nCheck the console for more information')
            })
        console.log("File uploaded successfully");
    };

    return (
        
        <div className="App">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className="header">
                <a className="title" href="https://github.com/velo1203/Auto-CSS">Auto CSS <FontAwesomeIcon icon={faGithub} className='icon'/></a>
            </div>
            <div className="Main">
                <form onSubmit={handleSubmit} className='file-form'>
                    <label htmlFor="custom-file-input" className="input-label">Choose a file</label>
                    <input
                        className='form-input'
                        id="custom-file-input"
                        type="file"
                        onChange={handleChange}
                        accept='.html'/>
                    <button type="submit" className="submit btn" onClick={()=>{
                        setCss('Loading.. Use Chat GPT..')
                    }}>Submit</button>
                </form>
                <div className="output-main">
                    <div className="output" title="click to download" onClick={()=>{
                        downloadFile(Fname)
                      
                    }}>{Css}</div>
                </div>
            </div>
        </div>
    );
};

export default App;