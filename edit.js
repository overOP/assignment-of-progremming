// edit.js
import { getAllStudents, deleteStudent } from "./models/students.js";

document.addEventListener("DOMContentLoaded", () => {
  const studentList = document.getElementById("student-list");

  loadStudents();

  function loadStudents() {
    studentList.innerHTML = "";
    const res = getAllStudents();
    if (res.status) {
      res.payload.forEach(student => {
        const subjects = student.subjects?.map(sub => sub.subject).join(", ") || "None";
        const marks = student.subjects?.map(sub => sub.mark).join(", ") || "None";

        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.class || ''}</td> <!-- Add this line -->
        <td>${student.email_address}</td>
        <td>${student.phone_number}</td>
        <td>${student.address}</td>
        <td>${student.father_name}</td>
        <td>${student.mother_name}</td>
        <td>${student.age || ""}</td>
        <td>${student.guardian_number}</td>
        <td>${subjects}</td>
        <td>${marks}</td>
        <td><button class="edit-btn">Edit</button></td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      

        row.querySelector(".delete-btn").addEventListener("click", () => {
          deleteStudent(student.id);
          loadStudents();
        });

        row.querySelector(".edit-btn").addEventListener("click", () => {
          localStorage.setItem("editStudentId", student.id);
          window.location.href = "./index.html";
        });

        studentList.appendChild(row);
      });
    }
  }
});
