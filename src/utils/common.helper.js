const _lang = require("./lang");


const jwtErorr = (message, req) => {
  let errMessage = ''
  switch (message) {
    case 'jwt expired':
      errMessage = _lang('token_expired', req.client_lang);
      break
    case 'jwt malformed':
      errMessage = _lang('token_malformed', req.client_lang);
      break
    case 'invalid token':
    default:
      errMessage = _lang('token_invalid', req.client_lang);
      break
  }
  return errMessage
}
const  setZeroPrefix=(val, length = 3) =>{
  let temp = val.toString()
  while (temp.length < length) {
    temp =  `0${temp}`;
  } 
  return temp;
}
const generateValidationError = (msg, param = 'field') => {
    return [{
        msg,
        param
    }]
}
module.exports = { generateValidationError,jwtErorr,setZeroPrefix }