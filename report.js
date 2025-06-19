import { getAllStudents, deleteStudent } from './models/students.js';

document.addEventListener('DOMContentLoaded', () => {
  const nameSelect = document.getElementById('fullname');
  const classSelect = document.getElementById('class');
  const subjectSelect = document.getElementById('subject');
  const submitBtn = document.getElementById('report-form-submit');
  const reportList = document.getElementById('report-list');

  const allStudents = getAllStudents().payload || [];

  // Populate student name dropdown
  allStudents.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = s.name;
    nameSelect.appendChild(opt);
  });

  // Populate subject dropdown
  const subjects = [
    ...new Set(
      allStudents.flatMap(s => (s.subjects || []).map(sub => sub.subject))
    )
  ];
  subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    subjectSelect.appendChild(opt);
  });

  submitBtn.addEventListener('click', renderTable);
  renderTable(); // Initial load

  function renderTable() {
    reportList.innerHTML = '';

    const nameFilter = nameSelect.value.trim().toLowerCase();
    const classFilter = classSelect.value;
    const subjectFilter = subjectSelect.value;

    const filtered = allStudents.filter(s => {
      const nameMatch = nameFilter
        ? s.name.toLowerCase() === nameFilter
        : true;

      // fix: class filter works correctly for empty string
      const classMatch = !classFilter || classFilter === "" ? true : s.class === classFilter;

      const subjectMatch = subjectFilter
        ? (s.subjects || []).some(sub => sub.subject === subjectFilter)
        : true;

      return nameMatch && classMatch && subjectMatch;
    });

    if (filtered.length === 0) {
      reportList.innerHTML = '<tr><td colspan="10">No students found</td></tr>';
      return;
    }

    filtered.forEach(student => {
      const row = document.createElement('tr');
      const subjects = (student.subjects || []).map(m => m.subject).join(', ');

      // fix typo: mask → mark
      const marks = (student.subjects || []).map(m => m.mark).join(', ');

      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.email_address}</td>
        <td>${student.phone_number}</td>
        <td>${student.address}</td>
        <td>${student.class || ''}</td>
        <td>${subjects}</td>
        <td>${marks}</td>
        <td><button class="edit-btn">Edit</button></td>
        <td><button class="delete-btn">Delete</button></td>
        <td><button class="report-btn">Report</button></td>
      `;

      row.querySelector('.edit-btn').addEventListener('click', () => {
        localStorage.setItem('editStudentId', student.id);
        window.location.href = 'index.html';
      });

      row.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm(`Delete ${student.name}?`)) {
          deleteStudent(student.id);
          window.location.reload();
        }
      });

      row.querySelector('.report-btn').addEventListener('click', () => {
        alert(`Reporting student:\n${student.name}\nSubject(s): ${subjects}`);
        // Your report logic here
      });

      reportList.appendChild(row);
    });
  }
});
