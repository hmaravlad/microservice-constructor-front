import { Component, OnInit } from '@angular/core';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';

@Component({
  selector: 'app-workspace-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private sidePanelControllerService: SidePanelControllerService) {}

  ngOnInit(): void {
  }

  onChangeSettings(): void {
    this.sidePanelControllerService.openProjectConfigEditor();
  }
}
