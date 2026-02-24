export function generateAdminCode() {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ADM${random}`;
}
export function generatePropertyId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PROP${random}`;
}
export function generateUnitCode(propertyName, unitNumber) {
  const shortCode = propertyName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();

  return `${shortCode}${unitNumber}`;
}
export function generateReportId() {
  return `REP${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;
}
