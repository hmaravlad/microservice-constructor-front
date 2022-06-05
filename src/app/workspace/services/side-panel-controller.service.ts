import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SidePanelState } from '../types/side-panel-state';

@Injectable({
  providedIn: 'root',
})
export class SidePanelControllerService {
  private panelState = new BehaviorSubject<SidePanelState>(SidePanelState.Closed);
  
  getPanelState(): Observable<SidePanelState> {
    return this.panelState.asObservable();
  }

  openAPIEditor() {
    this.panelState.next(SidePanelState.APIEditor);
  }

  openProjectConfigEditor() {
    this.panelState.next(SidePanelState.ProjectConfigEditor);
  }

  close() {
    this.panelState.next(SidePanelState.Closed);
  }

  closeIfAPIEditor() {
    if (this.panelState.value === SidePanelState.APIEditor) {
      this.panelState.next(SidePanelState.Closed);
    }
  }
}
