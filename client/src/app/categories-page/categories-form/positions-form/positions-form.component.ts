import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position } from 'src/app/shared/interfaces'
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string
  @ViewChild('modal', {static: false}) modalRef: ElementRef
  positions: Position[] = []
  loading = true
  modal: MaterialInstance

  constructor(
    private positionService: PositionsService
  ) { }

  ngOnInit() {
    this.positionService.fetch(this.categoryId).subscribe(positions => {
      setTimeout(() => {
        this.positions = positions
        this.loading = false
      }, 300)
    })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  openModal() {
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }

}