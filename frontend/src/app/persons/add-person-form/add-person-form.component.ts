import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PersonsService } from '../persons.service';

@Component({
  selector: 'app-add-person-form',
  templateUrl: './add-person-form.component.html',
  styleUrls: ['./add-person-form.component.css'],
})
export class AddPersonFormComponent implements OnInit {
  @Output() onAdd = new EventEmitter<boolean>();
  addPersonForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    year: new FormControl('', [Validators.required]),
  });

  constructor(private personsService: PersonsService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.addPersonForm.invalid) {
      return;
    }

    this.personsService.addPerson(this.addPersonForm.value).subscribe({
      next: () => {
        this.onAdd.emit(true);
      },
      error: ({ cause }) => {
        this.addPersonForm.setErrors({ credentials: true });
        console.log(cause);
        this.onAdd.emit(false);
      },
    });
  }
}
