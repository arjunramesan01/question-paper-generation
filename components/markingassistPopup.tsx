// @ts-nocheck
import { useState } from "react"
import styles from '../styles/question-paper.module.css'
import { MathJax, MathJaxContext } from "better-react-mathjax";

const MarkingAssistPopup = (data:any) => {
    var [steps, setSteps] = useState(data.rubrics);
    const mathjaxConfig = {
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
    }
    
    return (
        <>
        <div className={styles.markingAsssistDiv}>
            <div>
                <b>Answer</b>
            </div>
            <div>
                <b>Marks</b>
            </div>
        </div>
        <MathJaxContext version={2} config={mathjaxConfig}>
            <MathJax>
            {steps.map((el,i) =>
            <div key={'ma_' + i} className={styles.markingAsssistDiv}>
                    <div dangerouslySetInnerHTML={{ __html: el['step']}}>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: el['marks']}}>
                    </div>
            </div>
            )}
            </MathJax>
        </MathJaxContext>
        </>
    )
}

export default MarkingAssistPopup