import { Component, OnInit, 
         Inject, ChangeDetectorRef }        from '@angular/core';
import { LeaderService }                    from '../services/leader.service';
import { Leader }                           from '../shared/leader';
import { DrawerPage }                       from '../shared/drawer/drawer.page';

@Component({
    selector: 'app-menu',
    moduleId: module.id,
    templateUrl: './about.component.html'
})

export class AboutComponent extends DrawerPage implements OnInit{

    leaders: Leader[];
    errMess: string;

        constructor(private leaderservice: LeaderService,
                    private changeDetectorRef:ChangeDetectorRef,
                    @Inject ('BaseURL') private BaseURL){
                        super(changeDetectorRef);
                    }

        ngOnInit(){
            this.leaderservice.getLeaders()
                .subscribe(leaders => this.leaders = leaders,
                           errmess => this.errMess = <any>errmess);
        }
    
}