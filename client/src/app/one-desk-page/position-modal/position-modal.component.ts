import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Observable } from 'rxjs';
import { Desk, Position } from 'src/app/shared/interfaces';


@Component({
  selector: 'app-position-modal',
  templateUrl: './position-modal.component.html',
  styleUrls: ['./position-modal.component.scss']
})
export class PositionModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal', {static: false}) modalRef: ElementRef
  modal: MaterialInstance
  form: FormGroup
  @Input() category: Desk
  @Output() pushPosition = new EventEmitter<any>()

  private eventsSubscription: any
  @Input() events: Observable<void>

  constructor(
    private positionsService: PositionsService
  ) { }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
    this.eventsSubscription = this.events.subscribe(() => this.openModal())
  }

  ngOnDestroy() {
    this.modal.destroy()
    this.eventsSubscription.unsubscribe()
  }

  openModal() {
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  closeModal() {
    this.modal.close()
  }

  submitForm() {
    this.onSubmit()
  }

  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.category._id
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1})
      this.form.enable()
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Изменения сохранены')
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        completed
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана')
          this.pushPosition.emit(position)
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        completed
      )
    }
    
  }

}
