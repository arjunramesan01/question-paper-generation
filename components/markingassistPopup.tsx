import { useState } from "react"
import styles from '../styles/question-paper.module.css'
import { MathJax, MathJaxContext } from "better-react-mathjax";

const MarkingAssistPopup = (data) => {
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
        {steps.map((el,i) =>
        <>
        <MathJaxContext version={2} config={mathjaxConfig}>
            <MathJax>
            <div className={styles.markingAsssistDiv}>
                    <div dangerouslySetInnerHTML={{ __html: el['step']}}>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: el['marks']}}>
                    </div>
            </div>
            </MathJax>
        </MathJaxContext>
        </>
        )}
        </>
    )
}

export default MarkingAssistPopup