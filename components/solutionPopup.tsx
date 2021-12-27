const SolutionPopup = (data) => {
    return (
        <>
         <div dangerouslySetInnerHTML={{ __html: data.clickedSolution}}></div>
        </>
    )
}

export default SolutionPopup