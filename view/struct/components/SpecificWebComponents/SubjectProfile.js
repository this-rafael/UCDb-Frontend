/**
 * @Author: Rafael da Silva Pereira Matricula: 117110921. UFCG: Ciência da Computação.
 * @Author: Áthila Matheus Barros Borges Matricula: 118210206. UFCG: Ciência da Computação.
 *  Modulo é um componente-web responsavel por ser a view da disciplina para usuarios logados, possui elementos propios
 * e contém em sim um outro elemento (comments) que por sua vez possui logica propia.
 */


import {SubjectComment} from "./SubjectComment.js";
import {postData} from "../../../../controller/rest_controller.js";
import {giveDislike, giveLike} from "./subject_profile_controller.js";

export {SubjectProfile};

class SubjectProfile extends HTMLElement {

    /**
     * this._comments por padrão é um array vazio.
     * this._userEnjoyed é o numero de likes que a disciplina possui
     * this._userDisliked é o numero de deslikes que a disciplina possui
     */
    constructor(comments = [], isEnjoyed, isDisliked) {
        super();
        this._comments = comments;
        this._userEnjoyed = isEnjoyed;
        this._userDisliked = isDisliked;
    }

    connectedCallback() {
        this._id = this.getAttribute("id");
        this._name = this.getAttribute("name");
        this._likes = this.getAttribute("likes");
        this._dislikes = this.getAttribute("dislikes");
        this.render();
    }

    render() {
        const html = this.getHtml();

        this.innerHTML = html;
        let flag = document.createElement("div");
        flag.setAttribute("id", "comments-flag");
        console.log(flag);
        this.appendChild(flag);
        this.setLikeAndDislikeButtonState();
        this.autoConfigureSubjectComments(this._comments);
        this.innerJS();
    }

    autoConfigureSubjectComments(commentsList) { // nota commentList deve ser um lista de comentários :( sdd's tipagem estatica agr

        let $subjectsComments = document.createElement("div");
        $subjectsComments.setAttribute("class", "subjectComments"); // configurar a classe para que ele tenha um tipo definido
        $subjectsComments.setAttribute("id", "subjectCommentsID");
        let a = document.getElementById("subjectCommentsID");
        commentsList.forEach(c => {
            let comment = new SubjectComment(this.id, c.subcomments, "comment-subject"); // criando um novo comentario

            comment.setAttribute("visible", c.visible);
            comment.setAttribute("commentID", c.commentID);
            comment.setAttribute("id", `subject-${c.commentID}`);
            comment.setAttribute("studentName", c.studentName);
            comment.setAttribute("studentSecondName", c.studentSecondName);
            comment.setAttribute("comment", c.comment);
            comment.setAttribute("commentDate", c.commentDate);
            comment.setAttribute("commentHour", c.commentHour);
            comment.setAttribute("visible", c.visible);

            $subjectsComments.appendChild(comment);
        });

        this.appendChild($subjectsComments)

    };

    getHtml() {
        const html = `
            ${this.getCss()}
            <div class="box-comment">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                <div class="disciplina-comment">
                     <p id="subject-name">${this._name}</p>
                     <p id="subject-id">${this._id}</p>
                </div>
                <button id="like"><i id="ico-like" class="fa fa-thumbs-up">${this._likes}</i></button>
                <button id="dislike"><i id="ico-dislike" class="fa fa-thumbs-down dislike-class">${this._dislikes}</i></button>
                <form id="subject-comment">
                    <div id="comment-container">
                        <textarea name="text-comment" id="comment-id" cols="120" rows="10" placeholder="Conte para nós o que achou da disciplina."></textarea>
                        <button type="button" name="submit" id="send-comment-to-subject-${this._id}" class="send-comment-button">ENVIAR!</button>
                    </div>
                </form>            
            </div>
            `;
        return html;
    }

