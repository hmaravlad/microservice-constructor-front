import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.css'],
})
export class ErrorListComponent implements OnInit {

  constructor(private errorsService: ErrorsService, private ref: ChangeDetectorRef) { }

  eventErrors: { id: number, message: string }[] = [];
  stateErrors: string[] = [];

  ngOnInit(): void {
    this.errorsService.getEventErrors().subscribe(eventErrors => {
      this.eventErrors = eventErrors;
      this.ref.detectChanges();
    });
    this.errorsService.getStateErrors().subscribe(stateErrors => {
      this.stateErrors = stateErrors;
      this.ref.detectChanges();
    });
  }

  removeEventError(id: number): () => void {
    return () => {
      this.errorsService.removeEventError(id);
    };
  }
}
