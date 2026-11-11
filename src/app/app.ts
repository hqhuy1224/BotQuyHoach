import { Component } from '@angular/core';

import { HeaderComponent } from './features/layout/header/header';
import { SidebarComponent } from './features/layout/sidebar/sidebar';
import { MapComponent } from './features/map/map';
import { ChatbotComponent } from './features/chatbot/chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    MapComponent,
    ChatbotComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}