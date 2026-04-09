import { Component, HostListener, OnInit } from '@angular/core';
import { PortfolioService } from '../portfolio.service';
import { NgForm } from '@angular/forms';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  typedName: string = '';
  typedRole: string = '';
  message!:string
  fullName: string = 'Hi i am, Raja';
  fullRole: string = '.NET Full Stack Developer';
  isLoading:boolean = false
  status: any = {
    profileViews: null,
    downloads: null,
    resumeViews:null
  }
  //downloadCountNumber: number = 0
  //viewCount:number = 0
  form = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private service: PortfolioService) {}

  ngOnInit() {
    this.startTypingLoop();
    this.onProfileClick();
    this.loadStatus()
   // this.service.trackProfileView().subscribe();
  }
  loadStatus() {
    this.isLoading = true

    this.service.getStats().subscribe(res => {
      this.isLoading = false;
      this.status = res;
      let target = this.status.profileViews;
      let current = 0;
      this.status.profileViews = 0
      const counter = setInterval(() => {
        if (current >= target) {
          clearInterval(counter);
        } else {
          current++;
          this.status.profileViews = current;
        }
      }, 500);

    });
  }
  startTypingLoop() {
    const run = () => {

      // reset
      this.typedName = '';
      this.typedRole = '';

      // type name first
      this.typeEffect(this.fullName, 'name', 120, () => {

        // after name, type role
        this.typeEffect(this.fullRole, 'role', 60, () => {

          // wait and restart
          setTimeout(run, 1500);

        });

      });

    };

    run();
  }
  typeEffect(
    text: string,
    type: 'name' | 'role',
    speed: number,
    callback?: () => void
  ) {
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        if (type === 'name') {
          this.typedName += text.charAt(i);
        } else {
          this.typedRole += text.charAt(i);
        }
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, speed);
  }
  submitForm(myForm: NgForm) {
    this.message = 'sending Please wait....'
    const dataToSend = {
      name: this.form.name,
      email: this.form.email,
      message: this.form.message
    };
    this.service.sendContact(dataToSend).subscribe({
      next: (res) => {
        const result:any = res
        this.message = result?.message
        myForm.resetForm();
        this.form = { name: '', email: '', message: '' };
        setTimeout(() => {
          this.message = '';
        },1000)
      },
      error: (err) => {
        this.message = err;
        setTimeout(() => {
          this.message = '';
        },1000)
      }
    }
    );
  }
  gotoTop() {
    window.scrollTo({behavior:'smooth',top:0})
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const sections = document.querySelectorAll('.section');

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.6;

      if (rect.top < triggerPoint && rect.bottom > 100) {
        // visible section
        sec.classList.add('show');
        sec.classList.remove('hide-up');
      } else if (rect.top >= triggerPoint) {
        // below viewport
        sec.classList.remove('show');
        sec.classList.remove('hide-up');
      } else {
        // above viewport (scroll up)
        sec.classList.remove('show');
        sec.classList.add('hide-up');
      }
    });
  }

  onProfileClick() {
    // 1. Check if this specific tab session has already been counted
    const isAlreadyCounted = sessionStorage.getItem('portfolio_viewed');

    if (!isAlreadyCounted) {
      // 2. Only call the API if it's the first time loading this session
      this.service.logActivity('profile').subscribe({
        next: () => {
          // 3. Mark as counted so refresh doesn't trigger it again
          sessionStorage.setItem('portfolio_viewed', 'true');
          this.loadStatus();
        },
        error: (err) => console.error('Could not log profile view', err)
      });
    }
    // Redirect to URL or perform action
  }

  onDownloadClick() {
    this.isLoading = true
    this.service.logActivity('download').subscribe(
      () => {
        this.loadStatus();
      }
    );
    // Start download logic
  }

  onViewClick() {
    this.isLoading = true
    this.service.logActivity('view').subscribe(
      () => {
        this.loadStatus();
      }
    );
    // Open resume logic
  }

}
