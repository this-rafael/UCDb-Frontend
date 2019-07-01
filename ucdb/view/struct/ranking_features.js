import {getData} from "../../controller/rest_controller.js";
import {SubjectenericProfile} from "./SubjectGenericProfile.js";

export {ranking_features};

function createGenericSubjectsProfile(local, response) {
    let $subjectContent = document.getElementById("$subjectContent");
    $subjectContent.innerHTML = "";
    response.forEach(subject => {
        let novo = new SubjectenericProfile();
        novo.setAttribute("name", subject.name);
        novo.setAttribute("id", subject.id);
        $subjectContent.appendChild(novo);
    })
}

function ranking_features(local,applicationHeader) {

    const form = document.getElementById("ranking-form");
    const strategy = form.orderType.value;
    const token = window.localStorage.___access_token___;

    getData(`localhost:8080/api/v1/subjects/sort/${strategy}`,  `Bearer ${token}`)
        .then(list => {
            createGenericSubjectsProfile(document.getElementById("main-container"), list);
        }

    ).catch(err => alert("Ocorreu um erro nos nosso servidores, por favor entre mais tarde"));


}

console.log("ooooi");