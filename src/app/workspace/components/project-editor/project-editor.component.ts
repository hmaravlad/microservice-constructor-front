import { Component, OnInit } from '@angular/core';
import { ProjectDescriptionProviderService } from '../../services/project-description-provider.service';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';
import { FieldDescription } from '../../types/field-description';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.css'],
})
export class ProjectEditorComponent implements OnInit {

  constructor(
    private projectDescriptionProviderServiceService: ProjectDescriptionProviderService,
    private sidePanelControllerService: SidePanelControllerService,
  ) { }

  fields: FieldDescription[] = [];

  ngOnInit(): void {
    this.fields = this.projectDescriptionProviderServiceService.getProjectDescription().fields;
  }

  onSubmit(): void {
    this.sidePanelControllerService.close();
  }
}
