export const REGEX = {
  indianMobile: /^[0]?[789]\d{9}$/,
  egyptianMobile: /^[0]?[2]\d{11}$/,
  vietnamMobile: /^[0]?[84]\d{10}$/,
  sirlankaMobile: /^[0]?[94]\d{10}$/,
  regex_SA : /[SA]{1,}$/i,
  devMobile: /^([1]{8}[0-9]{3})$/,

  saudiMobile: /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/,

    // internationalMobile: /^(009665|9665|\+9665|05|5|02|84|94)((5|0|3|6|4|9|1|8|7)([0-9]{7})|([0-9]{9})|([0-9]{11}))$/,    
    // indianMobile: /^[6789]\d{9}$/,
    // saudiMobile: /^(00|0|)?(966|5|)(\d{9})$/,
    // password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,16}$/,
    password: /^[a-zA-z0-9!@#$%^&*]{5,}$/,
    // password: "",
    // name: /^[a-zA-Z ]{2,30}$/
    name: /^[a-zA-Z\u0600-\u06FF\s]*$/,
    newName: /^[a-zA-Z\u0600-\u06FF\s]*([\u0660-\u06690-9]{1,}[-*+/?.>"':;^%$# !~`]{0,}){6,}$/,
    ibanNotConatinArabicCharacters: /[\u0660-\u0669\u0621-\u064A]{1,}$/i,
}
