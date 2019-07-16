import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input', {static: false}) inputRef: ElementRef
  form: FormGroup 
  image: File
  imagePreview: any = ''
  category: Category
  isNew = true
  categoryLoader = true

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            } else {
              this.categoryLoader = false
            }
            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            setTimeout(() => {
              this.categoryLoader = false
              this.form.enable()
              this.category = category
              this.form.patchValue({
                name: category.name
              })
              this.imagePreview = category.imageSrc
              MaterialService.updateTextInputs()
            }, 300)
          }
          this.form.enable()
        },
        error => {
          this.categoryLoader = false
          MaterialService.toast(error.error.message)
        }
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file
    
    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        setTimeout(() => {
          this.category = category
          if (this.isNew) {
            MaterialService.toast('Added!')
            this.router.navigate([`/categories/${category._id}`])
          } else {
            MaterialService.toast('Updated!')
            this.form.enable()
          }
        }, 300)
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

  deleteCategory() {
    const decision = window.confirm('Delete category?')
    
    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => {
            MaterialService.toast(response.message)
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.router.navigate(['/categories'])
          }
        )
    }
  }
}
