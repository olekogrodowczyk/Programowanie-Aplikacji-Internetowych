import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person, PersonsService } from '../persons.service';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css'],
})
export class EditPersonComponent implements OnInit {
  @Input() person: Person = {} as Person;
  @Output() onEdit = new EventEmitter<boolean>();
  editPersonForm: FormGroup = {} as FormGroup;

  constructor(private personService: PersonsService) {}

  ngOnInit(): void {
    this.editPersonForm = new FormGroup({
      firstName: new FormControl(this.person.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      lastName: new FormControl(this.person.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      year: new FormControl(this.person.year, [Validators.required]),
      _id: new FormControl(this.person._id, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.editPersonForm.invalid) {
      return;
    }
    this.personService.editPerson(this.editPersonForm.value).subscribe({
      next: () => {
        this.onEdit.emit(true);
      },
      error: () => {
        this.editPersonForm.setErrors({ credentials: true });
        this.onEdit.emit(false);
      },
    });
  }
}
