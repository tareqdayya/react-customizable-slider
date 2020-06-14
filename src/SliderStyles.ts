import styled from 'styled-components';

type TrackProps = { thumbWidth: number };
type ThumbProps = { leftTranslate?: number };

export default {
  Container: styled.div`
    position: relative;
    min-height: 40px;
    // ENSURE TRACK AND THUMB CONTAINERS CENTERED
    display: flex;
    align-items: center;
    //border: 1px solid rgba(8,255,0,0.27);
  `,
  TrackContainer: styled.div.attrs<TrackProps>((props) => ({
    style: {
      // WE'RE LEAVING 1/2 A THUMB'S WIDTH ON EACH SIDE OF THE TRACK
      width: `calc(100% - ${props.thumbWidth}px)`,
    },
  }))<TrackProps>`
    margin: auto;
    //background-color: rgba(255,255,0,0.36);
  `,
  ThumbContainer: styled.div.attrs<ThumbProps>((props) => ({
    style: {
      transform: `translateX(${props.leftTranslate}px)`,
    },
  }))<ThumbProps>`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    // ENSURE THUMB CENTERED
    display: flex;
    align-items: center;
    //background-color: rgba(255,0,0,0.27);
  `,
  EventCatcher: styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
  `,
};
