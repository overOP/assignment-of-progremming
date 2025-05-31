import { MESSAGES, TABLE_NAME } from "../constants.js";
import { generateResponse, getDataFromDB, setDataToDB } from "../utils/storageUtil.js";

const table_name = TABLE_NAME.STUDENTS;

function generateRandomId8Bit() {
  return Math.floor(Math.random() * 256);
}

export function postStudentData(data) {
  if (data) {
    const { payload: allstudents } = getDataFromDB(table_name);

    // Check email uniqueness
    const exists = allstudents.find(s => s.email_address === data.email_address);
    if (exists) {
      return generateResponse(false, MESSAGES.student.ALREADY_EXISTS);
    }

    const studentId = generateRandomId8Bit();

    const newStudent = { id: studentId, ...data };
    allstudents.push(newStudent);
    setDataToDB(table_name, allstudents);

    return generateResponse(true, MESSAGES.student.SAVED, newStudent);
  }
  return generateResponse(false, MESSAGES.INVALID);
}

export function getAllStudents() {
  const { payload } = getDataFromDB(table_name);
  return payload;
}

export function deleteStudent(id) {
  const { payload: allstudents } = getDataFromDB(table_name);
  const filtered = allstudents.filter(s => s.id !== id);
  setDataToDB(table_name, filtered);
  return generateResponse(true, MESSAGES.success);
}

export function updateStudent(data) {
  if (data && data.id !== undefined) {
    const { payload: allstudents } = getDataFromDB(table_name);
    const idx = allstudents.findIndex(s => s.id === data.id);
    if (idx === -1) {
      return generateResponse(false, MESSAGES.student.NOT_FOUND);
    }
    allstudents[idx] = data;
    setDataToDB(table_name, allstudents);
    return generateResponse(true, MESSAGES.success, data);
  }
  return generateResponse(false, MESSAGES.INVALID);
}
