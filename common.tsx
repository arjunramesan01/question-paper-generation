export function getAllAssesments(){
    return fetch('https://assessed.co.in:9080/api/v3/teacher/dashboard/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MWM0NWM3ZDE3YjBjOWU0NTBlMTQ3ODQiLCJyb2xlIjoidGVhY2hlciIsInRpbWVzdGFtcCI6IjIwMjEtMTItMjdUMDY6Mjg6MDYuMTEzWiIsImlhdCI6MTY0MDU4NjQ4Nn0.sWlR6mPYKMo4ZtUFmEgNBtPNAK1yZEO5Nzjm5L_SF_U'
        },
    });
}

export function getQuestionPaperDetails(id:any){
    return fetch('https://assessed.co.in:9080/api/teacher/paper/details/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MWM0NWM3ZDE3YjBjOWU0NTBlMTQ3ODQiLCJyb2xlIjoidGVhY2hlciIsInRpbWVzdGFtcCI6IjIwMjEtMTItMjdUMDY6Mjg6MDYuMTEzWiIsImlhdCI6MTY0MDU4NjQ4Nn0.sWlR6mPYKMo4ZtUFmEgNBtPNAK1yZEO5Nzjm5L_SF_U'
        },
    });
}