// include the video.js kit javascript and css
import videojs from '@mux/videojs-kit';
import '@mux/videojs-kit/dist/index.css';

const Video = () => {
    return (
        <>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
            <video 
              id="my-player" 
              class="video-js vjs-16-9" 
              controls 
              preload="auto" 
              width="100%"
              data-setup='{}'
            >
              <source src="6uIassLU99NqB01quldCucZNrMTQSRSCJE3tduW24sQI" type="video/mux" />
            </video>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <img src="https://image.mux.com/6uIassLU99NqB01quldCucZNrMTQSRSCJE3tduW24sQI/thumbnail.png?width=400&height=200&fit_mode=smartcrop&time=35" alt="Italian Trulli"></img>
        </>
    )
}

export default Video