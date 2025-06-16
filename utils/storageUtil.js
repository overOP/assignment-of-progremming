export function getDataFromDB(table_name) {
  const raw = localStorage.getItem(table_name);
  let payload = [];
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      console.error("Error parsing data from localStorage", e);
    }
  }
  return { payload };
}

export function setDataToDB(table_name, data) {
  try {
    localStorage.setItem(table_name, JSON.stringify(data));
    return { status: true };
  } catch (e) {
    console.error("Error saving data to localStorage", e);
    return { status: false };
  }
}

export function generateResponse(status, message, payload = null) {
  return { status, message, payload };
}