    getCss() {
        const css = `<style>
            .active-like {
                color: green;
            }
            #like{
                width: 40px;
                grid-row: 2;
                grid-column: 5;
            }
            #dislike{
                width: 40px;
                grid-row: 2;
                grid-column: 5;
                margin-left: 50px;
            }

            .active-dislike {
                color: red; 
            }
            
            button{
                border: none;
                padding: 10px 10px;
                background-color: #ffffff;
                color: #0a0ae6;
            }
            
            .box-comment{
                display: grid;
                width: 100%;
                height: 400px;
                grid-template-columns: repeat(6, 170px);
                grid-template-rows: repeat(3,1fr) ;
            }
            
            ::-webkit-input-placeholder {
                color: #a3a3ff;
                font-weight: bold;
                font-size: 20px;
                margin: 15px;
            }

            .disciplina-comment{
            background-color: #a3a3ff;
            margin: 20px auto;
            padding: 20px;
            width: auto;
            grid-row: 1;
            grid-column: 1/7;
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(6, 1fr);
            font-size: 20px;
            font-weight: bold;
            }
            
             #subject-name{
                grid-column: 3/ 6;
                align-self: center;
            }
            
            #subject-id{
                margin-left: 10px;
                align-self: center;
                grid-column: 1;
                grid-row: 1;
            }
            
            #subject-comment{
                grid-row: 2/3;
                grid-column: 2/5;
                
                
            }
            
            
            #subject-comment, #comment-container, #comment-id{
                margin: 20px auto;
                display: block;
                width: 450px;
            }
            
            button{
                align-self: center;
            }
        
            </style>`;
        return css;
    }

    innerJS() {
        const $like = document.getElementById("like");
        const $dislike = document.getElementById("dislike");
        const $sendComment = document.getElementById(`send-comment-to-subject-${this._id}`);

        let $likeCount = $like.firstElementChild;
        let $dislikeCount = $dislike.firstElementChild;


        $like.onclick = () => {
            giveLike(this._id, $like, $dislike, $likeCount, $dislikeCount, this);
        };

        $dislike.onclick = () => {
            giveDislike(this._id, $like, $dislike, $likeCount, $dislikeCount, this);
        };

        /* esse metodo gerou uma discussão quanto ao design, mas chegamos a conclusão que o metodo de comentar (OU SEJA CRIAR COMENTARIO)
        * deve ser do modulo e não do controller do modulo, isto por que esse componente "Comment" atua como uma propriedade
        * de Subject, sendo assim a descrição do comportamento da função também deveria estar aqui
        *
        */
        $sendComment.onclick = () => {
            const commentText = document.getElementById("comment-id").value;
            if ("" !== commentText.trim()) {
                const userToken = window.localStorage.___access_token___;
                postData("comment/create/" + this._id, {comment: commentText.trim()},
                    `Bearer ${userToken}`).then(newC => {
                    if (!!newC) {
                        this.insertNewComment(newC);

                    }
                }).catch(err => alert("algo deu errado"));
            } else {
                alert("Erro, não é possivel inserir um comentario com texto vazio.")
            }
        };
    }


    setLikeAndDislikeButtonState() {
        if (this._userEnjoyed) {
            document.getElementById("like").classList.add("active-like");
        }

        if (this._userDisliked) {
            document.getElementById("dislike").classList.add("active-dislike");
        }
    };


    insertNewComment(newC) {
        let comment = new SubjectComment(this.id, newC.subcomments, "comment-subject"); // criando um novo comentario

        comment.setAttribute("visible", newC.visible);
        comment.setAttribute("commentID", newC.commentID);
        comment.setAttribute("id", `subject-${newC.commentID}`);
        comment.setAttribute("studentName", newC.studentName);
        comment.setAttribute("studentSecondName", newC.studentSecondName);
        comment.setAttribute("comment", newC.comment);
        comment.setAttribute("commentDate", newC.commentDate);
        comment.setAttribute("commentHour", newC.commentHour);
        comment.setAttribute("visible", newC.visible);


        const local = document.getElementById("subjectCommentsID");
        local.firstElementChild.insertAdjacentElement('afterbegin', comment);

    }
}

window.customElements.define("subject-profile", SubjectProfile);
