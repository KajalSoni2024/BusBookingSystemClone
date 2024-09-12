export const  onlyChars = (value)=>{
    if(value!=""){
     return /^([^0-9]+)$/.test(value)?true:false
    }
    return true;
}

export const isSpecialChar = (value)=>{
    if(value!=""){
   return value.includes('@'||'#'||'$'||'%'||'*');
    }
    return true;
}
export const isFirstLetterCapital = (value)=>{
  if(value!=""){
  return /^[A-Z]/.test(value)?true:false;
  }
  return true;
}
export const isPhoneNumber = (value)=>{
if(value!=""){
return /^[0-9]{10}$/.test(value)?true:false;
}
return true;
}

export const isContainsChar = (value)=>{
if(value!=""){
return /[0-9]*[A-Za-z]+[0-9]*/.test(value)?true:false;
}
return true;
}
export const isContainsDigits = (value)=>{
    if(value!=""){
        return /[A-Za-z]*[0-9][A-Za-z]*/.test(value)?true:false
    }
return true;
}
export const isVehicleNo = (value)=>{
    if(value!=""){
    return /^[A-Z]{2}[0-9]{4}$/.test(value)?true:false;
    }
    return true;
}
export const isOnlyDigits = (value)=>{
    if(value!=""){
        return /^[0-9]+$/.test(value)?true:false;
    }
    return true;
}