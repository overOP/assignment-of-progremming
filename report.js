import { TABLE_NAME } from "./constants.js";
import { getDataFromDB, setDataToDB } from "./utils/storageUtil.js";

const submitBtn = document.getElementById('report-form-submit')
submitBtn.addEventListener('click', submitData)

function getSubjects() {
    const students = getDataFromDB(TABLE_NAME.STUDENTS)
    const subjects = students.payload.data?.map(student => student?.subjects)
    const flatSubject = [...new Set(subjects.flat().map(item => item.name))]

    const subjectField = document.getElementById("subject");

    console.log('flatSubject', flatSubject)

    flatSubject.forEach(subject => {
        const optionElement = document.createElement("option");
        optionElement.innerHTML = subject;
        optionElement.value = subject.toLowerCase()
        subjectField.appendChild(optionElement)
    })


}

function submitData(event) {
    event.preventDefault();
    const nameField = document.getElementById("fullname");
    const nameValue = nameField.value;

    const classField = document.getElementById("class");
    const classValue = classField.value;

    const subjectField = document.getElementById("subject");
    const subjectValue = subjectField.value;


    if (!nameValue || !classValue || !subjectValue) {
        alert('Please fill all the fields');
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getSubjects()
});