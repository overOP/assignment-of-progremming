// utils/storageUtil.js
export function getDataFromDB(key) {
  const data = JSON.parse(localStorage.getItem(key)) || [];
  return generateResponse(true, "Fetched", data);
}

export function setDataToDB(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function generateResponse(status, message, payload = null) {
  return { status, message, payload };
}
