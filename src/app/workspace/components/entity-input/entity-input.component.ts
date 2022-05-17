import { Component, Input, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';
import { FieldDescription } from '../../types/field-description';
import { FieldValue } from '../../types/field-type';

@Component({
  selector: 'app-entity-input',
  templateUrl: './entity-input.component.html',
  styleUrls: ['./entity-input.component.css'],
})
export class EntityInputComponent implements OnInit {
  @Input() id: number;
  @Input() field: FieldDescription;
  currValue: FieldValue | undefined;

  constructor(
    private entityService: EntityService,
    private sidePanelControllerService: SidePanelControllerService,
  ) {}

  ngOnInit(): void {
    this.currValue = this.entityService.getFieldValue(this.id, this.field.name);
  }

  onStringInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.value;
    if (!data) return;
    this.entityService.setField(this.id, this.field.name, data);
  }

  onNumberInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.valueAsNumber;
    if (!data) return;
    this.entityService.setField(this.id, this.field.name, data);
  }

  onBooleanInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.checked;
    this.entityService.setField(this.id, this.field.name, data);
  }

  onEnumInput = this.onStringInput;

  onOpenAPIConfigEditor() {
    this.sidePanelControllerService.openAPIEditor();
  }
}
