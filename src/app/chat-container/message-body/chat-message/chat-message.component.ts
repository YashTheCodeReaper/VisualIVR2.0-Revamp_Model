import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {
  @Input('message') message!: string;
  @Input('classInfo') classInfo!: string;
  @Input('senderInfo') senderInfo!: string;
}
