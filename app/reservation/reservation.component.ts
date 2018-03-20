import { Component, OnInit, Inject, 
         ChangeDetectorRef, ViewContainerRef }      from '@angular/core';
import { Observable }                               from 'rxjs/Observable';
import { CouchbaseService }                         from '../services/couchbase.service';
import { ObservableArray }                          from 'tns-core-modules/data/observable-array';
import { DrawerPage }                               from '../shared/drawer/drawer.page';
import { TextField }                                from 'ui/text-field';
import { Switch }                                   from 'ui/switch';
import { Validators, FormBuilder, FormGroup}        from '@angular/forms';
import { ModalDialogService, ModalDialogOptions }   from "nativescript-angular/modal-dialog";
import { ReservationModalComponent }                from "../reservationmodal/reservationmodal.component";
import { Animation, AnimationDefinition }           from "ui/animation";
import * as enums                                   from "ui/enums";
import { View }                                     from 'ui/core/view';
import { Page }                                     from "ui/page";
import { Subscriber }                               from 'rxjs/Subscriber';
import { Data }                                     from '@angular/router';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {
    
    counter: number = 0;
    
    reservation: FormGroup;
    errMess: string;
    reservations: string;
    docId: string = "reservations";
    submitted: boolean = false;
    showForm: boolean = true;
    showForms: View;
    submittedForm: View;
   

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private couchbaseService: CouchbaseService,
        private vcRef: ViewContainerRef,
        private page: Page,
        @Inject('BaseURL') private BaseURL) {
            super(changeDetectorRef);
      
            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required],
                date: new Date().toISOString()
            });

            let doc = this.couchbaseService.getDocument(this.docId);
            if( doc == null) {
              this.couchbaseService.createDocument({"reservations": []}, this.docId);
            }
            else {
              this.reservations = doc.reservations;
            }
     }

    ngOnInit() {

    }
//counter
    public onTap(){
        this.counter ++;
    }
    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

//ths creates the modal
    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }

    onSubmit() {
        this.reservation = this.reservation.value;
        console.log("This is the first reservations", this.reservations);
        this.reservations = this.couchbaseService.getDocument(this.docId).reservations + JSON.stringify(this.reservation);
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});
        let doc = this.couchbaseService.getDocument(this.docId);
        console.log(doc.reservations);
        this.hideAndShow();
    }

    hideAndShow(){
        this.showForms = <View>this.page.getViewById<View>("showForms");
        this.submittedForm = <View>this.page.getViewById<View>("submittedForm");
        this.showForms.animate({
            scale: { x: 0, y: 0 },
            translate: { x: 0, y: 0 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        })
        .then(() => {
        this.showForm = false;
        this.submitted = true;
        this.submittedForm.animate({
                scale: { x: 1, y: 1 },
                translate: { x: 0, y: 0 },
                opacity: 1,
                duration: 500,
                curve: enums.AnimationCurve.easeIn
            })
        });
    }
}