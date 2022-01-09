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

export function getIntent(text:any){
    return fetch('http://44.200.171.242:5600/byjus/ml/universal_search/v0/intent_detection/?text=' + text, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function getEntity(text:any){
    return fetch('http://44.200.171.242:5600/byjus/ml/universal_search/v0/entity_extraction/?text=' + text, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function titleGenerator(text:any){
    try{
        var n_text = text.replace(/-/g, ' ');
        n_text = n_text.replace('(Series _),Code _', '');
        return n_text
    }
    catch(err){
      return text
    }
  }
  

