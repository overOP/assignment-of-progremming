// index.js
import { postStudentData, getAllStudents, updateStudent } from "./models/students.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("student-form");
  const addSubjectBtn = document.getElementById("add-subject");
  const subjectsFormGroup = document.getElementById("subjects-form-group");

  let editMode = false;
  let currentEditId = null;

  const editStudentId = localStorage.getItem("editStudentId");
  if (editStudentId) {
    const res = getAllStudents();
    if (res.status) {
      const student = res.payload.find(s => s.id == editStudentId);
      if (student) {
        fillForm(student);
        editMode = true;
        currentEditId = student.id;
      }
    }
    localStorage.removeItem("editStudentId");
  }

  addSubjectBtn.addEventListener("click", addSubjectRow);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const student = Object.fromEntries(formData.entries());
    student.age = parseInt(student.age) || null;
    student.subjects = [];

    subjectsFormGroup.querySelectorAll(".subject-row").forEach(row => {
      const [subjectInput, maskInput] = row.querySelectorAll("input");
      if (subjectInput.value && maskInput.value) {
        student.subjects.push({ subject: subjectInput.value, mark: maskInput.value });
      }
    });

    if (!editMode) {
      const res = postStudentData(student);
      if (!res.status) {
        alert(res.message);
        return;
      }
    } else {
      student.id = currentEditId;
      updateStudent(student);
    }

    form.reset();
    subjectsFormGroup.innerHTML = "";
    editMode = false;
    currentEditId = null;
    alert("Saved Successfully");
  });

  function fillForm(student) {
    Object.entries(student).forEach(([key, value]) => {
      if (form.elements[key] && key !== "subjects") {
        form.elements[key].value = value;
      }
    });

    subjectsFormGroup.innerHTML = "";
    (student.subjects || []).forEach(sub => {
      addSubjectRow(sub.subject, sub.mark);
    });
  }

  function addSubjectRow(subject = "", mask = "") {
    const subjectRow = document.createElement("div");
    subjectRow.classList.add("subject-row");

    const subjectInput = document.createElement("input");
    subjectInput.type = "text";
    subjectInput.placeholder = "Enter Subject";
    subjectInput.value = subject;

    const maskInput = document.createElement("input");
    maskInput.type = "number";
    maskInput.placeholder = "Enter Marks";
    maskInput.value = mask;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      subjectsFormGroup.removeChild(subjectRow);
    });

    subjectRow.append(subjectInput, maskInput, removeBtn);
    subjectsFormGroup.appendChild(subjectRow);
  }
});

