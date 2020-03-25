import {Component, OnInit} from '@angular/core';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  fullScreenHeight = 400;
  formId: number;

  constructor(private cinchyService: CinchyService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private appService: AppService) {
  }


  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage, false);
    this.cinchyService.login().then(success => {
      if (success) {
        if (localStorage.getItem('fullScreenHeight')) {
          this.fullScreenHeight = parseInt(localStorage.getItem('fullScreenHeight'), 10);
          this.navigateAccordingToFormId();
          console.log('Login Success!');
        }
      }
    }).catch(error => {
      console.log('Login Failed');
    });
  }

// get Full Screen height of screen
  receiveMessage(event) {
    if (event.data.toString().startsWith('[Cinchy][innerHeight]')) {
      this.fullScreenHeight = parseInt(event.data.toString().substring(21), 10) + 4;
      localStorage.setItem('fullScreenHeight', this.fullScreenHeight.toString());
      const elements = document.getElementsByClassName('full-height-element');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        elements[i]['style'].height = this.fullScreenHeight + 'px';
      }
    }
  }

  navigateAccordingToFormId() {
    const formId = this.activatedRoute.snapshot.queryParams.formId;
    console.log('FORM ID', formId);
    if (formId) {
      console.log('IN IF')
      this.appService.formId = formId;
      this.router.navigate(['/form-rows']);
    } else {
      this.router.navigate(['/all-forms']);
    }
  }
}
