// @ts-nocheck
import { MathJax, MathJaxContext } from "better-react-mathjax";

const SolutionPopup = (data) => {
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
        <MathJaxContext version={2} config={mathjaxConfig}>
            <MathJax>
            <div dangerouslySetInnerHTML={{ __html: data.clickedSolution}}></div>
            </MathJax>
        </MathJaxContext>
        </>
    )
}

export default SolutionPopup