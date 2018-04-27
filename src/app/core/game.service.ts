import { Injectable } from '@angular/core';
import {User} from './models/user.model';

@Injectable()
export class GameService {

  data: any;
  user: User;

  constructor() {}

  setData(dati: any) {
    this.data = dati;
  }
  getData() {
    return this.data;
  }
  setUser(user: User) {
    this.user = user;
  }
  getUser() {
    return this.user;
  }
  
 

}
