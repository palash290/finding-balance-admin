import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { WaveService } from 'angular-wavesurfer-service';
import WaveSurfer from 'wavesurfer.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent {

  communityData: any;
  loading: boolean = false;
  UploadedFile!: File;
  UploadedEditFile!: File;
  updateDet: any;
  updateId: any;
  searchQueryFilter = '';

  wave: WaveSurfer[] = [];
  currentTimeA: number[] = [];
  totalDurationA: number[] = [];

  tracks: number[] = Array(50).fill(0); // Array of track heights
  trackHeights: number[] = Array(50).fill(20); // Initial heights of tracks
  highlightedBars: number = 0; // Number of highlighted bars
  isPlayingA: boolean[] = [];

  constructor(private route: Router, private service: SharedService, private toastr: ToastrService, public waveService: WaveService) { }

  toSee: boolean = true
  seeGroupMembesr() {
    this.toSee = !this.toSee
  }

  userId: any;

  ngOnInit(): void {
    //this.getCommunityPosts();
    this.getCommunityData();
  }

  eventImage: any;
  communityId: any;

  communityName: any;
  communityImg: any;
  numberOfParticipant: any;
  numberOfPosts: any;
  isParticipant: boolean = false;
  isAdmin: boolean = false;
  communityParticipants: any;
  communityAdminName: any;
  communityAdminImg: any;
  communityAdminid: any;
  communityAdminRole: any;
  selectedCommunityId: number | null = null;

  getCommunityData() {
    this.service.getApi('allTeams').subscribe({
      next: resp => {
        this.communityData = resp.data;
        //console.log('this.communityData==>',this.communityData);
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  getCommunityProfileData(cId: any, participantCheck: boolean, isAdmin: boolean) {


    this.isAdmin = isAdmin

    this.communityId = cId;
    this.selectedCommunityId = cId;

    localStorage.setItem('communityId', this.communityId)
    this.service.getApi(`allTeams/${this.communityId}`).subscribe({
      next: resp => {


        this.eventImage = resp.data.mediaUrl;
        this.communityName = resp.data.title;
        this.numberOfParticipant = resp.data.numberOfParticipant;
        this.numberOfPosts = resp.data.numberOfPosts;
        this.isParticipant = resp.data.isParticipant;
        //this.isAdmin = resp.data.isAdmin;
        this.communityImg = resp.data.mediaUrl;
        //debugger
        this.communityParticipants = resp.data.Participant;

        this.communityAdminid = resp.data.admin.id;
        this.communityAdminName = resp.data.admin.full_name;
        this.communityAdminImg = resp.data.admin.avatar_url;
        this.communityAdminRole = resp.data.admin.role;

        // this.communityParticipants = resp.data.Participant.filter(
        //   (participant: any) => participant.id !== this.communityAdminid
        // );

        this.getCommunityPosts(resp.data?.posts);

      },
      error: error => {
        console.log(error.message)
      }
    });

  }


  ///////////////feeds///////////////
  communityFeeds: any;

  getCommunityPosts(allPosts: any) {
    this.service.getApi(`allTeams/${this.communityId}`).subscribe({
      next: resp => {
        this.communityFeeds = allPosts?.map((item: any) => ({ ...item, isExpanded: false, isPlaying: false })).reverse();

        setTimeout(() => {
          this.communityFeeds?.forEach((item: any, index: any) => {
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
              this.wave[index] = waveInstance;
              waveInstance.load(item?.mediaUrl);
              this.isPlayingA[index] = false;
  
              waveInstance.on('ready', () => {
                const index = this.communityFeeds.findIndex((audio: { id: any; }) => audio.id === item.id);
                this.totalDurationA[index] = waveInstance.getDuration();
              });
  
              waveInstance.on('audioprocess', () => {
                const index = this.communityFeeds.findIndex((audio: { id: any; }) => audio.id === item.id);
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
      },
      error: error => {
        console.log(error.message)
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

  croppedImage: any | ArrayBuffer | null = null;

  handleCommittedFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedFile = inputElement.files[0];
      this.previewImage(this.UploadedFile);
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.croppedImage = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  handleCommittedFileInput1(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedEditFile = inputElement.files[0];
      this.previewImage1(this.UploadedEditFile);
    }
  }

  previewImage1(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.eventImage = e.target?.result;
    };
    reader.readAsDataURL(file);
  }





  shortTextLength: number = 270;

  toggleContent(index: number): void {
    this.communityFeeds[index].isExpanded = !this.communityFeeds[index].isExpanded;
  }

  shouldShowReadMore(text: string): boolean {
    return text?.length > this.shortTextLength;
  }



  //For video
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



  postComments: any[] = [];
  showCmt: { [key: string]: boolean } = {};
  currentOpenCommentBoxId: number | null = null;



  commentsToShow: { [key: number]: number } = {}; // Track number of comments to show
  readonly defaultCommentsCount = 3;

  getPostComments(postId: any) {
    this.service.getApi(`user/post/comment/${postId}`).subscribe({
      next: resp => {
        this.postComments = resp.data?.map((item: any) => ({ ...item, isExpanded: false }));
        //this.postComments = [...tempData, ...this.postComments]
        //console.log('========>', this.postComments)
        this.commentsToShow[postId] = this.defaultCommentsCount;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  



  toggleCommentText(index: number): void {
    this.postComments[index].isExpanded = !this.postComments[index].isExpanded;
  }

  btnLoaderCmtDel: boolean = false;
  deleteId: any;


  shouldShowLoadMore(id: number): boolean {
    return this.postComments && this.postComments?.length > this.commentsToShow[id];
  }

  loadMoreComments(id: number): void {
    this.commentsToShow[id] += 2; // Load 2 more comments
  }

  ngOnDestroy() {
    this.communityId = ''
    localStorage.setItem('communityId', this.communityId)
  }
  //ngOnDestroy(){}


  isChatActive = false;

  //responsive hide/show
  openChat() {
    this.isChatActive = true;
  }
  closeChat() {
    this.isChatActive = false;
  }



  getCoachId(uderId: any, role: any) {
    if (uderId == this.userId) {
      this.route.navigateByUrl('/admin/main/my-profile')
    } else {
      this.route.navigateByUrl(`admin/main/my-profile/${uderId}/${role}`);
    }
  }

  deleteTeam() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this team!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.postAPI(`deleteTeam/${this.communityId}`, null).subscribe({
          next: (resp) => {
            if (resp.success) {
              Swal.fire(
                'Deleted!',
                'Your team has been deleted successfully.',
                'success'
              );
              this.getCommunityData();
              this.communityName = '';
            } else {
              this.getCommunityData();
            }
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'There was an error deleting your team.',
              'error'
            );
            this.getCommunityData();
            console.error('Error deleting account', error);
          }
        });
      }
    });
  }
  

}
