import { postStudentData, getAllStudents, deleteStudent, updateStudent } from "./models/students.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("student-form");
  const studentList = document.getElementById("student-list");
  const addSubjectBtn = document.getElementById("add-subject");
  const subjectsFormGroup = document.getElementById("subjects-form-group");

  let editMode = false;
  let currentEditId = null;

  loadStudents();

  addSubjectBtn.addEventListener("click", function () {
    const subjectRow = document.createElement("div");
    subjectRow.classList.add("subject-row");

    const subjectInput = document.createElement("input");
    subjectInput.type = "text";
    subjectInput.placeholder = "Enter Subject";

    const maskInput = document.createElement("input");
    maskInput.type = "text";
    maskInput.placeholder = "Enter Mask";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function () {
      subjectsFormGroup.removeChild(subjectRow);
    });

    subjectRow.appendChild(subjectInput);
    subjectRow.appendChild(maskInput);
    subjectRow.appendChild(removeBtn);
    subjectsFormGroup.appendChild(subjectRow);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const student = Object.fromEntries(formData.entries());
    student.age = parseInt(student.age) || null;
    student.subjects = [];

    subjectsFormGroup.querySelectorAll(".subject-row").forEach(row => {
      const [subjectInput, maskInput] = row.querySelectorAll("input");
      if (subjectInput.value && maskInput.value) {
        student.subjects.push({ subject: subjectInput.value, mask: maskInput.value });
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
      editMode = false;
      currentEditId = null;
    }

    form.reset();
    subjectsFormGroup.innerHTML = "";
    loadStudents();
  });

  function loadStudents() {
    studentList.innerHTML = "";
    const res = getAllStudents();
    if (res.status) {
      res.payload.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.email_address}</td>
          <td>${student.phone_number}</td>
          <td>${student.address}</td>
          <td>${student.father_name}</td>
          <td>${student.mother_name}</td>
          <td>${student.age || ""}</td>
          <td>${student.guardian_number}</td>
          <td><button class="edit-btn">Edit</button></td>
          <td><button class="delete-btn">Delete</button></td>
        `;

        row.querySelector(".edit-btn").addEventListener("click", () => editStudent(student));
        row.querySelector(".delete-btn").addEventListener("click", () => {
          deleteStudent(student.id);
          loadStudents();
        });

        studentList.appendChild(row);
      });
    }
  }

  function editStudent(student) {
    Object.entries(student).forEach(([key, value]) => {
      if (form.elements[key] && key !== "subjects") {
        form.elements[key].value = value;
      }
    });

    subjectsFormGroup.innerHTML = "";
    (student.subjects || []).forEach(sub => {
      const subjectRow = document.createElement("div");
      subjectRow.classList.add("subject-row");

      const subjectInput = document.createElement("input");
      subjectInput.type = "text";
      subjectInput.value = sub.subject;

      const maskInput = document.createElement("input");
      maskInput.type = "text";
      maskInput.value = sub.mask;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", function () {
        subjectsFormGroup.removeChild(subjectRow);
      });

      subjectRow.appendChild(subjectInput);
      subjectRow.appendChild(maskInput);
      subjectRow.appendChild(removeBtn);
      subjectsFormGroup.appendChild(subjectRow);
    });

    editMode = true;
    currentEditId = student.id;
  }
});
