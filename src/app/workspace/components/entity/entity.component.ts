import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, fromEvent, map, merge, Observable, switchMap, takeUntil } from 'rxjs';
import { EntityPositionProviderService } from '../../services/entity-position-provider.service';
import { EntityService } from '../../services/entity.service';
import { LinesCreatorService } from '../../services/lines-creator.service';
import { Line } from '../../types/line';
import { Point } from '../../types/point';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css'],
})
export class EntityComponent implements OnInit {

  @ViewChild('handle', { static: true }) handleElement!: ElementRef;
  @ViewChild('box', { static: true }) boxElement!: ElementRef;

  @Input() mouseMoveParent$: Observable<MouseEvent>;
  @Input() mouseUpParent$: Observable<MouseEvent>;
  @Input() mouseOutParent$: Observable<MouseEvent>;

  @Input() id: number;
  @Input() type = '';

  x: BehaviorSubject<number> = new BehaviorSubject<number>(100);
  y: BehaviorSubject<number> = new BehaviorSubject<number>(100);

  currX = 100;
  currY = 100;

  width = 200;
  height = 100;

  halfWidth = this.width / 2;
  halfHeight = this.height / 2;

  dragging = false;

  name = '';

  canvasWidth = 1800;
  canvasHeight = 1200;

  constructor(
    private linesCreatorService: LinesCreatorService,
    private entityPositionProvider: EntityPositionProviderService,
    private entityService: EntityService,
  ) { }

  ngOnInit(): void {
    this.entityService.observeEntityComponent(this.id, this);
  }

  ngAfterViewInit(): void {
    this.x.subscribe(x => this.currX = x);
    this.y.subscribe(y => this.currY = y);

    const mouseDownHandle$ = fromEvent(this.handleElement.nativeElement, 'mousedown') as Observable<MouseEvent>;
    const mouseDoubleClick$ = fromEvent(this.boxElement.nativeElement, 'dblclick') as Observable<MouseEvent>;
    const mouseDown$ = fromEvent(this.boxElement.nativeElement, 'mousedown') as Observable<MouseEvent>;
    mouseDown$.subscribe(e => e.stopPropagation());

    const enterBox$ = fromEvent(this.boxElement.nativeElement, 'mouseover') as Observable<MouseEvent>;
    const leaveBox$ = fromEvent(this.boxElement.nativeElement, 'mouseleave') as Observable<MouseEvent>;
    this.entityPositionProvider.observeEntity(this, enterBox$, leaveBox$);

    this.entityService.enableSelection(mouseDoubleClick$, this.id);

    this.subscribeToName();

    this.enableDragging(
      mouseDownHandle$,
      merge(this.mouseUpParent$, this.mouseOutParent$),
      this.mouseMoveParent$,
    );

    this.enableDrawing(
      mouseDown$,
      merge(this.mouseUpParent$, this.mouseOutParent$),
      this.mouseMoveParent$,
    );
  }

  subscribeToName() {
    const name$ = this.entityService.getField(this.id, 'name');
    if (name$) {
      name$.subscribe(name => {
        if (typeof name == 'string') {
          this.name = name;
        }
      });
    } else {
      this.name = this.type + '-' + this.id;
    }
  }

  enableDragging(
    dragStart$: Observable<MouseEvent>,
    dragEnd$: Observable<MouseEvent>,
    mouseMove$: Observable<MouseEvent>,
  ) {
    const dragMove$ = dragStart$.pipe(
      switchMap((start) => {
        const startX = this.currX;
        const startY = this.currY;
        this.dragging = true;
        return mouseMove$.pipe(
          map((moveEvent) => {
            return ({
              deltaX: moveEvent.pageX - start.pageX,
              deltaY: moveEvent.pageY - start.pageY,
              startX,
              startY,
            });
          }),
          takeUntil(dragEnd$),
        );
      }),
    );

    dragEnd$.subscribe(() => {
      this.dragging = false;
    });

    dragMove$.subscribe(move => {
      this.x.next(this.limit(move.startX + move.deltaX, 0, this.canvasWidth - this.width));
      this.y.next(this.limit(move.startY + move.deltaY, 0, this.canvasWidth - this.height));
    });
  }

  enableDrawing(
    drawStart$: Observable<MouseEvent>,
    drawEnd$: Observable<MouseEvent>,
    mouseMove$: Observable<MouseEvent>,
  ) {
    drawStart$.subscribe(
      () => {
        if (this.dragging) return;
        const { x, y } = this.getCenter();
        const startX = x;
        const startY = y;
        const line$ = mouseMove$.pipe(
          map((moveEvent) => {
            const entity = this.entityPositionProvider.checkIfInside();
            const lineStart = {
              x1: startX,
              y1: startY,
            };
            if (entity) {
              const center = entity.getCenter();
              return ({ ...lineStart, x2: center.x, y2: center.y });
            } else {
              return ({ ...lineStart, x2: moveEvent.offsetX, y2: moveEvent.offsetY });
            }
          }),
          takeUntil(drawEnd$),
        );
        this.linesCreatorService.addLine(line$);
        this.addConnection(line$, drawEnd$);
      },
    );
  }

  addConnection(line$: Observable<Line>, drawEnd$: Observable<MouseEvent>) {
    const sub = drawEnd$.subscribe(() => {
      this.linesCreatorService.removeLine(line$);
      const box = this.entityPositionProvider.checkIfInside();
      if (box) {
        this.entityService.tryConnectIds(this.id, box.id);
      }
      sub.unsubscribe();
    });
  }

  getCenter(): Point {
    return {
      x: this.currX + this.halfWidth,
      y: this.currY + this.halfHeight,
    };
  }

  limit(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}
