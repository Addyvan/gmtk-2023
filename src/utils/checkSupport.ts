function checkSupportFor(name, propertyName, propertyOwner = window) {
  if (!(propertyName in propertyOwner)) {
    console.warn(`No support for ${name}`);
  } else {
    console.log(`Supports ${name}!`);
    return true;
  }
}
export default checkSupportFor;
