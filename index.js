import { postStudentData, getAllStudents, deleteStudent, updateStudent } from "./models/students.js";

const form = document.getElementById("student-form");
const studentList = document.getElementById("student-list");

let editingStudentId = null;

function clearForm() {
  form.reset();
  editingStudentId = null;
  form.querySelector("#form-submit").textContent = "Submit";
}

function fillForm(student) {
  form.name.value = student.name;
  form.email_address.value = student.email_address;
  form.phone_number.value = student.phone_number;
  form.address.value = student.address;
  form.father_name.value = student.father_name;
  form.mother_name.value = student.mother_name;
  form.age.value = student.age;
  form.guardian_number.value = student.guardian_number;
  editingStudentId = student.id;
  form.querySelector("#form-submit").textContent = "Update";
}

function renderStudents() {
  const students = getAllStudents();
  studentList.innerHTML = "";

  students.forEach(student => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email_address}</td>
      <td>${student.phone_number}</td>
      <td>${student.address}</td>
      <td>${student.father_name}</td>
      <td>${student.mother_name}</td>
      <td>${student.age ?? ""}</td>
      <td>${student.guardian_number}</td>
      <td><button class="edit-btn">Edit</button></td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    // Edit button event
    tr.querySelector(".edit-btn").addEventListener("click", () => {
      fillForm(student);
    });

    // Delete button event
    tr.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete ${student.name}?`)) {
        deleteStudent(student.id);
        renderStudents();
        if (editingStudentId === student.id) {
          clearForm();
        }
      }
    });

    studentList.appendChild(tr);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    email_address: form.email_address.value.trim(),
    phone_number: form.phone_number.value.trim(),
    address: form.address.value.trim(),
    father_name: form.father_name.value.trim(),
    mother_name: form.mother_name.value.trim(),
    age: form.age.value.trim() ? Number(form.age.value) : null,
    guardian_number: form.guardian_number.value.trim(),
  };

  if (editingStudentId !== null) {
    // Update flow
    const updatedStudent = { id: editingStudentId, ...data };
    const res = updateStudent(updatedStudent);
    if (res.status) {
      alert("Student updated successfully");
      clearForm();
      renderStudents();
    } else {
      alert(res.message);
    }
  } else {
    // New insert
    const res = postStudentData(data);
    if (res.status) {
      alert("Student added successfully");
      clearForm();
      renderStudents();
    } else {
      alert(res.message);
    }
  }
});

// Initial render
renderStudents();
