import { Component, OnInit }    from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TextField } from "tns-core-modules/ui/text-field";
import { Slider } from "tns-core-modules/ui/slider";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Comment } from '../shared/comment';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    commentForm: FormGroup;
    comment: Comment;


    constructor(private formBuilder: FormBuilder, private params: ModalDialogParams) {
        this.commentForm = this.formBuilder.group({
            rating: [5, Validators.required],
            author: ['', Validators.required],
            comment: ['', Validators.required],
            date: ''

        });
    }

    ngOnInit(): void {
    }

    onAuthorChange(args) {
        let textField = <TextField>args.object;
        this.commentForm.patchValue({ author: textField.text});
    }

    onCommentChange(args) {
        let textField = <TextField>args.object;
        this.commentForm.patchValue({ comment: textField.text});
    }

    onRatingSliderChange(args) {
        let slider = <Slider>args.object;
        this.commentForm.patchValue({ rating: slider.value});
    }

    onSubmit() {
        this.comment = this.commentForm.value;
        this.comment.date = new Date().toISOString();
        this.params.closeCallback(this.comment);


    }

}