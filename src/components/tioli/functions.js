// helper functions
export function isEmpty(text) {
  var isEmpty = false;
  if (text.length === 0 || !text.replace(/\s+/, '').length || text == null) {
    isEmpty = true;
  }
  
  return isEmpty;
}
