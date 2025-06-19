// models/students.js
import { MESSAGES, TABLE_NAME } from "../utils/constants.js";
import { getDataFromDB, setDataToDB, generateResponse } from "../utils/storageUtil.js";

const table_name = TABLE_NAME.STUDENTS;

function generateRandomId8Bit() {
  return Math.floor(Math.random() * 256);
}

export function postStudentData(data) {
  const { payload: allstudents } = getDataFromDB(table_name);
  const exists = allstudents.find(s => s.email_address === data.email_address);
  if (exists) return generateResponse(false, MESSAGES.student.ALREADY_EXISTS);
  const studentId = generateRandomId8Bit();
  allstudents.push({ id: studentId, ...data });
  setDataToDB(table_name, allstudents);
  return generateResponse(true, MESSAGES.student.SAVED);
}

export function getAllStudents() {
  return getDataFromDB(table_name);
}

export function deleteStudent(id) {
  const { payload: allstudents } = getDataFromDB(table_name);
  const filtered = allstudents.filter(s => s.id !== id);
  setDataToDB(table_name, filtered);
  return generateResponse(true, MESSAGES.success);
}

export function updateStudent(data) {
  const { payload: allstudents } = getDataFromDB(table_name);
  const idx = allstudents.findIndex(s => s.id === data.id);
  if (idx === -1) return generateResponse(false, MESSAGES.student.NOT_FOUND);
  allstudents[idx] = data;
  setDataToDB(table_name, allstudents);
  return generateResponse(true, MESSAGES.success);
}
