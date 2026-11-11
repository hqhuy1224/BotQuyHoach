import { TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot';

describe('ChatbotComponent', () => {
  async function setup() {
    await TestBed.configureTestingModule({ imports: [ChatbotComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ChatbotComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('loads the chat on first open and preserves the iframe when minimized', async () => {
    const fixture = await setup();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('iframe')).toBeNull();
    fixture.componentInstance.toggle();
    fixture.detectChanges();
    const iframe = element.querySelector('iframe');
    expect(iframe).toBeTruthy();
    fixture.componentInstance.close();
    fixture.detectChanges();
    expect(element.querySelector<HTMLElement>('.chat-panel')!.hidden).toBe(true);
    fixture.componentInstance.toggle();
    fixture.detectChanges();
    expect(element.querySelector('iframe')).toBe(iframe);
    expect(element.querySelector<HTMLElement>('.chat-panel')!.hidden).toBe(false);
  });

  it('keeps dragging within the viewport and stops moving after release', async () => {
    const fixture = await setup();
    const chat = fixture.componentInstance;
    chat.toggle();
    fixture.detectChanges();
    const panel = chat.panel!.nativeElement;
    Object.defineProperty(panel, 'offsetWidth', { value: 300 });
    Object.defineProperty(panel, 'offsetHeight', { value: 400 });
    chat.startDrag({
      button: 0, pointerId: 1, clientX: 10, clientY: 10,
      target: panel.querySelector('strong'),
      currentTarget: { setPointerCapture() {} }, preventDefault() {}
    } as unknown as PointerEvent);
    chat.moveDrag({ pointerId: 1, clientX: -500, clientY: -500 } as PointerEvent);
    expect(chat.position()).toEqual({ x: 8, y: 8 });
    chat.moveDrag({ pointerId: 1, clientX: 10000, clientY: 10000 } as PointerEvent);
    expect(chat.position()).toEqual({
      x: Math.max(8, window.innerWidth - 308),
      y: Math.max(8, window.innerHeight - 408)
    });
    chat.endDrag({ pointerId: 1 } as PointerEvent);
    const position = chat.position();
    chat.moveDrag({ pointerId: 1, clientX: 100, clientY: 100 } as PointerEvent);
    expect(chat.position()).toEqual(position);
    expect(chat.dragging()).toBe(false);
  });
});