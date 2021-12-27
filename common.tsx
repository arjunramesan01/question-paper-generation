export function getAllAssesments(){
    return fetch('http://13.127.187.194:9000/api/teacher/dashboard/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OWU1NzllNDljY2E5MGVhMWJiMThiNDEiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTY0MDI2NDM1MX0.IwaH55dg-dc06tVzIqS7L6BVaKmq5qOv_5EDlZvU5w0'
        },
    });
}

export function getQuestionPaperDetails(id:any){
    return fetch('http://13.127.187.194:9000/api/teacher/paper/details/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OWU1NzllNDljY2E5MGVhMWJiMThiNDEiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTY0MDI2NDM1MX0.IwaH55dg-dc06tVzIqS7L6BVaKmq5qOv_5EDlZvU5w0'
        },
    });
}
