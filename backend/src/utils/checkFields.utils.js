const checkFields = (fields = "") => {
  if (Array.isArray(fields)) {
    let isEmpty = fields.some(field => field.trim() === "");
    return isEmpty;
  } else if (fields === "") {
    return false;
  } else {
    return true;
  }
};

export default checkFields;
