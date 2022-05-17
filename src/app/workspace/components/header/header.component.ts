import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-workspace-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() clicked = new EventEmitter<boolean>();
  opened = false;

  ngOnInit(): void {
  }

  onClick() {
    this.opened = !this.opened;
    this.clicked.emit(this.opened);
  }

}
