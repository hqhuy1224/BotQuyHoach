import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  keyword = signal('');

  layers = signal([
    { id: 1, name: 'Bản đồ nền', enabled: true },
    { id: 2, name: 'Ranh giới hành chính', enabled: true },
    { id: 3, name: 'Quy hoạch sử dụng đất', enabled: false },
    { id: 4, name: 'Quy hoạch giao thông', enabled: false },
    { id: 5, name: 'Điểm công trình', enabled: false }
  ]);

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.keyword.set(input.value);
  }

  toggleLayer(id: number) {
    this.layers.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, enabled: !item.enabled }
          : item
      )
    );
  }

  get filteredLayers() {
    const keyword = this.keyword().toLowerCase().trim();

    return this.layers().filter(layer =>
      layer.name.toLowerCase().includes(keyword)
    );
  }

}