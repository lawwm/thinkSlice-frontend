import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Container, Col, Row } from "react-bootstrap";

import NavBar from "../../components/NavBar.js";
import * as UpChunk from '@mux/upchunk'
import axios from 'axios'
import "../styles.css";

const Upload = () => {
    const { loading } = useSelector((state) => state.auth);

    const uploadFile = (videoFile) => {
        let url_id = ''
        const getUploadUrl = async () => {
            try {
                const res = await axios.post('/api/videos/assets')
                url_id = res.data.id
                return res.data.url
            } catch (err) {
                console.log('Error getting an upload URL', err)
            }
        };

        const upload = UpChunk.createUpload({
            endpoint: getUploadUrl,
            file: videoFile,
            chunkSize: 5120, // Uploads the file in ~5mb chunks
        });

        // subscribe to events
        upload.on('error', err => {
            console.error('💥 🙀', err.detail);
        });

        upload.on('progress', progress => {
            console.log(`So far we've uploaded ${progress.detail}% of this file.`);
        });

        upload.on('success', async () => {
            console.log("Wrap it up, we're done here. 👋");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            try {
                const body = JSON.stringify(videoData)
                const res = await axios.post('/api/videos/assets/' + url_id, body, config)
                console.log(res)
            } catch (err) {
                console.log(err)
            }
        });

    };

    const [videoData, setVideoData] = useState({
        video_title: "",
        subject: "",
        video_description: "",
    });

    const [fileName, setFileName] = useState("")
    const [file, setFile] = useState(null)

    const onChange = (e) => {
        setVideoData({
            ...videoData,
            [e.target.name]: e.target.value,
        });
    };

    const onUploadChange = (videoFile) => {
        setFileName(videoFile.name)
        setFile(videoFile)
        console.log(videoFile)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        //validate fields
        if (videoData.title == '' || videoData.subject == '' || videoData.description == '' || file == null) {
            console.log("Your fields are not validated")
        } else {

            console.log("beginning uploading file")
            uploadFile(file)
        }
    }

    return (
        <>
            {loading && <LoadingSpinner />}
            {!loading && (
                <>
                    <NavBar />
                    <Container>

                        <div>

                            <h2>Create a video.</h2>

                            <form id="uploadbanner" encType="multipart/form-data" onSubmit={e => onSubmit(e)}>

                                <div className="form-group row">
                                    <input
                                        type="text"
                                        name="video_title"
                                        className="form-control"
                                        placeholder="Title"
                                        onChange={(e) => onChange(e)}
                                        value={videoData.video_title}
                                        required
                                    />
                                </div>
                                <div className="form-group row">
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-control"
                                        placeholder="Subject"
                                        onChange={(e) => onChange(e)}
                                        value={videoData.subject}
                                        required
                                    />
                                </div>
                                <div className="form-group row">
                                    <textarea
                                        type="textarea"
                                        name="video_description"
                                        className="form-control"
                                        placeholder="Description"
                                        onChange={(e) => onChange(e)}
                                        value={videoData.video_description}
                                        required
                                    />
                                </div>
                                <div className='upload-layout'>
                                    <div>
                                        <label htmlFor="file-upload" className='custom-file-upload btn btn-danger' >
                                            Select File
                                        </label>
                                        <input id="file-upload" name='file-upload' type="file" onChange={(e) => onUploadChange(e.target.files[0])} />
                                    </div>
                                    <div className='upload-filename'>
                                        {fileName}
                                    </div>
                                </div>
                                <hr className='upload-break' />
                                <button
                                    type="submit"
                                    value="Submit"
                                    className="btn btn-danger btn-alternative-custom"
                                    onSubmit={e => onSubmit(e)}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>


                    </Container>
                </>
            )}
        </>
    );
};

export default Upload;
