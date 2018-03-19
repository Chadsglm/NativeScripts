import { Component, OnInit, Inject, ChangeDetectionStrategy }    from '@angular/core';
import { Dish }                         from '../shared/dish';
import { Comment }                      from '../shared/comment';
import { DishService }                  from '../services/dish.service';
import { ActivatedRoute, Params }       from '@angular/router';
import { RouterExtensions }             from 'nativescript-angular/router';
import { FavoriteService }              from '../services/favorite.service';
import { TNSFontIconService }           from 'nativescript-ngx-fonticon';
import {Toasty}                         from 'nativescript-toasty'
import { action }                       from "ui/dialogs";
import { Validators, FormBuilder, 
         FormGroup}                     from '@angular/forms';
import { ModalDialogService, 
         ModalDialogOptions }           from "nativescript-angular/modal-dialog";
import {ViewContainerRef}               from "@angular/core";
import{CommentComponent}                from "../comment/comment.component";

import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-dishdetail',
    moduleId: module.id,
    templateUrl: './dishdetail.component.html',
})
export class DishdetailComponent implements OnInit {

    commentForm: FormGroup;

    avgstars: string;
    numcomments: number;
    favorite: boolean = false;

    dish: Dish;
    comment: Comment;
    errMess: string;


    constructor(private dishservice: DishService,
                private route: ActivatedRoute,
                private routerExtensions: RouterExtensions,
                @Inject('BaseURL') private BaseURL,
                private favoriteservice: FavoriteService,
                private fonticon: TNSFontIconService,
                private formBuilder: FormBuilder,
                private modalService: ModalDialogService,
                private vcRef: ViewContainerRef) {
    }

    ngOnInit() {

        this.route.params
            .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
            .subscribe(dish => {
                    this.updateDetailsView(dish);
                  },
                  errmess => { this.dish = null; this.errMess = <any>errmess; });
       
    }

    updateDetailsView(dish){
      this.dish = dish;
      this.favorite = this.favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;
      
      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating );
      this.avgstars = (total/this.numcomments).toFixed(2);
    }

    addToFavorites() {
        if (!this.favorite) {
            console.log('Adding to Favorites', this.dish.id);
            this.favorite = this.favoriteservice.addFavorite(this.dish.id);
            const toast = new Toasty("Added Dish "+ this.dish.id, "short", "bottom");
            toast.show();
        }
    }

    displayActionDialog(){

        let options = {
            title: "Actions",
            message: "Actions",
            cancelButtonText: "Cancel",
            actions: ["Add to Favorites", "Add Comment"]
        };

        action(options).then((result) => {
            console.log(result);

            if(result === "Add to Favorites"){
                this.addToFavorites();
            }

            if(result === "Add Comment"){
                this.createCommentModalView();

            }
        });

    }


    createCommentModalView() {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            fullscreen: false
        };

        this.modalService.showModal(CommentComponent, options)
            .then((comment: Comment) => {
                this.dish.comments.push(comment);
                this.dishservice.saveDish(this.dish)
                    .subscribe(result => { 
                        this.updateDetailsView(result);
                     });
            });
    }

    goBack(): void {
        this.routerExtensions.back();
    }
}