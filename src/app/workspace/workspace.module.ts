import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './workspace.component';
import { HeaderComponent } from './components/header/header.component';
import { EntityComponent } from './components/entity/entity.component';
import { ToPxPipe } from './to-px.pipe';
import { CanvasComponent } from './components/canvas/canvas.component';
import { EntityEditorComponent } from './components/entity-editor/entity-editor.component';
import { EntityInputComponent } from './components/entity-input/entity-input.component';
import { ToolboxComponent } from './components/toolbox/toolbox.component';
import { MenuEntityComponent } from './components/menu-entity/menu-entity.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { FormsModule } from '@angular/forms';
import { ApiEditorComponent } from './components/api-editor/api-editor.component';
import { ProjectEditorComponent } from './components/project-editor/project-editor.component';
import { ProjectInputComponent } from './components/project-input/project-input.component';
import { DefaultSimpleModalOptionConfig, defaultSimpleModalOptions, SimpleModalModule } from 'ngx-simple-modal';
import { ConfirmComponent } from './components/confirm/confirm.component';

@NgModule({
  declarations: [
    WorkspaceComponent,
    HeaderComponent,
    ToolboxComponent,
    MenuEntityComponent,
    EntityComponent,
    EntityEditorComponent,
    EntityInputComponent,
    CanvasComponent,
    ApiEditorComponent,
    SidePanelComponent,
    ProjectEditorComponent,
    ProjectInputComponent,
    ToPxPipe,
    ConfirmComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SimpleModalModule,
  ],
  exports: [
    WorkspaceComponent,
  ],
  providers: [
    {
      provide: DefaultSimpleModalOptionConfig,
      useValue: { ...defaultSimpleModalOptions, ...{ closeOnClickOutside: true, Animation: null } },
    },
  ],
})
export class WorkspaceModule { }
