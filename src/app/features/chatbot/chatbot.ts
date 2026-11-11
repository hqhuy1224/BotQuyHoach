import { Component, ElementRef, HostListener, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss'
})
export class ChatbotComponent {
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;
  @ViewChild('launcher') launcher!: ElementRef<HTMLButtonElement>;
  readonly isOpen = signal(false);
  readonly hasOpened = signal(false);
  readonly dragging = signal(false);
  readonly position = signal<{ x: number; y: number } | null>(null);
  private drag: { pointerId: number; offsetX: number; offsetY: number } | null = null;

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.hasOpened.set(true);
      this.isOpen.set(true);
    }
  }

  close(): void {
    this.drag = null;
    this.dragging.set(false);
    this.isOpen.set(false);
    this.launcher.nativeElement.focus();
  }

  startDrag(event: PointerEvent): void {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    const bounds = this.panel!.nativeElement.getBoundingClientRect();
    this.drag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.dragging.set(true);
    this.moveTo(bounds.left, bounds.top);
    event.preventDefault();
  }

  moveDrag(event: PointerEvent): void {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    this.moveTo(event.clientX - this.drag.offsetX, event.clientY - this.drag.offsetY);
  }

  endDrag(event: PointerEvent): void {
    if (event.pointerId !== this.drag?.pointerId) return;
    this.drag = null;
    this.dragging.set(false);
  }

  @HostListener('window:resize')
  onResize(): void {
    const position = this.position();
    if (position) this.moveTo(position.x, position.y);
  }

  private moveTo(x: number, y: number): void {
    const panel = this.panel!.nativeElement;
    this.position.set({
      x: Math.max(8, Math.min(x, window.innerWidth - panel.offsetWidth - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - panel.offsetHeight - 8))
    });
  }
}
