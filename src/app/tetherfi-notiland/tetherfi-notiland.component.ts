import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tetherfi-notiland',
  templateUrl: './tetherfi-notiland.component.html',
  styleUrls: ['./tetherfi-notiland.component.scss'],
})
export class TetherfiNotilandComponent implements OnInit, OnDestroy {
  isNotchClicked: boolean = false;
  @Input('warnMessage') warnMessage!: string;
  @Input('warnIcon') warnIcon!: string;
  @Input('isCall') isCall!: boolean;
  @Input('callerName') callerName!: string;
  @Output('result') result = new EventEmitter<boolean>()

  constructor() {}
  ngOnDestroy(): void {
    this.warnMessage = '';
    this.warnIcon = '';
  }

  ngOnInit(): void {}

  onNotchClick() {
    this.isNotchClicked = true;
  }

  onAccept() {
    this.result.emit(true)
  }

  onDecline() {
    this.result.emit(false)
  }
}
