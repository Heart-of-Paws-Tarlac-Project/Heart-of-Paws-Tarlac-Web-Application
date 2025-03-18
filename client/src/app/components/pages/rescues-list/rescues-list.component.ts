import { Component, OnInit, Input } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RescueService } from '../../../services/rescue.service';
import { CommonModule } from '@angular/common';
import { RescueCardComponent } from '../../ui/rescue-card/rescue-card.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-rescues-list',
  standalone: true,
  imports: [CommonModule, RescueCardComponent],
  templateUrl: './rescues-list.component.html',
  styleUrl: './rescues-list.component.css',
})
export class RescuesListComponent implements OnInit {
  @Input() userType: 'admin' | 'user' = 'user';
  rescueListTitle: string = '';
  constructor(private rescueService: RescueService) {}
  ngOnInit(): void {
    this.rescueService.getRescues();

    this.userType == 'admin'
      ? (this.rescueListTitle = 'All Rescues')
      : (this.rescueListTitle = 'Meet Our Rescues');
  }
  ngAfterViewInit(): void {
    AOS.init();
  }
  get rescues() {
    return this.rescueService.rescues$();
  }
}
