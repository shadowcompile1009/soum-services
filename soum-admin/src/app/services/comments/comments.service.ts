import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private apiService: ApiService
  ) { }

  getCommentsLists(page: number, limit: number, params?: string) {
    return this.apiService.secondEnvgetApi(endpoint.commentsListing(page, limit, params));
  }

  deleteComment(comment_id: string) {
    return this.apiService.putSecondApi(endpoint.deleteQ(comment_id), {}, 1);
  }

  updateComments(data, commentId) {
    return this.apiService.putSecondApi(endpoint.updateComment(commentId), data, 1);
  }

}
