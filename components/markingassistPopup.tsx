import { useState } from "react"
import styles from '../styles/question-paper.module.css'

const MarkingAssistPopup = (data) => {
    var [steps, setSteps] = useState(data.rubrics);

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
          <div className={styles.markingAsssistDiv}>
                <div dangerouslySetInnerHTML={{ __html: el['step']}}>
                </div>
                <div dangerouslySetInnerHTML={{ __html: el['marks']}}>
                </div>
          </div>
        </>
        )}
        </>
    )
}

export default MarkingAssistPopup