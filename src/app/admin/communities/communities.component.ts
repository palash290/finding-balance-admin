import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.css'
})
export class CommunitiesComponent {

  communityData: any;
  loading: boolean = false;
  UploadedFile!: File;
  UploadedEditFile!: File;
  updateDet: any;
  updateId: any;
  searchQueryFilter = '';

  constructor(private route: Router, private service: SharedService, private toastr: ToastrService) { }

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
    this.service.getApi('allCommunities').subscribe({
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
    this.service.getApi(`allCommunities/${this.communityId}`).subscribe({
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
    this.service.getApi(`allCommunities/${this.communityId}`).subscribe({
      next: resp => {
        this.communityFeeds = allPosts?.map((item: any) => ({ ...item, isExpanded: false, isPlaying: false }));
      },
      error: error => {
        console.log(error.message)
      }
    });
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

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
      this.route.navigateByUrl('/user/main/my-profile')
    } else {
      this.route.navigateByUrl(`user/main/my-profile/${uderId}/${role}`);
    }
  }

}
