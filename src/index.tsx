import React, {
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import Styles from './SliderStyles';

const {
  Container, TrackContainer, ThumbContainer, EventCatcher,
} = Styles;

// HELPERS
const capNumber = (number: number, min: number, max: number) => {
  if (number < min) return min;
  if (number > max) return max;
  return number;
};
/** converts a value, given max and min, to left-translate in pixels based on total width */
const convertValueToLeftTransform = (value: number, max: number, min: number, totalWidth: number) => {
  const leftOffsetInPercentage = (value - min) / (max - min);
  // CONVERT % TO PIXELS
  return leftOffsetInPercentage * totalWidth;
};

const Slider: FC<Props> = (props: Props) => {
  const {
    max, min, renderTrack, renderThumb, onChange, value, styling,
  } = props;

  // REFS
  const thumbEl = useRef<HTMLDivElement | null>();
  const trackEl = useRef<HTMLDivElement | null>();

  const [leftTranslate, setLeftTranslate] = useState<number>(0);
  const isPointerDown = useRef<boolean>(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const range = max - min;

  const { current: trackDom } = trackEl;
  const { current: thumbDom } = thumbEl;

  // RESIZING WINDOW RE-SLIDES THUMB TO ENSURE IT MAINTAINS RELATIVE POSITION
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  window.onresize = () => setWindowWidth(window.innerWidth);

  // SLIDE THUMB BY SETTING leftTranslate
  useLayoutEffect(() => {
    if (!value || !trackDom) return;

    const trackDimensions = trackDom.getBoundingClientRect();

    const leftTransformFromValue = convertValueToLeftTransform(
      value, max, min, trackDimensions.width,
    );
    // ENSURE LEFT TRANSFORM DEDUCTS thumb's width SO IT NEVER EXTENDS TRACK ON RIGHT SIDE
    const cappedLeftTransform = capNumber(
      leftTransformFromValue, 0, trackDimensions.width,
    );

    setLeftTranslate(cappedLeftTransform);
  }, [max, min, trackEl, value, windowWidth, trackDom]);

  const changeValueBasedOnDrag = useCallback(((clientX: number) => {
    const trackDimensions = trackDom?.getBoundingClientRect();
    const thumbWidth = thumbDom?.getBoundingClientRect().width;
    if (!trackDimensions || !thumbWidth) return;

    const offsetFromLeft = clientX - trackDimensions.left;

    return onChange(capNumber(
      Math.ceil(
        (offsetFromLeft / trackDimensions.width) * range + min,
      ),
      min,
      max,
    ));
  }), [max, min, onChange, range, thumbDom, trackDom]);

  const holdPress = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>,
  ) => {
    // THIS TAKES CARE OF THE SELECT CURSOR IN SAFARI [WE DON'T DO THIS FOR TOUCH EVENTS]
    if (e.cancelable) e.preventDefault();
    isPointerDown.current = true;
    // PREVENT DRAGGING FINGER/POINTER FROM ACTIVATING TEXT SELECT
    document.body.classList.add('no-select');
  };
  const unHoldPress = () => {
    isPointerDown.current = false;
    document.body.classList.remove('no-select');
  };

  // MOUNT/UNMOUNT: WINDOW mouseup LISTENER
  useEffect(() => {
    window.addEventListener('mouseup', unHoldPress);

    return () => window.removeEventListener('mouseup', unHoldPress);
  }, []);

  // FORCE UPDATE AFTER WE GET REF ON MOUNT SO THAT THUMB SLIDES TO INITIAL VALUE
  const assignTrackRef = useCallback((ref) => {
    trackEl.current = ref;
    forceUpdate();
  }, []);
  const assignThumbRef = useCallback((ref) => {
    thumbEl.current = ref;
    forceUpdate();
  }, []);

  return (
    <Container style={styling?.containerStyle} className={styling?.containerClass}>
      <TrackContainer
        ref={assignTrackRef}
        thumbWidth={thumbDom?.getBoundingClientRect().width ?? 0}
        style={styling?.trackStyle}
        className={styling?.trackClass}
      >
        {renderTrack()}
      </TrackContainer>


      <ThumbContainer
        ref={assignThumbRef}
        leftTranslate={leftTranslate}
        style={styling?.thumbStyle}
        className={styling?.thumbClass}
      >
        {renderThumb()}
      </ThumbContainer>

      {/* NOTICE THE MOUSEUP EVENT IS ON WINDOW. THIS IS TO ENSURE DRAG DOESN'T STOP AS POINTER EXITS
       COMPONENT BOUNDS. */}
      <EventCatcher
        onMouseDown={holdPress}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          if (isPointerDown.current) {
            changeValueBasedOnDrag(e.clientX);
          }
        }}
        // TOUCH
        onTouchMove={(e: React.TouchEvent<HTMLDivElement>) => {
          holdPress(e);
          changeValueBasedOnDrag(e.targetTouches[0].clientX);
        }}
        onTouchEnd={unHoldPress}
        onTouchCancel={unHoldPress}
      />
    </Container>
  );
};

type Props = {
  value: number,
  max: number,
  min: number,
  renderTrack: () => JSX.Element | ReactNode;
  renderThumb: () => JSX.Element | ReactNode;
  onChange: (newValue: number) => void;
  // STYLING
  styling?: {
    containerStyle?: CSSProperties,
    trackStyle?: CSSProperties,
    thumbStyle?: CSSProperties,
    containerClass?: string,
    trackClass?: string,
    thumbClass?: string,
  };
};

export default React.memo(Slider);
