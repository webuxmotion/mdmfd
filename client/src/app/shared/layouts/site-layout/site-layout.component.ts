import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DesksService } from '../../services/desks.service';
import { Router } from '@angular/router';
import { MaterialService, MaterialInstance } from '../../classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Desk } from '../../interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit, OnInit {

  modal: MaterialInstance
  form: FormGroup
  isNew = true
  desk: Desk
  desks: Desk[] = []

  @ViewChild('modal', {static: false}) modalRef: ElementRef
  
  constructor(
    private desksService: DesksService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.desksService.fetch().subscribe(desks => {
      setTimeout(() => {
        this.desks = desks
        //this.loading = false
      }, 300)
    })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['/login'])
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

  submitForm() {
    this.onSubmit()
  }

  onSubmit() {
    let obs$
    this.form.disable()
    
    if (this.isNew) {
      obs$ = this.desksService.create(this.form.value)
    } else {
      obs$ = this.desksService.update(this.desk._id, this.form.value.name)
    }

    obs$.subscribe(
      desk => {
        setTimeout(() => {
          this.desk = desk
          this.desks.push(desk)
          if (this.isNew) {
            MaterialService.toast('Added!')
          } else {
            MaterialService.toast('Updated!')
            this.form.enable()
          }
          this.closeModal()
        }, 300)
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}