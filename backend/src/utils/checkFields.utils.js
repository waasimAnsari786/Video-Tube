/* it's a utility method for checking are requested fields which contains data except files,
valid? It receives fields as an array so that multiple fields can be checked and it allows 
single field for getting validated*/

const checkFields = (fields = "") => {
  if (Array.isArray(fields)) {
    let isEmpty = fields.some(
      field => field === undefined || field.trim() === ""
    );
    return isEmpty;
  } else if (!fields) {
    return true;
  }
};

const isInvalidString = value =>
  typeof value !== "string" || value.trim().length === 0;

export { isInvalidString, checkFields };
