import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  role: any;

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location) { }

  backClicked() {
    this.location.back();
  }

  profileForm!: FormGroup;
  userDet: any;
  userEmail: any;
  name: any;
  cover_photo_url: any;
  avatar_url: any
  category: any;
  accomplishments: any;
  certificates: any;

  userId: any;
  userRole: any;
  loginuserId: any;
  routerole: any;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.routerole = params.get('role');
    });
    console.log('this.routerole ', this.routerole);

    if (this.routerole == 'COACH') {
      this.getCoachProfile(this.userId);
    } else {
      this.getUserProfile(this.userId);
    }

    //this.getProfileData();
    this.loginuserId = localStorage.getItem('fbId');
  }

  //if coach see coach profile
  isCoachPosts: boolean = false;
  getCoachProfile(userId: any) {
    const url = `allCoaches/${userId}`;
    this.service.getApi(url).subscribe({
      next: resp => {

        this.userRole = resp.data.role;
        this.userEmail = resp.data.about_me;
        this.name = resp.data.full_name;
        this.avatar_url = resp.data.avatar_url;
        this.cover_photo_url = resp.data.cover_photo_url;
        this.education = resp.data.education;
        this.category = resp.data.category?.name;

        this.accomplishments = resp.data.accomplishments?.split(',').map((accomplishments: string) => accomplishments.trim());
        this.certificates = resp.data.certificates?.split(',').map((certificate: string) => certificate.trim());
        this.education = resp.data.education;

        this.selectedCategoryNames = resp.data.CoachCategory?.map((item: { category: { name: any; }; }) => item.category.name);

        this.postData = resp.data?.Post?.map((item: any) => ({ ...item, isExpanded: false, isPlaying: false }));
        // if(resp.data?.Post?.length > 0){
        //   this.isCoachPosts = true;
        // }
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  url: any;
  getUserProfile(userId: any) {

    this.url = `allUsers/${userId}`;

    //const url = this.isCoach ? `coach/userProfile/${userId}` : `user/getCoachProfile/${userId}`;
    this.service.getApi(this.url).subscribe({
      next: resp => {

        this.userRole = resp.data.role;
        this.userEmail = resp.data.about_me;
        this.name = resp.data.full_name;
        this.avatar_url = resp.data.avatar_url;
        this.cover_photo_url = resp.data.cover_photo_url;
        this.education = resp.data.education;
        this.category = resp.data.category?.name;
        this.experience = resp.data.experience;

        this.accomplishments = resp.data.accomplishments?.split(',').map((accomplishments: string) => accomplishments.trim());
        this.certificates = resp.data.certificates?.split(',').map((certificate: string) => certificate.trim());
        this.education = resp.data.education;

        this.selectedCategoryNames = resp.data.CoachCategory?.map((item: { category: { name: any; }; }) => item.category.name);

        // if (!this.isCoach) {
        //   this.getSingleCoachPosts(userId);
        // }
      },
      // error: error => {
      //   this.getCoachProfile(this.userId);
      //   console.log(error.message);
      // }
    });
  }

  selectedCategoryNames: string[] = [];
  education: any;
  experience: any;

  // loadUserProfile() {
  //   this.service.getApi(this.isCoach ? 'coach/myProfile' : 'user/myProfile').subscribe({
  //     next: (resp) => {
  //       if (this.isCoach) {
  //         this.userEmail = resp.data.about_me;
  //         this.name = resp.data.full_name;
  //         this.avatar_url = resp.data.avatar_url;
  //         this.cover_photo_url = resp.data.cover_photo_url;
  //         this.category = resp.data.category.name;
  //         this.accomplishments = resp.data.accomplishments?.split(',').map((accomplishments: string) => accomplishments.trim());
  //         this.certificates = resp.data.certificates?.split(',').map((certificate: string) => certificate.trim());
  //         this.education = resp.data.education;
  //         this.experience = resp.data.experience;
  //         this.selectedCategoryNames = resp.data.CoachCategory?.map((item: { category: { name: any; }; }) => item.category.name);
  //         //debugger

  //         //this.postData = resp.data?.Post?.map((item: any) => ({ ...item, isExpanded: false, isPlaying: false })).reverse();

  //       } else {
  //         this.userEmail = resp.user.about_me;
  //         this.name = resp.user.full_name;
  //         this.avatar_url = resp.user.avatar_url;
  //         this.cover_photo_url = resp.user.cover_photo_url;
  //         this.education = resp.user.education;
  //       }

  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     }
  //   });
  // }


  postData: any;
  shortTextLength: number = 270;

  // getSingleCoachPosts(coachId: any) {
  //   this.service.getApi(`user/allPosts/coach/${coachId}`).subscribe({
  //     next: resp => {
  //       this.postData = resp.data?.map((item: any) => ({ ...item, isExpanded: false, isPlaying: false }));
  //     },
  //     error: error => {
  //       console.log(error.message)
  //     }
  //   });
  // }

  // getProfileData() {
  //   this.service.getApi(this.isCoach ? 'coach/post' : 'user/allPosts').subscribe({
  //     next: resp => {
  //       if (this.isCoach) {
  //         this.postData = resp.data?.map((item: any) => ({ ...item, isExpanded: false, isPlaying: false }));
  //       }
  //     },
  //     error: error => {
  //       console.log(error.message)
  //     }
  //   });
  // }


  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  isPlaying: boolean = false;

  togglePlayback() {
    const player = this.audioPlayer.nativeElement;
    if (this.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  toggleContent(index: number): void {
    this.postData[index].isExpanded = !this.postData[index].isExpanded;
  }

  shouldShowReadMore(text: string): boolean {
    return text?.length > this.shortTextLength;
  }


  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef>;

  currentVideoId: any | null = null;
  currentTime: number = 0;
  videoDuration: number = 0;

  toggleVideo(videoElement: HTMLVideoElement) {

    // if (this.currentAudio) {
    //   this.currentAudio.pause();
    // }

    if (this.currentVideoId && this.currentVideoId !== videoElement) {
      this.currentVideoId.pause(); // Pause the currently playing video
    }

    if (videoElement.paused) {
      videoElement.play();
      this.currentVideoId = videoElement;
    } else {
      videoElement.pause();
      this.currentVideoId = null;
    }
  }

  isVideoPlaying(videoElement: HTMLVideoElement): boolean {
    return videoElement === this.currentVideoId && !videoElement.paused;
  }

  onTimeUpdate(videoElement: HTMLVideoElement) {
    if (this.isVideoPlaying(videoElement)) {
      const seekBar: HTMLInputElement = document.querySelector('.custom-seekbar')!;
      seekBar.value = (videoElement.currentTime / videoElement.duration * 100).toString();
      this.currentTime = videoElement.currentTime;
      this.setVideoDuration(videoElement);
    }
  }

  setVideoDuration(videoElement: HTMLVideoElement) {
    if (this.isVideoPlaying(videoElement)) {
      const seekBar: HTMLInputElement = document.querySelector('.custom-seekbar')!;
      seekBar.max = "100";
      this.videoDuration = videoElement.duration;
    }
  }

  onSeek(event: Event, videoElement: HTMLVideoElement) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const time = (parseFloat(value) / 100) * videoElement.duration;
    videoElement.currentTime = time;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }


}
