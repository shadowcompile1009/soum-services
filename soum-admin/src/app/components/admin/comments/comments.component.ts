import { Component, OnInit , OnDestroy} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX } from 'src/app/constants/regex';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { CommentsService } from 'src/app/services/comments/comments.service';
import {
  UpdateUser,
  UsersService,
  UserStatus,
} from 'src/app/services/users/users.service';

declare var $: any;
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit , OnDestroy {
  commentList: any;
  limit: any = 100;
  totalResult: any;
  currentPage: number = 1;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  questionForm: FormGroup;
  sellerTypeOpened: boolean = false;
  sellerTypeSelected: string = '';
  sellerTypes = ['Business Sellers', 'Individual Sellers'];

  questionTypeOpened: boolean = false;
  questionTypeSelected: string = '';
  questionTypes = ['Answered Questions', 'Unanswered Questions'];

  constructor(
    private commentsServices: CommentsService,
    private commonService: CommonService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentPage =
      JSON.parse(localStorage.getItem('comment_page_number')) || 1;
    this.getCommentsListing(this.currentPage);
    this.createQuestionForm();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('comment_page_number');
  }

  createQuestionForm() {
    this.questionForm = this.fb.group({
      commentId: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  getCommentsListing(page: number, params?: string) {
    this.commonService.presentSpinner();
    this.commentsServices.getCommentsLists(page, this.limit, params).subscribe(
      (res) => {
        this.commentList = res.body.responseData.result.listComments;
        this.totalResult = res.body.responseData.result.totalResult;
        this.entries = this.commonService.calculateEntries(
          this.commentList,
          this.currentPage,
          this.limit,
          this.totalResult
        );
        this.commonService.dismissSpinner();
      },
      (error) => {
        console.log(error);
        this.commonService.dismissSpinner();
      }
    );
  }

  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this comment?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        // console.log('Okay' , id);
        //  (click)="deleteComment(comment?._id)"
        this.deleteComment(id);
      } else {
        //  console.log('Cancel');
      }
    });
  }

  deleteComment(comment_id: string) {
    this.commonService.presentSpinner();
    this.commentsServices.deleteComment(comment_id).subscribe(
      (res) => {
        if (res) {
          this.getCommentsListing(this.currentPage);
        }
        this.commonService.dismissSpinner();
      },
      (error) => {
        this.commonService.errorHandler(error);
        this.commonService.dismissSpinner();
      }
    );
  }

  selectPage(event) {
    this.currentPage = event;
    this.prepareGetCommentsListing();
    localStorage.setItem('comment_page_number', event);
  }

  openCloseSellerTypeOptions() {
    this.sellerTypeOpened = !this.sellerTypeOpened;
  }

  openQuestionTypeOptions() {
    this.questionTypeOpened = !this.questionTypeOpened;
  }

  selectSellerType(type) {
    this.sellerTypeSelected = type;
    this.sellerTypeOpened = false;
    this.filterQuestions();
  }

  selectQuestionType(type) {
    this.questionTypeSelected = type;
    this.questionTypeOpened = false;
    this.filterQuestions();
  }

  prepareGetCommentsListing() {
    const selType = this.sellerTypeSelected === this.sellerTypes[0]? 'MerchantSeller' : 'IndividualSeller';
    const isAnswered = this.questionTypeSelected === this.questionTypes[0];
    const paramsArray = [];
    if (this.sellerTypeSelected) {
      paramsArray.push(`sellerType=${selType}`);
    }
    if (this.questionTypeSelected) {
      paramsArray.push(`isAnswered=${isAnswered}`);
    }
    const params = paramsArray.join('&');
    this.getCommentsListing(this.currentPage, params);
  }

  filterQuestions() {
    this.questionTypeOpened = false;
    this.sellerTypeOpened = false;
    this.prepareGetCommentsListing();
  }

  openModalComment(comment) {
    this.questionForm.get('question').setValue(comment.question);
    this.questionForm.get('answer').setValue(comment.answer);
    this.questionForm.get('commentId').setValue(comment._id);
  }

  clearAnswerForm() {
    this.questionForm.reset();
  }

  updateComment() {
    this.commonService.presentSpinner();
    this.commentsServices
      .updateComments(
        { answer: this.questionForm.get('answer').value },
        this.questionForm.get('commentId').value
      )
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.prepareGetCommentsListing();
          this.clearAnswerForm();
        },
        (err) => {
          this.commonService.dismissSpinner();
        }
      );
  }
}
