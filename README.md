# React Customizable Slider
- A slider component which doesn't make assumptions about the slider's UI parts. This component has
 no 
UI of its own! it provides the logic, and you can create any thumb and track components
you wish to use. 
- Tested on Web and mobile browsers.

## Basic Implementation:

    const MyComponent = () => {
       const [value, setValue] = useState<number>(100);
     
       return (
         <div style={{ width: 300 }}>
           <Slider
             max={200}
             min={50}
             value={value}
             renderTrack={() => <div style={{ height: 2, background: '#c7c7c7', width: '100%' }} />}
             renderThumb={() => <div style={{ height: 15, width: 15, borderRadius: 50, background: 'blue' }} />}
             onChange={setValue}
           />
     
           <h4>{value}</h4>
         </div>
       );
     };
 
The props used in the example above are **all required!**

There's an optional styling prop: <br/>
`  styling?: {
     containerStyle?: CSSProperties,
     trackStyle?: CSSProperties,
     thumbStyle?: CSSProperties,
     containerClass?: string,
     trackClass?: string,
     thumbClass?: string,
   };
   `

* It's best to control the slider's width by controlling the dimensions of the slider's parent
 container.
* PRs are welcome.

###Enjoy!
