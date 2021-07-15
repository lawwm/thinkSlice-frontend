import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner.js";
import { Container, Col, Row, ProgressBar, Spinner, Form } from "react-bootstrap";

import * as UpChunk from '@mux/upchunk'
import axios from 'axios'
import "../styles.css";
import { setAlert } from "../../store/components/action"
import { startUpload, endUpload, setVideoLoading } from "../../store/home/action.js";
import { getProfile } from "../../store/profile/action"

const subjects = [
    "Arts",
    "Biology",
    "Business",
    "Chemistry",
    "Computing",
    "Cooking",
    "Crafting",
    "Health",
    "Humanities",
    "Language",
    "Math",
    "Music",
    "Physics",
    "Sports",
    "Visual Arts",
];

const Upload = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const { loading } = useSelector((state) => state.auth);
    const { isUploading } = useSelector((state) => state.home)
    const { profile, profileLoading } = useSelector((state) => state.profile)
    const [progressState, setProgressState] = useState(0)

    const userId = localStorage.getItem("user")
    useEffect(() => {
        //if profile is already loaded for current user, do not call API
        if (profile === null) {
            dispatch(getProfile(userId));
        } else if (userId !== profile.basic.user.toString()) {
            dispatch(getProfile(userId));
        }
    }, [dispatch, userId, profile])

    const uploadFile = (videoFile) => {
        let url_id = ''
        const getUploadUrl = async () => {
            try {
                const res = await axios.post('/api/videos/assets')
                url_id = res.data.id
                return res.data.url
            } catch (err) {
                setProgressState(0)
                dispatch(setAlert('Error getting an upload URL', "danger"))
                dispatch(endUpload())
            }
        };

        const upload = UpChunk.createUpload({
            endpoint: getUploadUrl,
            file: videoFile,
            chunkSize: 5120, // Uploads the file in ~5mb chunks
        });

        // subscribe to events
        upload.on('error', err => {
            setProgressState(0)
            dispatch(endUpload())
            dispatch(setAlert("Failed to upload video", "danger"))
            // console.error('💥 🙀', err.detail);
        });

        upload.on('progress', progress => {
            setProgressState(progress.detail)
            // console.log(`So far we've uploaded ${progress.detail}% of this file.`);
        });

        upload.on('success', async () => {
            // console.log("Wrap it up, we're done here. 👋");
            setProgressState(100)

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            try {
                const body = JSON.stringify(videoData)
                const res = await axios.post('/api/videos/assets/' + url_id, body, config)
                dispatch(endUpload())
                dispatch(setAlert("Successfully uploaded video", "success"))
                setProgressState(0)
                dispatch(setVideoLoading())
                history.push("/watch/" + res.data.id)
            } catch (err) {
                dispatch(endUpload())
                dispatch(setAlert("Failed to upload video", "danger"))
                setProgressState(0)
            }
        });

    };

    const [videoData, setVideoData] = useState({
        video_title: "",
        subject: "",
        video_description: "",
        duration: 0
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
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // validate fields
        const existingSubjects = profile.basic.video.map(video => video.subject)
        if (existingSubjects.includes(videoData.subject)) {
            dispatch(setAlert("You have already uploaded a video for this subject", "danger"))
        }
        if (videoData.title === '' || videoData.subject === '' || videoData.description === '') {
            //console.log("Your fields are not validated")
            dispatch(setAlert("There are empty fields remaining", "danger"))
        } else if (file === null || videoData.duration === null) {
            dispatch(setAlert("You have not uploaded any files", "danger"))
        } else if (videoData.duration > 60) {
            dispatch(setAlert("Your video file exceeds 60 seconds", "danger"))
            // } else if (vid.duration < 10) {
            //     dispatch(setAlert("Your video file is too short", "danger"))
        } else if (!profile.basic.is_tutor) {
            dispatch(setAlert("Only tutors are authorized to upload videos", "danger"))
        } else {
            dispatch(setAlert("Uploading video... do not leave page", "success"))
            // console.log("beginning uploading file")
            dispatch(startUpload())
            uploadFile(file)
        }
    }
    return (
        <>
            {loading && <LoadingSpinner />}
            {!loading && (
                <>
                    {profileLoading && <LoadingSpinner />}
                    {!profileLoading && (
                        <Container>
                            <div className="upload-div">
                                <h2>Create a video.</h2>
                                <form id="uploadbanner" encType="multipart/form-data" onSubmit={e => onSubmit(e)}>
                                    <Row>
                                        <Col xs={12} md={8} xl={7}>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Control
                                                    type="text"
                                                    name="video_title"
                                                    className="form-control"
                                                    placeholder="Title"
                                                    onChange={(e) => onChange(e)}
                                                    value={videoData.video_title}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="exampleForm.ControlSelect1">
                                                <Form.Control
                                                    type="text"
                                                    name="subject"
                                                    className="form-control"
                                                    placeholder="Subject"
                                                    onChange={(e) => onChange(e)}
                                                    value={videoData.subject}
                                                    as="select">
                                                    <option value="Subject">Subject</option>
                                                    {subjects.map((subject, index) => {
                                                        return (
                                                            <option key={index} value={subject}>{subject}</option>
                                                        )
                                                    })}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                                <Form.Control
                                                    placeholder="Description"
                                                    as="textarea"
                                                    name="video_description"
                                                    className="form-control"
                                                    onChange={(e) => onChange(e)}
                                                    value={videoData.video_description}
                                                    required
                                                    rows={4} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
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
                                    <Row >
                                        <Col md={8}>
                                            <div className="progress-bar-div">
                                                {isUploading && <ProgressBar
                                                    striped
                                                    className="custom-progress-bar"
                                                    now={progressState} />}
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <button
                                                type="submit"
                                                value="Submit"
                                                className="btn btn-danger btn-alt-custom upload-btn-size"
                                                onSubmit={e => onSubmit(e)}
                                            >
                                                {isUploading
                                                    ? <Spinner size="sm" animation="border" variant="light" />
                                                    : <div>Submit</div>
                                                }
                                            </button>
                                        </Col>
                                    </Row>
                                </form>
                                {file && (
                                    <video
                                        controls={true}
                                        width="250"
                                        className="upload-video-helper"
                                        onLoadedMetadata={e => {
                                            // setMetadata({
                                            //     videoHeight: e.target.videoHeight,
                                            //     videoWidth: e.target.videoWidth,
                                            //     duration: e.target.duration
                                            // });
                                            setVideoData({
                                                ...videoData,
                                                duration: e.target.duration
                                            })
                                        }}
                                    >
                                        <source src={URL.createObjectURL(file)}
                                            type="video/mp4" />
                                    </video>
                                )}
                            </div>
                        </Container>)}
                </>
            )}

        </>
    );
};

export default Upload;
