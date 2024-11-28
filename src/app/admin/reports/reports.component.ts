import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { WaveService } from 'angular-wavesurfer-service';
import WaveSurfer from 'wavesurfer.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  data: any;
  p: any = 1;
  searchQuery = '';

  wave: WaveSurfer[] = [];
  currentTimeA: number[] = [];
  totalDurationA: number[] = [];

  tracks: number[] = Array(50).fill(0); // Array of track heights
  trackHeights: number[] = Array(50).fill(20); // Initial heights of tracks
  highlightedBars: number = 0; // Number of highlighted bars
  isPlayingA: boolean[] = [];

  activeTab: string = 'post';

  constructor(private service: SharedService, public waveService: WaveService, private router: Router) { }


  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const modalElement = document.getElementById('ct_edit_community12');

    if (modalElement) {
      // Event listener to pause and reset video when the modal is closed
      modalElement.addEventListener('hidden.bs.modal', () => {
        if (this.videoPlayer.nativeElement) {
          this.videoPlayer.nativeElement.pause(); // Pause the video
          this.videoPlayer.nativeElement.currentTime = 0; // Reset the video to the beginning
        }
      });

      // Event listener to reset the video when the modal is opened
      modalElement.addEventListener('show.bs.modal', () => {
        if (this.videoPlayer.nativeElement) {
          this.videoPlayer.nativeElement.pause(); // Pause the video
          this.videoPlayer.nativeElement.currentTime = 0; // Reset the video to the beginning
          this.currentTime = 0
          this.seekValue = 0
        }
      });
    }
  }


  updateSearch(query: string) {
    this.service.updateSearchQuery(query); // Update the search query in the service
  }

  ngOnInit() {

    // const savedTab = localStorage.getItem('activeTab');
    // this.activeTab = savedTab ? savedTab : 'post';

    document.addEventListener("fullscreenchange", () => {
      this.isFullScreen = !!document.fullscreenElement; // Update the state based on fullscreen status
      if (!this.isFullScreen) {
        // Additional logic can be added here if needed when exiting fullscreen
      }
    });
    this.getReports();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Save the active tab in local storage
    localStorage.setItem('activeTab', tab);
  }

  getReports() {
    this.service.getApi('allReports').subscribe({
      next: resp => {
        // Filter out elements where both community and event are not null
        this.data = resp.data.filter((item: any) => !(item.reportedEntity.community || item.reportedEntity.event));
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


  postDetails: any;
  //userDetails: any;
  reason: any;

  getPostById(post: any, reason: any) {
    console.log('post', post);
    this.reason = reason;
    this.postDetails = { ...post, isExpanded: false };
    //this.userDetails = user;

    setTimeout(() => {
      //this.postDetails?.forEach((item: any, index: any) => {
      if (this.postDetails?.type == 'PODCAST') {
        const waveformId = '#waveform' + this.postDetails.id;
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
        this.wave[this.postDetails.id] = waveInstance;
        waveInstance.load(this.postDetails?.mediaUrl);
        this.isPlayingA[this.postDetails.id] = false;

        waveInstance.on('ready', () => {
          //const index = this.postDetails.findIndex((audio: { id: any; }) => audio.id == this.postDetails?.id);
          this.totalDurationA[this.postDetails.id] = waveInstance.getDuration();
        });

        waveInstance.on('audioprocess', () => {
          //const index = this.postDetails.findIndex((audio: { id: any; }) => audio.id == this.postDetails?.id);
          this.currentTimeA[this.postDetails.id] = waveInstance.getCurrentTime();
        });

        waveInstance.on('play', () => {
          this.isPlayingA[this.postDetails.id] = true;  // Update to playing state
          this.stopOtherAudios(this.postDetails.id);   // Stop all other audios when one plays
        });

        waveInstance.on('pause', () => {
          this.isPlayingA[this.postDetails.id] = false; // Update to paused state
        });

      }

      //});
    }, 200);
  }

  //postData: any;
  shortTextLength: number = 270;

  toggleContent(): void {
    this.postDetails.isExpanded = !this.postDetails.isExpanded;
  }

  shouldShowReadMore(text: string): boolean {
    return text?.length > this.shortTextLength;
  }


  stopOtherAudios(currentIndex: number) {
    this.wave.forEach((waveInstance, index) => {
      if (index !== currentIndex) {
        waveInstance.pause();
        this.isPlayingA[index] = false; // Reset play state for other audios
      }
    });
  }

  togglePlayPause(post: any): void {
    this.wave[post.id].playPause();
  }





  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef>;

  currentVideoId: any | null = null;
  currentTime: number = 0;
  videoDuration: number = 0;

  toggleVideo(videoElement: HTMLVideoElement) {

    if (this.isFullScreen == true) {
      return;
    }
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

      this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;

      this.currentTime = videoElement.currentTime;
      this.setVideoDuration(videoElement);
    }
  }

  seekValue: number = 0;

  // onTimeUpdate1(videoElement: HTMLVideoElement) {
  //   // Update seek bar value as the video progresses
  //   if (videoElement.duration) {
  //     this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;
  //   }
  // }


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

  isFullScreen: boolean = false;

  toggleFullscreen(videoElement: HTMLVideoElement) {
    if (!document.fullscreenElement) {
      this.isFullScreen = true;
      videoElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        //this.isFullScreen = false;
        document.exitFullscreen();
      }
    }
  }

  formatTime(time: number): string {
    if (time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
      return `00:00`;
    }

  }

  getCoachId(uderId: any, role: any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }

  getUserId(uderId: any, role: any) {
    this.router.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`)
  }

  deletePost(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this post!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
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
              this.getReports();
      
            } else {
              this.getReports();
      
            }
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'There was an error deleting your post.',
              'error'
            );
            this.getReports();
            //this.toastr.error('Error deleting account!');
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }


}
