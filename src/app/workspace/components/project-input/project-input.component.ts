import { Component, Input, OnInit } from '@angular/core';
import { ProjectDataService } from '../../services/project.service';
import { FieldDescription } from '../../types/field-description';
import { FieldValue } from '../../types/field-type';

@Component({
  selector: 'app-project-input',
  templateUrl: './project-input.component.html',
  styleUrls: ['./project-input.component.css'],
})
export class ProjectInputComponent implements OnInit {
  @Input() field: FieldDescription;
  currValue: FieldValue | undefined;

  constructor(
    private projectService: ProjectDataService,
  ) {}

  ngOnInit(): void {
    this.currValue = this.projectService.getField(this.field.name);
  }

  onStringInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.value;
    if (!data) return;
    this.projectService.setField(this.field.name, data);
  }

  onNumberInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.valueAsNumber;
    if (!data) return;
    this.projectService.setField(this.field.name, data);
  }

  onBooleanInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.checked;
    this.projectService.setField(this.field.name, data);
  }

  onEnumInput = this.onStringInput;
}
