// @ts-nocheck
import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
  "fast-preview": {
    disabled: true
  },
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  },
  messageStyle: "none"
};



export default function App() {
  const [num, setNum] = useState(null);

  function convert(){
    var text = document.getElementById('textArea').value
    setNum(() => text)
}

  return (
    <div style={{padding:'2rem'}} >
    <br></br>
    <br></br>
    <textarea style={{width:'100%'}} id="textArea" rows={10} placeholder="Input text here....">

    </textarea>
    <br></br>
    <br></br>
    <button onClick={() => convert()}>
    Convert
    </button>
    <br></br>
    <br></br>
    <MathJaxContext version={2} config={config} onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}>
        <MathJax hideUntilTypeset={"first"} inline dynamic>
            {num}
        </MathJax>
    </MathJaxContext>
    </div>
  );
}
