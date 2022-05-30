import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, Observable, Subject } from 'rxjs';
import { isErrorResponse } from 'src/app/http-utils/query-error.entity';
import { ProjectService } from 'src/app/projects/project.service';
import { EntityCreatorService } from '../../services/entity-creator.service';
import { EntityService } from '../../services/entity.service';
import { IdGeneratorService } from '../../services/id-generator.service';
import { LinesCreatorService } from '../../services/lines-creator.service';
import { EntityExported } from '../../types/entity-exported';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas_box', { static: true }) canvasBoxElement!: ElementRef;
  @ViewChild('canvas') canvasElement: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  @Input() projectId = 0;

  entities: EntityExported[] = [];

  mouseMoveSubject = new Subject<MouseEvent>();
  mouseUpSubject = new Subject<MouseEvent>();
  mouseOutSubject = new Subject<MouseEvent>();

  mouseMove$ = from(this.mouseMoveSubject);
  mouseUp$ = from(this.mouseUpSubject);
  mouseOut$ = from(this.mouseOutSubject);


  constructor(
    private linesCreatorService: LinesCreatorService,
    private entityCreatorService: EntityCreatorService,
    private entityService: EntityService,
    private idGeneratorService: IdGeneratorService,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.projectService.getProject(this.projectId).subscribe(project => {
      if (isErrorResponse(project)) throw new Error();
      this.entityService.init(this.projectId, project.entities.length);
      this.entities = project.entities;
    });
  }

  ngAfterViewInit(): void {

    const context = this.canvasElement.nativeElement.getContext('2d');
    if (!context) throw new Error();
    this.context = context;

    const mouseMove$ = fromEvent(this.canvasBoxElement.nativeElement, 'mousemove') as Observable<MouseEvent>;
    const mouseUp$ = fromEvent(this.canvasBoxElement.nativeElement, 'mouseup') as Observable<MouseEvent>;
    const mouseOut$ = fromEvent(this.canvasBoxElement.nativeElement, 'mouseleave') as Observable<MouseEvent>;
    const mouseClick$ = fromEvent(this.canvasBoxElement.nativeElement, 'mousedown') as Observable<MouseEvent>;


    mouseMove$.subscribe(e => {
      this.mouseMoveSubject.next(e);
    });
    mouseUp$.subscribe(e => {
      this.mouseUpSubject.next(e);
    });
    mouseOut$.subscribe(e => {
      this.mouseOutSubject.next(e);
    });

    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;

    this.linesCreatorService.get().subscribe(lines => {
      this.context.clearRect(0, 0, 1800, 1200);
      for (const { x1, x2, y1, y2 } of lines) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.closePath();
      }
    });

    this.entityCreatorService.onCreateEntity().subscribe((type) => {
      const id = this.idGeneratorService.getId();
      this.entities.push({ id, type, x: 100, y: 100, projectId: this.projectId, fields: JSON.stringify({}) });
    });

    this.entityService.enableSelectionRemoving(mouseClick$);
  }
}
