// include the video.js kit javascript and css
import videojs from '@mux/videojs-kit';
import '@mux/videojs-kit/dist/index.css';
import { Nav, Container } from 'react-bootstrap';
import NavBar from "../../components/NavBar.js";
import Thumbnail from "../../components/Thumbnail";

const Video = () => {
  return (
    <>
      <NavBar />
      <Container>
        <video
          id="my-player"
          class="video-js vjs-16-9 vjs-matrix"
          controls
          preload="auto"
          width="100%"
          data-setup='{}'
        >
          <source src="6uIassLU99NqB01quldCucZNrMTQSRSCJE3tduW24sQI" type="video/mux" />
        </video>
        {/* <img src="https://image.mux.com/6uIassLU99NqB01quldCucZNrMTQSRSCJE3tduW24sQI/thumbnail.png?width=400&height=200&fit_mode=smartcrop&time=35" alt="Italian Trulli"></img> */}
      </Container>
      <Container style={{ marginTop: '200px' }}>
        <Thumbnail
          title="Cooking with Biden"
          username="Joe Biden"
          views="14k"
          subject="Math"
          date="1 week ago"
          playback_id="XBnFO9PnFA2NGvbQuHR501eUKFYz7b00kND43DyqFTK4A"
        />
      </Container>

    </>
  )
}

export default Video