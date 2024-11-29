import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { WaveService } from 'angular-wavesurfer-service';
import WaveSurfer from 'wavesurfer.js';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  role: any;

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location, public waveService: WaveService) { }

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



  wave: WaveSurfer[] = [];
  currentTimeA: number[] = [];
  totalDurationA: number[] = [];

  tracks: number[] = Array(50).fill(0); // Array of track heights
  trackHeights: number[] = Array(50).fill(20); // Initial heights of tracks
  highlightedBars: number = 0; // Number of highlighted bars
  isPlayingA: boolean[] = [];

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

        setTimeout(() => {
          this.postData?.forEach((item: any, index: any) => {
            if (item.type == 'PODCAST') {
              const waveformId = '#waveform' + item.id;
              const waveInstance: any = this.waveService.create({
                container: waveformId,
                waveColor: '#fff',
                progressColor: '#e58934',
                // cursorColor: '#ff5722',
                responsive: true,
                height: 50,
                barWidth: 3,
                barGap: 6
              });
              // this.wave.push(waveInstance); // Store the instance for later use
  
              // waveInstance.load(item?.mediaUrl);
              this.wave[index] = waveInstance;
              waveInstance.load(item?.mediaUrl);
              this.isPlayingA[index] = false;
  
              waveInstance.on('ready', () => {
                const index = this.postData.findIndex((audio: { id: any; }) => audio.id === item.id);
                this.totalDurationA[index] = waveInstance.getDuration();
              });
  
              waveInstance.on('audioprocess', () => {
                const index = this.postData.findIndex((audio: { id: any; }) => audio.id === item.id);
                this.currentTimeA[index] = waveInstance.getCurrentTime();
              });
  
              waveInstance.on('play', () => {
                this.isPlayingA[index] = true;  // Update to playing state
                this.stopOtherAudios(index);   // Stop all other audios when one plays
              });
  
              waveInstance.on('pause', () => {
                this.isPlayingA[index] = false; // Update to paused state
              });
  
            }
            
          });
        }, 200);
        
        // if(resp.data?.Post?.length > 0){
        //   this.isCoachPosts = true;
        // }
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  stopOtherAudios(currentIndex: number) {
    this.wave.forEach((waveInstance, index) => {
      if (index !== currentIndex) {
        waveInstance.pause();
        this.isPlayingA[index] = false; // Reset play state for other audios
      }
    });
  }

  togglePlayPause(index: number): void {
    this.wave[index].playPause();
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

  // formatTime(time: number): string {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  // }

  formatTime(time: number): string {
    if (time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
      return `00:00`;
    }

  }

  deletePost(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this post!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e58934',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.postAPI(`deletePost/${id}`, null).subscribe({
          next: (resp) => {
            if (resp.success) {
              Swal.fire(
                'Deleted!',
                'Your post has been deleted successfully.',
                'success'
              );
              this.getCoachProfile(this.userId);
      
            } else {
              this.getCoachProfile(this.userId);
      
            }
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'There was an error deleting your post.',
              'error'
            );
            this.getCoachProfile(this.userId);
            //this.toastr.error('Error deleting account!');
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }



}
