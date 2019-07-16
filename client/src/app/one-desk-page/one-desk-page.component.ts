import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DesksService } from '../shared/services/desks.service';
import { Desk, Position } from 'src/app/shared/interfaces';
import { of, Subject } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { PositionsService } from '../shared/services/positions.service';

@Component({
  selector: 'app-one-desk-page',
  templateUrl: './one-desk-page.component.html',
  styleUrls: ['./one-desk-page.component.scss']
})
export class OneDeskPageComponent implements OnInit {

  category: Desk
  positions: Position[] = []
  loading = true
  private eventsSubject: Subject<void> = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private desksService: DesksService,
    private positionService: PositionsService
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.loading = true
              return this.desksService.getById(params['id'])
            }
            return of(null)
          }
        )
      )
      .subscribe(
        (category: Desk) => {
          if (category) {
            setTimeout(() => {
              //this.categoryLoader = false
              //this.form.enable()
              this.category = category

              this.positionService.fetch(this.category._id).subscribe(positions => {
                setTimeout(() => {
                  this.positions = positions
                  this.loading = false
                }, 300)
              })
              /*
              this.form.patchValue({
                name: category.name
              })
              this.imagePreview = category.imageSrc
              MaterialService.updateTextInputs()*/
            }, 300)
          }
          //this.form.enable()
        },
        error => {
          MaterialService.toast(error.error.message)
        }
      )
  }

  openModal() {
    this.eventsSubject.next()
  }

  onVoted(position: any) {
    this.positions.push(position)
  }

}
