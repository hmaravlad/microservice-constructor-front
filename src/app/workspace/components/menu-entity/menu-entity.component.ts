import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { EntityCreatorService } from '../../services/entity-creator.service';

@Component({
  selector: 'app-menu-entity',
  templateUrl: './menu-entity.component.html',
  styleUrls: ['./menu-entity.component.css'],
})
export class MenuEntityComponent implements OnInit, AfterViewInit {
  @Input() type = '';
  @ViewChild('entity', { static: true }) entityElem!: ElementRef;

  constructor(private entityCreatorService: EntityCreatorService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const doubleClick$ = fromEvent(this.entityElem.nativeElement, 'dblclick') as Observable<MouseEvent>;
    this.entityCreatorService.addCreateEntityEvent(doubleClick$, this.type);
  }
}
