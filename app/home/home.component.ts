import { Component, OnInit, Inject, 
         ChangeDetectorRef }                    from '@angular/core';

import { Dish }                                 from '../shared/dish';
import { Promotion }                            from '../shared/promotion';
import { Leader }                               from '../shared/leader';
import { DrawerPage }                           from '../shared/drawer/drawer.page';

import { DishService }                          from '../services/dish.service';
import { PromotionService }                     from '../services/promotion.service';
import { LeaderService }                        from '../services/leader.service';

@Component({
    selector: 'app-home',
    moduleId: module.id,
    templateUrl: './home.component.html'
})
export class HomeComponent extends DrawerPage implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promoErrMess: string;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
              private promotionservice: PromotionService,
              private leaderservice: LeaderService,
              private changeDetectorRef:ChangeDetectorRef,
              @Inject('BaseURL') private BaseURL) {
                super(changeDetectorRef);
              }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
        .subscribe(dish => this.dish = dish,
                   errmess => this.dishErrMess = <any>errmess );
    this.promotionservice.getFeaturedPromotion()
        .subscribe(promotion => this.promotion = promotion,
                   errmess => this.promoErrMess = <any>errmess );
    this.leaderservice.getFeaturedLeader()
        .subscribe(leader => this.leader = leader,
                   errmess => this.leaderErrMess = <any>errmess );
  }

}