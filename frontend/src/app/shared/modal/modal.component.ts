import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  @Input() title = '';

  constructor() {}

  ngOnInit(): void {}

  cancel() {
    this.onClose.emit(null);
  }
}
